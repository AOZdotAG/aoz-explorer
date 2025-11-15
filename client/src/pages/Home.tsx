import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { type AozAgent } from "@shared/schema";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import AozOathCard, { type AozOathData } from "@/components/CovenantCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Loader2, Shield, Info } from "lucide-react";
import symbolPurple from "@assets/Symbol-purple_1761825000693.png";
import fullLogoWhite from "@assets/Full-logotype-white_1761825000693.png";

function transformAgentToOath(agent: AozAgent): AozOathData {
  return {
    id: agent.id,
    type: agent.agentType as "LOAN" | "TRANSACTION" | "EMPLOYMENT" | "ALLIANCE",
    status: agent.oathStatus as "minted" | "completed" | "pending" | "settled",
    ask: {
      text: agent.fulfillmentDescription,
      status: agent.askStatus as "settled" | "pending",
    },
    promise: {
      text: agent.oathDescription,
      details: `Settlement address: ${agent.settlementAddress}`,
      status: agent.promiseStatus as "settled" | "pending",
    },
    agent: {
      name: agent.agentName,
      verified: agent.verified === "true",
      teeAttestation: agent.teeAttestation,
      teeUrl: agent.teeUrl || undefined,
      walletAddress: agent.walletAddress,
      explorerUrl: agent.explorerUrl || `https://solscan.io/account/${agent.walletAddress}`,
      holder: agent.holder,
      holderUrl: agent.holderUrl || undefined,
    },
    openSeaUrl: agent.openSeaUrl || undefined,
  };
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<string>("all-agents");
  const [selectedStatus, setSelectedStatus] = useState<string>("all-status");
  const [showMyOathsOnly, setShowMyOathsOnly] = useState<boolean>(false);

  const { data: agents, isLoading } = useQuery<AozAgent[]>({
    queryKey: ['/api/agents'],
  });

  const allOaths: AozOathData[] = agents?.map(transformAgentToOath) || [];

  const handleCreateAgent = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Phantom wallet to create an AI agent",
        variant: "destructive",
      });
      return;
    }
    setLocation("/create-agent");
  };

  const filteredOaths = allOaths.filter((oath) => {
    // Filter by agent
    if (selectedAgent !== "all-agents" && oath.agent.name !== selectedAgent) {
      return false;
    }

    // Filter by status
    if (selectedStatus !== "all-status" && oath.status !== selectedStatus) {
      return false;
    }

    // Filter by "my oaths" - for demo purposes, show only minted/pending
    if (showMyOathsOnly && oath.status === "completed") {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background relative">
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url(${symbolPurple})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '60%',
        }}
      />
      
      <Header />
      
      <div className="w-full bg-primary/10 border-b border-primary/20 relative z-10" data-testid="banner-security-notice">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-3">
          <div className="flex items-center gap-3 justify-center text-sm">
            <Shield className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-foreground">
              <strong>Security Notice:</strong> This is a legitimate blockchain application.
              We use <strong>wallet-only authentication</strong> (no passwords or card data).
              {" "}
              <Link href="/about" data-testid="link-banner-about" className="text-primary hover:underline cursor-pointer">
                Learn how it works
              </Link>
              {" | "}
              <Link href="/privacy" data-testid="link-banner-privacy" className="text-primary hover:underline cursor-pointer">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <FilterBar 
        onAgentChange={setSelectedAgent}
        onStatusChange={setSelectedStatus}
        onMyCovenants={setShowMyOathsOnly}
      />
      
      <main className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-10 relative z-10">
        <div className="mb-10 flex items-center gap-6">
          <img src={symbolPurple} alt="" className="h-20 w-20 opacity-80" />
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              aozNFT Registry
            </h2>
            <p className="text-base text-muted-foreground font-medium">
              Cryptographic agreements binding AI agents to on-chain commitments.
              <br />
              <span className="text-sm">Secured by trusted execution environments. Settled automatically on Solana.</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm text-muted-foreground font-medium" data-testid="text-agent-to-agent">
              Agent to Agent x402
            </p>
            <Button
              onClick={handleCreateAgent}
              size="lg"
              className="bg-primary hover-elevate active-elevate-2 gap-2"
              data-testid="button-create-agent-home"
            >
              <Plus className="h-5 w-5" />
              Create Agent
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Loading agents...</p>
          </div>
        ) : filteredOaths.length === 0 ? (
          <div className="text-center py-12">
            <img src={symbolPurple} alt="" className="h-32 w-32 mx-auto mb-6 opacity-30" />
            <p className="text-muted-foreground text-lg">No aozOaths found matching your filters.</p>
            <p className="text-muted-foreground text-sm mt-2">Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredOaths.map((oath) => (
                <AozOathCard key={oath.id} oath={oath} />
              ))}
            </div>

            <div className="mt-10 text-center text-sm text-muted-foreground font-medium">
              Showing {filteredOaths.length} of {allOaths.length} oath{allOaths.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
      
      <footer className="w-full border-t border-border py-8 px-4 md:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={fullLogoWhite} alt="AOZ" className="h-6" />
            </div>
            <div className="flex gap-4">
              <Link href="/about" data-testid="link-footer-about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/privacy" data-testid="link-footer-privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Blockchain-secured AI agent commitments on Solana
              <br />
              <span className="text-[10px]">Powered by trusted execution environments</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
