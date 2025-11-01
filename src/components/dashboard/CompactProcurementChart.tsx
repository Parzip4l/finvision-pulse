import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

export const CompactProcurementChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="month"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "9px" }}
          tickMargin={5}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: "9px" }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          tickMargin={5}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "10px",
          }}
          formatter={(value: number) => [`${value.toLocaleString()}M`, ""]}
        />
        <Line
          type="monotone"
          dataKey="hps"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          name="HPS"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="po"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          name="PO"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
