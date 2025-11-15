import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: November 2025</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                AOZ Explorer is committed to protecting your privacy. This policy explains how we handle data when you use our decentralized application for browsing and creating Solana NFTs representing AI agent commitments.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="font-semibold text-foreground mb-2">
                  🔒 We Do NOT Collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Credit card or payment card information</li>
                  <li>Banking details or financial account numbers</li>
                  <li>Social security numbers or government IDs</li>
                  <li>Personal identifying information beyond wallet addresses</li>
                  <li>Browsing history or tracking cookies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                How Wallet Connection Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When you connect your Phantom wallet to AOZ Explorer, we use <strong>cryptographic signatures</strong> for authentication - not passwords or personal data.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold">What Happens:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You approve connection through Phantom's secure interface</li>
                  <li>We receive your public wallet address only</li>
                  <li>We can view public blockchain data (NFTs you own, transactions)</li>
                  <li>We CANNOT access your private keys or move funds without explicit approval</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Technical Note:</strong> Wallet connections use the official Phantom SDK (window.solana API). All transaction signing happens within your wallet - we never have access to your private keys.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                What We See
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">Blockchain Data (Public)</h3>
                  <p className="text-sm text-muted-foreground">
                    Your wallet address, NFT ownership, and transaction history are publicly visible on the Solana blockchain. This is how blockchain technology works - transparency is a feature, not a bug.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Session Data (Temporary)</h3>
                  <p className="text-sm text-muted-foreground">
                    We store your wallet address in browser localStorage to keep you connected between visits. You can disconnect anytime, which clears this data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Usage Analytics (Anonymous)</h3>
                  <p className="text-sm text-muted-foreground">
                    Basic server logs (timestamps, API endpoints) for performance monitoring. No personal identifiers are stored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Agent Creation Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When you create an AI agent through our platform, the following information is stored:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Agent name and type (loan, swap, transaction, alliance)</li>
                <li>Agent description and oath details</li>
                <li>Settlement wallet address (public Solana address)</li>
                <li>Your wallet address (as creator identifier)</li>
                <li>Creation timestamp</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                This data is necessary for the platform to function and is associated with blockchain records. Once an agent is created, it represents a public commitment on the Solana blockchain.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">Phantom Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    We integrate with Phantom wallet for secure blockchain interactions. See Phantom's privacy policy at phantom.app/privacy
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Solana Blockchain</h3>
                  <p className="text-sm text-muted-foreground">
                    All transactions occur on the public Solana blockchain. Blockchain data is permanent and publicly accessible by design.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Magic Eden</h3>
                  <p className="text-sm text-muted-foreground">
                    NFT marketplace links for viewing covenant details. We do not share your data with Magic Eden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Disconnect Anytime:</strong> You can disconnect your wallet from the app at any time by clicking the wallet button in the header.
                </li>
                <li>
                  <strong>Data Access:</strong> All your on-chain data is publicly accessible via blockchain explorers like Solscan or Solana Explorer.
                </li>
                <li>
                  <strong>Data Portability:</strong> Your NFTs are standard Solana tokens that you fully own and control. Move them to any compatible wallet.
                </li>
                <li>
                  <strong>No Tracking:</strong> We do not use advertising trackers, cookies for marketing, or sell your data to third parties.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li>All connections use HTTPS encryption</li>
                <li>Security headers prevent XSS and clickjacking attacks</li>
                <li>No passwords stored - cryptographic authentication only</li>
                <li>TEE (Trusted Execution Environment) attestation for AI agents</li>
                <li>Regular security audits and updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This privacy policy may be updated to reflect changes in our practices or for legal compliance. We will notify users of significant changes.
              </p>
              <p className="text-sm text-muted-foreground">
                For questions about this privacy policy or data handling, please contact us through our official channels.
              </p>
            </CardContent>
          </Card>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-3">Why This Matters</h2>
            <p className="text-sm">
              AOZ Explorer is built on principles of <strong>transparency</strong>, <strong>decentralization</strong>, and <strong>user sovereignty</strong>. We leverage blockchain technology to minimize trust requirements and maximize user control. Your wallet, your keys, your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
