import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createAgentSchema, createTaskSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { X402PaymentHandler } from "x402-solana/server";
import { executeAITask } from "./ai-service";

// x402 configuration
// TEMPORARY: Disable x402 for local testing (enable when deployed with proper RPC)
const X402_ENABLED = process.env.X402_ENABLED === 'true';
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://facilitator.payai.network';
const AGENT_CREATION_PRICE = process.env.AGENT_CREATION_PRICE || '1000000'; // $1.00 USDC (1 million micro-units)
const TREASURY_ADDRESS = process.env.TREASURY_WALLET_ADDRESS || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'; // Default treasury wallet
const PAYMENT_TIMEOUT_MS = parseInt(process.env.PAYMENT_TIMEOUT_MS || '60000'); // 60 seconds default

// Transaction monitoring storage
interface PaymentTransaction {
  id: string;
  walletAddress: string;
  amount: string;
  status: 'pending' | 'verified' | 'settled' | 'failed';
  timestamp: number;
  signature?: string;
  errorMessage?: string;
}

const paymentTransactions: Map<string, PaymentTransaction> = new Map();

// TEMPORARY: Force mainnet for local testing
const USE_MAINNET = true; // Set to false to switch back to devnet
const IS_PRODUCTION = USE_MAINNET || process.env.NODE_ENV === 'production';
const USDC_MINT = IS_PRODUCTION
  ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // Mainnet USDC
  : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Devnet USDC
const SOLANA_NETWORK = IS_PRODUCTION ? 'solana' : 'solana-devnet';

// Validate x402 configuration on startup
if (X402_ENABLED) {
  if (!TREASURY_ADDRESS || TREASURY_ADDRESS.length < 32) {
    console.error('x402: Invalid TREASURY_WALLET_ADDRESS configuration');
    throw new Error('x402 requires valid treasury wallet address');
  }
  console.log(`x402: Enabled on ${SOLANA_NETWORK} with price ${AGENT_CREATION_PRICE} micro-USDC`);
  console.log(`x402: Payment timeout set to ${PAYMENT_TIMEOUT_MS}ms`);
}

