import { CalendarDays, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onTimeRangeChange?: (value: string) => void;
  onDivisionChange?: (value: string) => void;
}

export const FilterBar = ({
  onTimeRangeChange,
  onDivisionChange,
}: FilterBarProps) => {
  return (
    <div className="glass-card p-4 mb-6 animate-slide-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Time Range
          </label>
          <Select defaultValue="ytd" onValueChange={onTimeRangeChange}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Division
          </label>
          <Select defaultValue="all" onValueChange={onDivisionChange}>
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
