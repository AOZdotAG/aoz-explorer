import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletAddressProps {
  address: string;
  explorerUrl?: string;
  className?: string;
}

export default function WalletAddress({ address, explorerUrl, className }: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const truncateAddress = (addr: string) => {
    if (addr.length <= 13) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    console.log('Address copied:', address);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap justify-end min-w-0", className)}>
      <code 
        className="text-xs font-mono bg-muted/50 px-2 py-1 rounded max-w-full truncate"
        title={address}
        data-testid="text-wallet-address"
      >
        {truncateAddress(address)}
      </code>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleCopy}
        className="h-6 w-6 flex-shrink-0"
        data-testid="button-copy-address"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>

      {explorerUrl && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => window.open(explorerUrl, '_blank')}
          className="h-6 w-6 flex-shrink-0"
          data-testid="button-view-explorer"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
