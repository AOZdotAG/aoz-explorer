import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CovenantType = "LOAN" | "TRANSACTION" | "EMPLOYMENT" | "ALLIANCE";

interface TypeBadgeProps {
  type: CovenantType;
}

const typeConfig: Record<CovenantType, { className: string }> = {
  LOAN: {
    className: "bg-accent/50 text-accent-foreground border-accent",
  },
  TRANSACTION: {
    className: "bg-muted/80 text-muted-foreground border-muted",
  },
  EMPLOYMENT: {
    className: "bg-primary/15 text-primary border-primary/40",
  },
  ALLIANCE: {
    className: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
};

export default function TypeBadge({ type }: TypeBadgeProps) {
  const config = typeConfig[type];
  
  return (
    <Badge 
      variant="outline"
      className={cn("text-xs font-bold uppercase tracking-wider", config.className)}
      data-testid={`badge-type-${type.toLowerCase()}`}
    >
      {type}
    </Badge>
  );
}
