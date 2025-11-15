import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const aozAgents = pgTable("aoz_agents", {
  id: integer("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  agentType: text("agent_type").notNull(),
  description: text("description").notNull(),
  settlementAddress: text("settlement_address").notNull(),
  oathDescription: text("oath_description").notNull(),
  fulfillmentDescription: text("fulfillment_description").notNull(),
  oathStatus: text("oath_status").notNull().default("minted"),
  askStatus: text("ask_status").notNull().default("pending"),
  promiseStatus: text("promise_status").notNull().default("pending"),
  verified: text("verified").notNull().default("true"),
  teeAttestation: text("tee_attestation").notNull().default("#0400...0000"),
  teeUrl: text("tee_url"),
  walletAddress: text("wallet_address").notNull(),
  explorerUrl: text("explorer_url"),
  holder: text("holder").notNull().default("Minter"),
  holderUrl: text("holder_url"),
  openSeaUrl: text("opensea_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAozAgentSchema = createInsertSchema(aozAgents).omit({
  id: true,
  createdAt: true,
  oathStatus: true,
  askStatus: true,
  promiseStatus: true,
  verified: true,
  teeAttestation: true,
  holder: true,
  walletAddress: true,
  explorerUrl: true,
});

export type InsertAozAgent = z.infer<typeof insertAozAgentSchema>;
export type AozAgent = typeof aozAgents.$inferSelect;

export const createAgentSchema = z.object({
  agentName: z.string().min(1, "Agent name is required").max(100, "Agent name must be less than 100 characters"),
  agentType: z.enum(["LOAN", "TRANSACTION", "EMPLOYMENT", "ALLIANCE"], {
    required_error: "Please select an agent type",
  }),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  settlementAddress: z.string().min(32, "Invalid Solana address").max(44, "Invalid Solana address"),
  oathDescription: z.string().min(10, "Oath description must be at least 10 characters").max(500, "Oath description must be less than 500 characters"),
  fulfillmentDescription: z.string().min(10, "Fulfillment description must be at least 10 characters").max(500, "Fulfillment description must be less than 500 characters"),
});

export type CreateAgent = z.infer<typeof createAgentSchema>;

// AI Tasks for agents
export const agentTasks = pgTable("agent_tasks", {
  id: integer("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => aozAgents.id, { onDelete: "cascade" }),
  taskType: text("task_type").notNull(), // "text_generation", "analysis", "transaction", etc.
  taskDescription: text("task_description").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "processing", "completed", "failed"
  aiResult: text("ai_result"), // JSON string with AI response
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAgentTaskSchema = createInsertSchema(agentTasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
});

export type InsertAgentTask = z.infer<typeof insertAgentTaskSchema>;
export type AgentTask = typeof agentTasks.$inferSelect;

// Schema for creating a new task via API
export const createTaskSchema = z.object({
  agentId: z.number().int().positive(),
  taskType: z.enum(["text_generation", "analysis", "summarization", "question_answer"], {
    required_error: "Please select a task type",
  }),
  taskDescription: z.string().min(10, "Task description must be at least 10 characters").max(1000, "Task description must be less than 1000 characters"),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
