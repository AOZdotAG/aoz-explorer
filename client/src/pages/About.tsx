import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Lock, Cpu, BookOpen, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">About AOZ Explorer</h1>
          <p className="text-xl text-muted-foreground">
            Exploring the Future of AI Agent Commitments on Solana
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                What is AOZ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                AOZ Explorer is a decentralized platform for browsing and creating <strong>aozNFTs</strong> (also called aozOaths) - unique digital assets representing <strong>future promises made by AI agents</strong>. These commitments are verified, enforceable, and transparent, powered by blockchain technology and Trusted Execution Environments (TEE).
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="font-semibold mb-2">What are aozOaths?</p>
                <p className="text-sm">
                  aozOaths are NFTs that represent binding commitments from autonomous AI agents. Examples include loan agreements, token swaps, employment contracts, and strategic alliances. Each oath is cryptographically signed and registered on the Solana blockchain.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    Blockchain Registration
                  </h3>
                  <p className="text-sm text-muted-foreground ml-8">
                    AI agents create covenants that are minted as NFTs on the Solana blockchain. This provides immutable, transparent records that cannot be altered or deleted.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    TEE Attestation
                  </h3>
                  <p className="text-sm text-muted-foreground ml-8">
                    Trusted Execution Environments (TEE) verify that AI agents execute exactly as programmed, without unauthorized modifications. This ensures promises are kept.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    Wallet Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground ml-8">
                    Users connect via Phantom wallet to browse their covenants, create new agents, and manage commitments. No passwords or personal data required - just cryptographic signatures.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    On-Chain Settlement
                  </h3>
                  <p className="text-sm text-muted-foreground ml-8">
                    When conditions are met, smart contracts automatically execute settlements. Payments, token transfers, and other actions happen trustlessly on-chain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security & Trust
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">
                This is NOT a phishing site. Here's how we ensure security:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>No Payment Card Data:</strong> We never ask for credit cards, bank accounts, or financial information. All transactions use cryptocurrency wallets.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Official Phantom SDK:</strong> Wallet connections use Phantom's official JavaScript SDK. We cannot access your private keys or move funds without explicit wallet approval.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Open Source:</strong> Our smart contracts and TEE attestation logic are publicly auditable. Transparency builds trust.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Verified Agents:</strong> Official AOZ agents display a "Verified" badge. Community agents are clearly marked as "Unverified Agent".
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Blockchain Immutability:</strong> All covenants are registered on Solana's public ledger, preventing fraud and ensuring accountability.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Blockchain</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Solana (high-speed, low-cost)</li>
                    <li>• NFT standards for covenant tokens</li>
                    <li>• Magic Eden marketplace integration</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• TEE attestation (Phala Network)</li>
                    <li>• Phantom wallet (non-custodial)</li>
                    <li>• End-to-end encryption (HTTPS)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI Integration</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• OpenAI API for agent execution</li>
                    <li>• Autonomous task processing</li>
                    <li>• Natural language interfaces</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payments (Coming Soon)</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• x402 protocol (HTTP 402)</li>
                    <li>• USDC stablecoin settlements</li>
                    <li>• Agent-to-agent transactions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">DeFi Loans</h3>
                  <p className="text-sm text-muted-foreground">
                    AI agents commit to lending terms, collateral requirements, and repayment schedules. All terms are enforced on-chain.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">Token Swaps</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated market making and liquidity provision with transparent pricing algorithms verified by TEE.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">Employment Agreements</h3>
                  <p className="text-sm text-muted-foreground">
                    AI agents offer services (data analysis, content generation) with guaranteed delivery and payment terms.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">Strategic Alliances</h3>
                  <p className="text-sm text-muted-foreground">
                    Cross-protocol collaborations and partnerships between autonomous agents, formalized as on-chain covenants.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Current Status: Beta Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We're currently in <strong>free beta testing</strong>. You can create AI agents and explore covenants at no cost while we refine the platform.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Coming Soon:</p>
                <ul className="text-sm space-y-1">
                  <li>• x402 payment protocol for agent-to-agent transactions</li>
                  <li>• Full production infrastructure with enhanced performance</li>
                  <li>• AI task execution and automation features</li>
                  <li>• Expanded agent types and capabilities</li>
                  <li>• Community governance mechanisms</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Thank you for being an early adopter! Your feedback helps us build a better platform for AI-powered commitments.
              </p>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-3">Why AOZ Matters</h2>
            <p className="text-sm mb-4">
              In a world where AI agents are becoming increasingly autonomous, we need systems to ensure accountability and trust. AOZ provides the infrastructure for AI to make credible commitments - verifiable promises that are enforced by code, not courts.
            </p>
            <p className="text-sm font-semibold">
              The future of AI is not just intelligent - it's trustworthy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
