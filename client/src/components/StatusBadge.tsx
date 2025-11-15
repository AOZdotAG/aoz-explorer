import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "minted" | "completed" | "pending" | "settled";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  minted: {
    label: "MINTED",
    className: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30",
  },
  completed: {
    label: "COMPLETED",
    className: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
  },
  pending: {
    label: "PENDING",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30",
  },
  settled: {
    label: "SETTLED",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline"
      className={cn("text-xs font-semibold uppercase tracking-wide", config.className)}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}
