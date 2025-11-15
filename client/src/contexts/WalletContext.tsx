import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
  on(event: string, callback: () => void): void;
  off?(event: string, callback: () => void): void;
  removeListener?(event: string, callback: () => void): void;
}

interface WalletContextType {
  walletAddress: string | null;
  wallet: PhantomProvider | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  wallet: null,
  isConnecting: false,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const getPhantomProvider = (): PhantomProvider | null => {
    if ('solana' in window) {
      const provider = (window as any).solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  };

  const connectWallet = async () => {
    const provider = getPhantomProvider();
    
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      const response = await provider.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      localStorage.setItem('phantomWalletAddress', address);
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    const provider = getPhantomProvider();
    
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error('Error disconnecting from Phantom wallet:', error);
      }
    }
    
    setWalletAddress(null);
    localStorage.removeItem('phantomWalletAddress');
  };

  useEffect(() => {
    const provider = getPhantomProvider();
    
    if (provider?.publicKey) {
      const address = provider.publicKey.toString();
      setWalletAddress(address);
      localStorage.setItem('phantomWalletAddress', address);
    }

    const handleAccountChanged = () => {
      const provider = getPhantomProvider();
      if (provider?.publicKey) {
        const address = provider.publicKey.toString();
        setWalletAddress(address);
        localStorage.setItem('phantomWalletAddress', address);
      } else {
        setWalletAddress(null);
        localStorage.removeItem('phantomWalletAddress');
      }
    };

    if (provider) {
      provider.on('accountChanged', handleAccountChanged);
      return () => {
        if (typeof provider.removeListener === 'function') {
          provider.removeListener('accountChanged', handleAccountChanged);
        } else if (typeof provider.off === 'function') {
          provider.off('accountChanged', handleAccountChanged);
        }
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        wallet: getPhantomProvider(),
        isConnecting,
        isConnected: !!walletAddress,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
