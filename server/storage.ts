import { type User, type InsertUser, type AozAgent, type InsertAozAgent, type AgentTask, type InsertAgentTask } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  listAgents(): Promise<AozAgent[]>;
  createAgent(agent: InsertAozAgent, walletAddress: string): Promise<AozAgent>;
  getAgent(id: number): Promise<AozAgent | undefined>;
  
  listTasksByAgent(agentId: number): Promise<AgentTask[]>;
  createTask(task: InsertAgentTask): Promise<AgentTask>;
  getTask(id: number): Promise<AgentTask | undefined>;
  updateTaskStatus(id: number, status: string, aiResult?: string, errorMessage?: string): Promise<AgentTask | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private agents: Map<number, AozAgent>;
  private tasks: Map<number, AgentTask>;
  private nextAgentId: number;
  private nextTaskId: number;

  constructor() {
    this.users = new Map();
    this.agents = new Map();
    this.tasks = new Map();
    this.nextAgentId = 1;
    this.nextTaskId = 1;
    
    // Seed some demo agents for testing
    this.seedDemoAgents();
  }
  
  private seedDemoAgents() {
    const VERIFIED_ADDRESS = "DtMf6R4kyRsAKryyXgyEhjMNTn6wpjNKsBMcqTvqxECF";
    
    // Verified agent
    const verifiedAgent: AozAgent = {
      id: this.nextAgentId++,
      agentName: "aozAgentDealer",
      agentType: "ALLIANCE",
      description: "Official AOZ agent dealer managing verified AI agents on Solana",
      settlementAddress: VERIFIED_ADDRESS,
      oathDescription: "Facilitate trustless AI agent transactions through verified TEE execution",
      fulfillmentDescription: "Complete 100 verified agent transactions",
      oathStatus: "minted",
      askStatus: "settled",
      promiseStatus: "settled",
      verified: "true",
      teeAttestation: "#0400...0000",
      teeUrl: "https://phala.network",
      walletAddress: VERIFIED_ADDRESS,
      explorerUrl: `https://solscan.io/account/${VERIFIED_ADDRESS}`,
      holder: "AOZ Treasury",
      holderUrl: `https://solscan.io/account/${VERIFIED_ADDRESS}`,
      openSeaUrl: `https://magiceden.io/item-details/${VERIFIED_ADDRESS}`,
      createdAt: new Date(),
    };
    this.agents.set(verifiedAgent.id, verifiedAgent);
    
    // Unverified agents
    const demoAgents = [
      {
        name: "LoanMaster3000",
        type: "LOAN",
        desc: "Automated micro-lending agent for DeFi protocols",
        oath: "Provide instant loans with 5% APR for verified collateral",
        fulfillment: "Secure 10 SOL in verified lending pool",
        wallet: "3Q9ZqJ8VEkpJ3wKG7xdM2VxH8c9QKyNbC1rW4sD5tPu8",
      },
      {
        name: "SwapBot",
        type: "TRANSACTION",
        desc: "MEV-resistant token swap execution agent",
        oath: "Execute swaps with minimal slippage and front-run protection",
        fulfillment: "Complete 50 successful swaps with <0.5% slippage",
        wallet: "7xK2pW8vN4mQ3hJ9dT5fC6bV1eR8sL9tY3nX4cZ2aM7w",
      },
      {
        name: "DevOps Assistant",
        type: "EMPLOYMENT",
        desc: "Autonomous agent for monitoring and maintaining smart contracts",
        oath: "Monitor contract health and auto-respond to critical issues",
        fulfillment: "Maintain 99.9% uptime for monitored contracts",
        wallet: "5tR9wX2nK4vP8mL6jC3bH1eY7dT4sW9fN6qZ8cV5aM3x",
      },
    ];
    
    demoAgents.forEach((demo) => {
      const agent: AozAgent = {
        id: this.nextAgentId++,
        agentName: demo.name,
        agentType: demo.type as any,
        description: demo.desc,
        settlementAddress: demo.wallet,
        oathDescription: demo.oath,
        fulfillmentDescription: demo.fulfillment,
        oathStatus: "minted",
        askStatus: "pending",
        promiseStatus: "pending",
        verified: "false",
        teeAttestation: "#0400...0000",
        teeUrl: null,
        walletAddress: demo.wallet,
        explorerUrl: `https://solscan.io/account/${demo.wallet}`,
        holder: "Community",
        holderUrl: null,
        openSeaUrl: `https://magiceden.io/item-details/${demo.wallet}`,
        createdAt: new Date(),
      };
      this.agents.set(agent.id, agent);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async listAgents(): Promise<AozAgent[]> {
    return Array.from(this.agents.values()).sort((a, b) => b.id - a.id);
  }

  async createAgent(agent: InsertAozAgent, walletAddress: string): Promise<AozAgent> {
    const id = this.nextAgentId++;
    const now = new Date();
    
    // Only DtMf6R4kyRsAKryyXgyEhjMNTn6wpjNKsBMcqTvqxECF is verified
    const VERIFIED_ADDRESS = "DtMf6R4kyRsAKryyXgyEhjMNTn6wpjNKsBMcqTvqxECF";
    const isVerified = walletAddress === VERIFIED_ADDRESS;
    
    const aozAgent: AozAgent = {
      ...agent,
      id,
      walletAddress,
      explorerUrl: `https://solscan.io/account/${walletAddress}`,
      holderUrl: `https://solscan.io/account/${agent.settlementAddress}`,
      openSeaUrl: `https://magiceden.io/item-details/${walletAddress}`,
      oathStatus: "minted",
      askStatus: "pending",
      promiseStatus: "pending",
      verified: isVerified ? "true" : "false",
      teeAttestation: "#0400...0000",
      teeUrl: agent.teeUrl ?? null,
      holder: "Minter",
      createdAt: now,
    };
    
    this.agents.set(id, aozAgent);
    return aozAgent;
  }

  async getAgent(id: number): Promise<AozAgent | undefined> {
    return this.agents.get(id);
  }

  async listTasksByAgent(agentId: number): Promise<AgentTask[]> {
    return Array.from(this.tasks.values())
      .filter((task) => task.agentId === agentId)
      .sort((a, b) => b.id - a.id);
  }

  async createTask(task: InsertAgentTask): Promise<AgentTask> {
    const id = this.nextTaskId++;
    const now = new Date();
    
    const agentTask: AgentTask = {
      ...task,
      id,
      status: "pending",
      aiResult: task.aiResult ?? null,
      errorMessage: task.errorMessage ?? null,
      createdAt: now,
      completedAt: null,
    };
    
    this.tasks.set(id, agentTask);
    return agentTask;
  }

  async getTask(id: number): Promise<AgentTask | undefined> {
    return this.tasks.get(id);
  }

  async updateTaskStatus(
    id: number,
    status: string,
    aiResult?: string,
    errorMessage?: string
  ): Promise<AgentTask | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask: AgentTask = {
      ...task,
      status,
      aiResult: aiResult ?? task.aiResult,
      errorMessage: errorMessage ?? task.errorMessage,
      completedAt: status === "completed" || status === "failed" ? new Date() : task.completedAt,
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
}

export const storage = new MemStorage();