// Initialize x402 payment handler if enabled
let x402: X402PaymentHandler | null = null;
if (X402_ENABLED) {
  x402 = new X402PaymentHandler({
    network: SOLANA_NETWORK,
    treasuryAddress: TREASURY_ADDRESS,
    facilitatorUrl: FACILITATOR_URL,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all agents
  app.get("/api/agents", async (_req: Request, res: Response) => {
    try {
      const agents = await storage.listAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  // Create a new agent
  app.post("/api/agents", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = createAgentSchema.safeParse(req.body);
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
        return;
      }

      const agentData = validation.data;
      
      // Extract wallet address from header (should be set by frontend)
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        res.status(400).json({ 
          error: "Wallet address required",
          details: "Please connect your Phantom wallet" 
        });
        return;
      }

      // x402 payment handling (if enabled)
      let paymentHeader: any = null;
      let paymentRequirements: any = null;
      let transactionId: string | null = null;
      
      if (x402 && X402_ENABLED) {
        // Generate unique transaction ID
        transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        // Extract payment header
        paymentHeader = x402.extractPayment(req.headers as any);

        // Create payment requirements (reuse this object for settlement)
        paymentRequirements = await x402.createPaymentRequirements({
          price: {
            amount: AGENT_CREATION_PRICE,
            asset: {
              address: USDC_MINT,  // USDC token
              decimals: 6  // USDC has 6 decimals
            }
          },
          network: SOLANA_NETWORK,
          config: {
            description: 'Create AI Agent on AOZ Platform',
            resource: `${req.protocol}://${req.get('host')}/api/agents`,
          }
        });

        // If no payment header, return 402
        if (!paymentHeader) {
          const response = x402.create402Response(paymentRequirements);
          res.status(response.status).json(response.body);
          return;
        }

        // Create transaction record
        const transaction: PaymentTransaction = {
          id: transactionId,
          walletAddress,
          amount: AGENT_CREATION_PRICE,
          status: 'pending',
          timestamp: Date.now(),
        };
        paymentTransactions.set(transactionId, transaction);
        console.log(`x402: Transaction ${transactionId} created for wallet ${walletAddress}`);

        // Verify payment with timeout
        const verificationTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Payment verification timeout')), PAYMENT_TIMEOUT_MS)
        );
        
        try {
          const verified = await Promise.race([
            x402.verifyPayment(paymentHeader, paymentRequirements),
            verificationTimeout
          ]);
          
          if (!verified) {
            transaction.status = 'failed';
            transaction.errorMessage = 'Payment verification failed';
            console.log(`x402: Transaction ${transactionId} failed - verification rejected`);
            res.status(402).json({ 
              error: 'Invalid payment',
              details: 'Payment verification failed. Please try again.',
              transactionId
            });
            return;
          }
          
          // Update transaction status
          transaction.status = 'verified';
          console.log(`x402: Transaction ${transactionId} verified successfully`);
        } catch (error) {
          transaction.status = 'failed';
          transaction.errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log(`x402: Transaction ${transactionId} failed - ${transaction.errorMessage}`);
          res.status(402).json({ 
            error: 'Payment verification error',
            details: error instanceof Error ? error.message : 'Payment verification failed',
            transactionId
          });
          return;
        }
      }

      // Create agent with mapped fields
      const agent = await storage.createAgent(
        {
          agentName: agentData.agentName,
          agentType: agentData.agentType,
          description: agentData.description,
          settlementAddress: agentData.settlementAddress,
          oathDescription: agentData.oathDescription,
          fulfillmentDescription: agentData.fulfillmentDescription,
          teeUrl: null,
          holderUrl: null,
          openSeaUrl: null,
        },
        walletAddress
      );

      // Settle payment if x402 is enabled and payment was made
      if (x402 && X402_ENABLED && paymentHeader && paymentRequirements && transactionId) {
        const transaction = paymentTransactions.get(transactionId);
        try {
          await x402.settlePayment(paymentHeader, paymentRequirements);
          if (transaction) {
            transaction.status = 'settled';
            console.log(`x402: Transaction ${transactionId} settled successfully`);
          }
        } catch (error) {
          console.error(`x402: Error settling transaction ${transactionId}:`, error);
          if (transaction) {
            transaction.status = 'failed';
            transaction.errorMessage = 'Settlement failed';
          }
          // Agent is already created, so log but don't fail the request
        }
      }

      res.status(201).json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  // x402 payment transaction status endpoint
  app.get("/api/x402/transactions/:transactionId", async (req: Request, res: Response) => {
    try {
      if (!X402_ENABLED) {
        res.status(404).json({ error: "x402 payments not enabled" });
        return;
      }

      const { transactionId } = req.params;
      const transaction = paymentTransactions.get(transactionId);

      if (!transaction) {
        res.status(404).json({ error: "Transaction not found" });
        return;
      }

      res.json({
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
        errorMessage: transaction.errorMessage || null,
      });
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Failed to fetch transaction status" });
    }
  });

  // x402 payment transactions history for a wallet
  app.get("/api/x402/transactions", async (req: Request, res: Response) => {
    try {
      if (!X402_ENABLED) {
        res.status(404).json({ error: "x402 payments not enabled" });
        return;
      }

      const walletAddress = req.query.wallet as string;
      if (!walletAddress) {
        res.status(400).json({ error: "Wallet address required" });
        return;
      }

      const transactions = Array.from(paymentTransactions.values())
        .filter(tx => tx.walletAddress === walletAddress)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(tx => ({
          id: tx.id,
          status: tx.status,
          amount: tx.amount,
          timestamp: tx.timestamp,
          errorMessage: tx.errorMessage || null,
        }));

      res.json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transaction history" });
    }
  });

  // Get tasks for a specific agent
  app.get("/api/agents/:agentId/tasks", async (req: Request, res: Response) => {
    try {
      const agentId = parseInt(req.params.agentId);
      if (isNaN(agentId)) {
        res.status(400).json({ error: "Invalid agent ID" });
        return;
      }

      const tasks = await storage.listTasksByAgent(agentId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  // Create a new task for an agent
  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validation = createTaskSchema.safeParse(req.body);
      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        res.status(400).json({ 
          error: "Validation failed", 
          details: validationError.message 
        });
        return;
      }

      const taskData = validation.data;

      // Verify agent exists
      const agent = await storage.getAgent(taskData.agentId);
      if (!agent) {
        res.status(404).json({ error: "Agent not found" });
        return;
      }

      // Create task
      const task = await storage.createTask({
        agentId: taskData.agentId,
        taskType: taskData.taskType,
        taskDescription: taskData.taskDescription,
        aiResult: null,
        errorMessage: null,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // Execute a task with AI
  app.post("/api/tasks/:taskId/execute", async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.taskId);
      if (isNaN(taskId)) {
        res.status(400).json({ error: "Invalid task ID" });
        return;
      }

      // Get the task
      const task = await storage.getTask(taskId);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      // Check if task is already completed or processing
      if (task.status === "completed" || task.status === "processing") {
        res.status(400).json({ 
          error: "Task already processed",
          details: `Task status is ${task.status}` 
        });
        return;
      }

      // Get agent context
      const agent = await storage.getAgent(task.agentId);
      if (!agent) {
        res.status(404).json({ error: "Agent not found" });
        return;
      }

      // Update status to processing
      await storage.updateTaskStatus(taskId, "processing");

      try {
        // Execute AI task
        const aiResult = await executeAITask(
          task.taskType,
          task.taskDescription,
          {
            name: agent.agentName,
            type: agent.agentType,
            description: agent.description,
          }
        );

        // Update task with result
        const updatedTask = await storage.updateTaskStatus(
          taskId,
          "completed",
          JSON.stringify(aiResult)
        );

        res.json(updatedTask);
      } catch (aiError) {
        // Update task with error
        const errorMessage = aiError instanceof Error ? aiError.message : "AI execution failed";
        const updatedTask = await storage.updateTaskStatus(
          taskId,
          "failed",
          undefined,
          errorMessage
        );
        
        res.status(500).json({
          error: "AI execution failed",
          task: updatedTask
        });
      }
    } catch (error) {
      console.error("Error executing task:", error);
      res.status(500).json({ error: "Failed to execute task" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
