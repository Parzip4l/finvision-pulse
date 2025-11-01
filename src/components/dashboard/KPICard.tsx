import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  percentage?: number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "success" | "warning" | "destructive";
}

export const KPICard = ({
  title,
  value,
  subtitle,
  percentage,
  icon: Icon,
  trend = "neutral",
  color = "primary",
}: KPICardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary",
    success: "from-success/20 to-success/5 text-success",
    warning: "from-warning/20 to-warning/5 text-warning",
    destructive: "from-destructive/20 to-destructive/5 text-destructive",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="glass-card p-6 hover:shadow-glow transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight mb-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {percentage !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-semibold ${trendColors[trend]}`}>
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {percentage}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
