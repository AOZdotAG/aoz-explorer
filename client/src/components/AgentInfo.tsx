import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletAddress from "./WalletAddress";

interface AgentInfoProps {
  name: string;
  verified: boolean;
  teeAttestation: string;
  teeUrl?: string;
  walletAddress: string;
  explorerUrl?: string;
  holder: string;
  holderUrl?: string;
}

export default function AgentInfo({
  name,
  verified,
  teeAttestation,
  teeUrl,
  walletAddress,
  explorerUrl,
  holder,
  holderUrl,
}: AgentInfoProps) {
  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm" data-testid="text-agent-name">
          {name}
        </span>
        {verified && (
          <div className="flex items-center gap-1 text-primary">
            <Shield className="h-4 w-4 fill-current" />
            <span className="text-xs font-medium">Verified</span>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start justify-between gap-3 flex-wrap md:flex-nowrap min-w-0">
          <span className="text-muted-foreground text-xs uppercase tracking-wide flex-shrink-0">
            Security Proof
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <code className="text-xs font-mono" data-testid="text-tee-attestation">
              {teeAttestation}
            </code>
            {teeUrl && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.open(teeUrl, '_blank')}
                className="h-6 w-6"
                data-testid="button-view-tee"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap md:flex-nowrap min-w-0">
          <span className="text-muted-foreground text-xs uppercase tracking-wide flex-shrink-0">
            Wallet Address
          </span>
          <WalletAddress 
            address={walletAddress} 
            explorerUrl={explorerUrl}
            className="min-w-0"
          />
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap md:flex-nowrap min-w-0">
          <span className="text-muted-foreground text-xs uppercase tracking-wide flex-shrink-0">
            Current Owner
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs" data-testid="text-holder">
              {holder}
            </span>
            {holderUrl && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.open(holderUrl, '_blank')}
                className="h-6 w-6"
                data-testid="button-view-holder"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
