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
      
      if (x402 && X402_ENABLED) {
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

        // Verify payment
        const verified = await x402.verifyPayment(paymentHeader, paymentRequirements);
        if (!verified) {
          res.status(402).json({ 
            error: 'Invalid payment',
            details: 'Payment verification failed. Please try again.'
          });
          return;
        }

        // Payment verified - will settle after agent creation
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
      if (x402 && X402_ENABLED && paymentHeader && paymentRequirements) {
        try {
          await x402.settlePayment(paymentHeader, paymentRequirements);
        } catch (error) {
          console.error('Error settling x402 payment:', error);
          // Agent is already created, so log but don't fail the request
        }
      }

      res.status(201).json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(500).json({ error: "Failed to create agent" });
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
