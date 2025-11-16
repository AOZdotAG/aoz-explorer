/**
 * Type-safe constants for AOZ Agent system
 */

export const AGENT_TYPES = {
  LOAN: 'LOAN',
  TRANSACTION: 'TRANSACTION',
  EMPLOYMENT: 'EMPLOYMENT',
  ALLIANCE: 'ALLIANCE',
} as const;

export type AgentType = typeof AGENT_TYPES[keyof typeof AGENT_TYPES];

export const OATH_STATUSES = {
  MINTED: 'minted',
  COMPLETED: 'completed',
  PENDING: 'pending',
  SETTLED: 'settled',
} as const;

export type OathStatus = typeof OATH_STATUSES[keyof typeof OATH_STATUSES];

export const FULFILLMENT_STATUSES = {
  SETTLED: 'settled',
  PENDING: 'pending',
} as const;

export type FulfillmentStatus = typeof FULFILLMENT_STATUSES[keyof typeof FULFILLMENT_STATUSES];

/**
 * Solana address validation regex
 * Base58 format, 32-44 characters
 */
export const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
