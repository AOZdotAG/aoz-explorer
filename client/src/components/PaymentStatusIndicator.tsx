import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Loader2, Wallet, Shield } from "lucide-react";

interface PaymentStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface PaymentStatusIndicatorProps {
  currentStep: 'idle' | 'wallet_confirm' | 'submitting' | 'verifying' | 'completed';
  transactionId?: string;
  amount?: string;
}

export function PaymentStatusIndicator({ 
  currentStep, 
  transactionId,
  amount 
}: PaymentStatusIndicatorProps) {
  const steps: PaymentStep[] = [
    {
      id: 'wallet_confirm',
      label: 'Confirm in Wallet',
      status: currentStep === 'idle' ? 'pending' :
              currentStep === 'wallet_confirm' ? 'active' : 'completed'
    },
    {
      id: 'submitting',
      label: 'Submitting Payment',
      status: currentStep === 'idle' || currentStep === 'wallet_confirm' ? 'pending' :
              currentStep === 'submitting' ? 'active' : 'completed'
    },
    {
      id: 'verifying',
      label: 'Verifying Transaction',
      status: currentStep === 'idle' || 
              currentStep === 'wallet_confirm' || 
              currentStep === 'submitting' ? 'pending' :
              currentStep === 'verifying' ? 'active' : 'completed'
    },
    {
      id: 'completed',
      label: 'Agent Created',
      status: currentStep === 'completed' ? 'completed' : 'pending'
    }
  ];

  const getStepIcon = (step: PaymentStep) => {
    if (step.status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
    if (step.status === 'active') {
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    }
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  const formatAmount = (microUsdc: string) => {
    const amount = parseInt(microUsdc) / 1_000_000;
    return `$${amount.toFixed(2)} USDC`;
  };

  if (currentStep === 'idle') {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5" data-testid="payment-status-indicator">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">x402 Payment Processing</h3>
            {amount && (
              <p className="text-sm text-muted-foreground">
                Amount: {formatAmount(amount)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className="flex items-center gap-3"
              data-testid={`payment-step-${step.id}`}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                  step.status === 'active' ? 'text-foreground' :
                  'text-muted-foreground'
                }`}>
                  {step.label}
                </p>
              </div>

              {step.status === 'completed' && (
                <Badge variant="outline" className="text-xs">
                  Done
                </Badge>
              )}
              {step.status === 'active' && (
                <Badge variant="default" className="text-xs">
                  Processing
                </Badge>
              )}
            </div>
          ))}
        </div>

        {transactionId && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Transaction ID:</p>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono block break-all" data-testid="text-transaction-id">
              {transactionId}
            </code>
          </div>
        )}

        {currentStep === 'wallet_confirm' && (
          <div className="mt-4 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <Wallet className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Please check your Phantom wallet and approve the transaction
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
