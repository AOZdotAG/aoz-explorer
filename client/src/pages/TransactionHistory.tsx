import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import { Receipt, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  status: 'pending' | 'verified' | 'settled' | 'failed';
  amount: string;
  timestamp: number;
  errorMessage?: string | null;
}

interface TransactionResponse {
  transactions: Transaction[];
}

export default function TransactionHistory() {
  const { walletAddress, isConnected } = useWallet();

  const { data, isLoading, refetch } = useQuery<TransactionResponse>({
    queryKey: ['/api/x402/transactions', walletAddress],
    enabled: isConnected && !!walletAddress,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  const formatAmount = (microUsdc: string) => {
    const amount = parseInt(microUsdc) / 1_000_000;
    return `$${amount.toFixed(2)} USDC`;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          variant: 'secondary' as const,
          icon: Clock,
          color: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'verified':
        return {
          label: 'Verified',
          variant: 'default' as const,
          icon: CheckCircle2,
          color: 'text-blue-600 dark:text-blue-400'
        };
      case 'settled':
        return {
          label: 'Settled',
          variant: 'default' as const,
          icon: CheckCircle2,
          color: 'text-green-600 dark:text-green-400'
        };
      case 'failed':
        return {
          label: 'Failed',
          variant: 'destructive' as const,
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          icon: Clock,
          color: 'text-muted-foreground'
        };
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Wallet Not Connected</CardTitle>
              <CardDescription>
                Please connect your Phantom wallet to view your payment history
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              Payment History
            </h1>
            <p className="text-muted-foreground">
              Track your x402 payment transactions
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            data-testid="button-refresh-transactions"
          >
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !data?.transactions || data.transactions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
              <p className="text-muted-foreground">
                Your payment history will appear here once you create an agent
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.transactions.map((tx) => {
              const statusConfig = getStatusConfig(tx.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={tx.id} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg bg-muted ${statusConfig.color}`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold" data-testid={`text-transaction-id-${tx.id}`}>
                              Agent Creation Payment
                            </h3>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(tx.timestamp), 'PPpp')}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Transaction ID:
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                              {tx.id}
                            </code>
                          </div>

                          {tx.errorMessage && (
                            <div className="mt-2 text-sm text-destructive">
                              Error: {tx.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={statusConfig.variant} data-testid={`badge-status-${tx.status}`}>
                          {statusConfig.label}
                        </Badge>
                        <span className="text-lg font-semibold" data-testid={`text-amount-${tx.id}`}>
                          {formatAmount(tx.amount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {data && data.transactions.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Showing {data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
