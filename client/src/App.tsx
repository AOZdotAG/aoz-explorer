import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import Home from "@/pages/Home";
import CreateAgent from "@/pages/CreateAgent";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import About from "@/pages/About";
import TransactionHistory from "@/pages/TransactionHistory";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create-agent" component={CreateAgent} />
      <Route path="/payments" component={TransactionHistory} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <Toaster />
          <Router />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
