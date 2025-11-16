import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  onAgentChange?: (agent: string) => void;
  onStatusChange?: (status: string) => void;
  onMyCovenants?: (show: boolean) => void;
}

export default function FilterBar({ onAgentChange, onStatusChange, onMyCovenants }: FilterBarProps) {
  const [showMyOaths, setShowMyOaths] = useState(false);

  const handleToggle = (checked: boolean) => {
    setShowMyOaths(checked);
    onMyCovenants?.(checked);
  };

  return (
    <div className="sticky top-16 z-40 w-full border-b border-primary/20 bg-gradient-to-r from-background via-primary/5 to-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3">
          <Select 
            defaultValue="all-status"
            onValueChange={onStatusChange}
          >
            <SelectTrigger 
              className="w-[200px] border-primary/30 bg-background/80"
              data-testid="select-status-filter"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="minted">Minted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            defaultValue="all-agents"
            onValueChange={onAgentChange}
          >
            <SelectTrigger 
              className="w-[200px] border-primary/30 bg-background/80"
              data-testid="select-agent-filter"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-agents">All Agents</SelectItem>
              <SelectItem value="user-agents">User's Agents</SelectItem>
              <SelectItem value="aozAgentDealer">aozAgentDealer</SelectItem>
              <SelectItem value="other-agent">Other Agents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
