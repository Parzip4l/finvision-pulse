import { LucideIcon } from "lucide-react";

interface CompactKPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "destructive";
}

export const CompactKPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
}: CompactKPICardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary",
    success: "from-success/20 to-success/5 text-success",
    warning: "from-warning/20 to-warning/5 text-warning",
    destructive: "from-destructive/20 to-destructive/5 text-destructive",
  };

  return (
    <div className="glass-card p-3 hover:shadow-glow transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-muted-foreground mb-0.5 truncate">{title}</p>
          <h3 className="text-lg font-bold tracking-tight mb-0.5 truncate">{value}</h3>
          {subtitle && (
            <p className="text-[9px] text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} shrink-0 ml-2`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
