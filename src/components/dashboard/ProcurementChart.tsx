import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", hps: 2400, po: 2100 },
  { month: "Feb", hps: 1398, po: 1200 },
  { month: "Mar", hps: 9800, po: 8600 },
  { month: "Apr", hps: 3908, po: 3400 },
  { month: "May", hps: 4800, po: 4200 },
  { month: "Jun", hps: 3800, po: 3300 },
  { month: "Jul", hps: 4300, po: 3800 },
  { month: "Aug", hps: 5600, po: 4900 },
  { month: "Sep", hps: 6200, po: 5400 },
  { month: "Oct", hps: 4900, po: 4300 },
  { month: "Nov", hps: 5800, po: 5100 },
  { month: "Dec", hps: 6900, po: 6000 },
];

export const ProcurementChart = () => {
  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Monthly HPS vs PO Trend</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comparison of Estimated Owner's Price and Purchase Orders
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`IDR ${value.toLocaleString()}M`, ""]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="hps"
            stroke="hsl(var(--chart-1))"
            strokeWidth={3}
            name="HPS Value"
            dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="po"
            stroke="hsl(var(--chart-2))"
            strokeWidth={3}
            name="PO Value"
            dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
