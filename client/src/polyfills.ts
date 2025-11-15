// Browser polyfills for Node.js packages
import { Buffer } from "buffer";

// Make Buffer globally available for Solana/x402 packages
(window as any).global = window;
(window as any).Buffer = Buffer;
globalThis.Buffer = Buffer;
