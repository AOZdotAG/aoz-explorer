import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, LogOut } from "lucide-react";
import fullLogoWhite from "@assets/Full-logotype-white_1761825000693.png";
import { Link } from "wouter";

export default function Header() {
  const { walletAddress, isConnecting, isConnected, connectWallet, disconnectWallet } = useWallet();
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center px-4 md:px-8 lg:px-12 xl:px-16 gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="hover-elevate" data-testid="link-home">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="hover-elevate" data-testid="link-about">
              About
            </Button>
          </Link>
          <Link href="/payments">
            <Button variant="ghost" className="hover-elevate" data-testid="link-payments">
              Payments
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="ghost" className="hover-elevate" data-testid="link-privacy">
              Privacy
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <img src={fullLogoWhite} alt="AOZ" className="h-8" />
          <div className="h-8 w-px bg-border/50"></div>
          <p className="text-xs text-muted-foreground hidden sm:block">aozNFT Explorer</p>
        </div>
        
        <div className="flex-1 flex justify-end gap-2">
          {isConnected ? (
            <>
              <Button 
                variant="outline"
                data-testid="button-wallet-address"
                className="hover-elevate"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {formatAddress(walletAddress!)}
              </Button>
              <Button 
                onClick={disconnectWallet}
                variant="ghost"
                size="icon"
                data-testid="button-disconnect-wallet"
                className="hover-elevate"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={connectWallet}
              disabled={isConnecting}
              variant="default"
              data-testid="button-connect-wallet"
              className="bg-primary hover-elevate active-elevate-2"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Phantom"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
