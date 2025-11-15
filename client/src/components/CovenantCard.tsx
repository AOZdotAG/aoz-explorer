import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import AgentInfo from "./AgentInfo";
// import TaskManagement from "./TaskManagement"; // Hidden from UI - code preserved
import { cn } from "@/lib/utils";

export interface AozOathData {
  id: number;
  type: "LOAN" | "TRANSACTION" | "EMPLOYMENT" | "ALLIANCE";
  status: "minted" | "completed" | "pending" | "settled";
  ask: {
    text: string;
    status: "settled" | "pending";
    txUrl?: string;
  };
  promise: {
    text: string;
    details?: string;
    status: "settled" | "pending";
  };
  agent: {
    name: string;
    verified: boolean;
    teeAttestation: string;
    teeUrl?: string;
    walletAddress: string;
    explorerUrl?: string;
    holder: string;
    holderUrl?: string;
  };
  openSeaUrl?: string;
}

interface AozOathCardProps {
  oath: AozOathData;
}

export default function AozOathCard({ oath }: AozOathCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card 
      className="hover-elevate transition-all duration-200 overflow-visible border-l-4 border-l-primary/60"
      data-testid={`card-oath-${oath.id}`}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              #{oath.id}
            </h3>
            <TypeBadge type={oath.type} />
          </div>
          <StatusBadge status={oath.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-4">
          <div className="bg-muted/20 rounded-lg p-4 border border-muted-foreground/10">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-foreground">
                Required Fulfillment
              </h4>
              <StatusBadge status={oath.ask.status} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground break-all" data-testid="text-ask">
              {oath.ask.text}
            </p>
            {oath.ask.txUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(oath.ask.txUrl, '_blank')}
                className="px-0 h-auto text-xs mt-2 justify-start text-primary hover:text-primary/80"
                data-testid="link-ask-tx"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Transaction
              </Button>
            )}
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-primary">
                Agent's aozOath
              </h4>
              <StatusBadge status={oath.promise.status} />
            </div>
            <p className="text-sm leading-relaxed text-foreground break-all" data-testid="text-promise">
              {oath.promise.text}
            </p>
            {oath.promise.details && (
              <div className="mt-3 p-3 bg-background/50 rounded-md border border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Details</span>
                <p className="text-sm mt-1.5 break-all" data-testid="text-promise-details">
                  {oath.promise.details}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={cn("transition-all duration-300 ease-in-out", 
          expanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        )}>
          {expanded && (
            <div className="space-y-6">
              <AgentInfo
                name={oath.agent.name}
                verified={oath.agent.verified}
                teeAttestation={oath.agent.teeAttestation}
                teeUrl={oath.agent.teeUrl}
                walletAddress={oath.agent.walletAddress}
                explorerUrl={oath.agent.explorerUrl}
                holder={oath.agent.holder}
                holderUrl={oath.agent.holderUrl}
              />
              
              {/* AI Tasks - Hidden from UI, code preserved for future release
              <div className="border-t border-border pt-6">
                <TaskManagement 
                  agentId={oath.id} 
                  agentName={oath.agent.name}
                />
              </div>
              */}
            </div>
          )}
        </div>
      </CardContent>
      
      <div className="px-6 pb-6 flex flex-col gap-2 border-t border-border pt-3">
        {oath.openSeaUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(oath.openSeaUrl, '_blank')}
            className="w-full text-xs justify-between"
            data-testid="link-marketplace"
          >
            <span>View on Magic Eden</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs w-full justify-center"
          data-testid="button-toggle-details"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Agent Info
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Agent Info
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
