import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAgentSchema, type CreateAgent } from "@shared/schema";
import { createX402Client } from "x402-solana/client";
import { Connection } from "@solana/web3.js";

export default function CreateAgent() {
  const { isConnected, walletAddress, wallet } = useWallet();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showBetaNotice, setShowBetaNotice] = useState(true);

  const form = useForm<CreateAgent>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      agentName: "",
      agentType: undefined,
      description: "",
      settlementAddress: "",
      oathDescription: "",
      fulfillmentDescription: "",
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: async (data: CreateAgent) => {
      try {
        // Create x402 client with wallet for automatic payment handling
        if (!wallet) {
          throw new Error('Wallet not available');
        }

        console.log('Creating x402 client for mainnet...');
        
        // TEMPORARY: Use mainnet for local testing
        // Using free public RPC (no API key required)
        const x402Client = createX402Client({
          wallet,
          network: 'solana', // Mainnet
          rpcUrl: 'https://api.mainnet-beta.solana.com', // Free Solana public RPC
          maxPaymentAmount: BigInt(100_000_000), // Max 0.1 SOL (100 million lamports)
        });
        
        console.log('Sending agent creation request...');
        
        // Use x402 client - it automatically handles 402 responses and payments
        const res = await x402Client.fetch('/api/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Wallet-Address': walletAddress || '',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        
        console.log('Response received:', res.status, res.statusText);
        
        if (!res.ok) {
          const error = await res.json().catch(() => ({ error: res.statusText }));
          console.error('Response error:', error);
          throw new Error(error.error || error.details || 'Failed to create agent');
        }
        
        return res.json();
      } catch (error) {
        console.error('Mutation error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          error
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      toast({
        title: "Agent Created Successfully! 🎉",
        description: "Your agent has been registered and is now visible in the registry",
      });
      form.reset();
      setTimeout(() => {
        setLocation("/");
      }, 1500);
    },
    onError: (error: any) => {
      console.error('Agent creation error:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        fullError: error
      });
      toast({
        title: "Creation Failed",
        description: error?.message || "There was an error creating your agent. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Wallet Not Connected</CardTitle>
              <CardDescription>
                Please connect your Phantom wallet to create an AI agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full"
                data-testid="button-go-home"
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CreateAgent) => {
    createAgentMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Create AI Agent
          </h1>
          <p className="text-muted-foreground">
            Deploy a new autonomous AI agent on the Solana blockchain
          </p>
        </div>

        <Card className="border-l-4 border-l-primary/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Agent Configuration
            </CardTitle>
            <CardDescription>
              Fill in the details below to create your aozNFT agent
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-agent-name">
                        Agent Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., aozAgentDealer"
                          {...field}
                          data-testid="input-agent-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-agent-type">
                        Agent Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-agent-type">
                            <SelectValue placeholder="Select agent type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOAN" data-testid="option-loan">Loan Agent</SelectItem>
                          <SelectItem value="TRANSACTION" data-testid="option-transaction">Transaction Agent</SelectItem>
                          <SelectItem value="EMPLOYMENT" data-testid="option-employment">Employment Agent</SelectItem>
                          <SelectItem value="ALLIANCE" data-testid="option-alliance">Alliance Agent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-description">
                        Agent Description <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this agent will do..."
                          rows={3}
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settlementAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-settlement-address">
                        Settlement Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Solana wallet address for settlements"
                          {...field}
                          data-testid="input-settlement-address"
                        />
                      </FormControl>
                      <FormDescription>
                        The Solana address where transactions will be settled
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    aozOath Details
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="oathDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-oath-description">
                            Agent's aozOath <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What does the agent promise to do?"
                              rows={3}
                              {...field}
                              data-testid="input-oath-description"
                            />
                          </FormControl>
                          <FormDescription>
                            The commitment your agent will make to fulfill
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fulfillmentDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-fulfillment-description">
                            Required Fulfillment <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What needs to happen for the oath to be fulfilled?"
                              rows={3}
                              {...field}
                              data-testid="input-fulfillment-description"
                            />
                          </FormControl>
                          <FormDescription>
                            The conditions that must be met to complete the oath
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Connected Wallet:</span>{" "}
                    <code className="text-xs bg-background px-2 py-1 rounded break-all">
                      {walletAddress}
                    </code>
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/")}
                    disabled={form.formState.isSubmitting}
                    className="flex-1"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createAgentMutation.isPending}
                    className="flex-1 bg-primary hover-elevate active-elevate-2"
                    data-testid="button-submit"
                  >
                    {createAgentMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Agent...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Agent
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Beta Testing Notice */}
      <AlertDialog 
        open={showBetaNotice} 
        onOpenChange={setShowBetaNotice}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Beta Testing Period
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left">
              <p className="font-medium text-foreground">
                Welcome to AOZ Agent Creation!
              </p>
              <p>
                We're currently in beta testing. You can create AI agents completely free during this period.
              </p>
              <p>
                <strong>Coming Soon:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>x402 payment protocol integration for agent-to-agent payments</li>
                <li>Full production infrastructure with enhanced performance</li>
                <li>AI task execution and automation features</li>
                <li>Additional agent types and capabilities</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Thank you for being an early tester! Your feedback helps us build better.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              data-testid="button-acknowledge-beta"
            >
              Got it, let's create!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
