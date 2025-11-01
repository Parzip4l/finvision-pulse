import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const opexData = [
  { name: "Absorbed", value: 68.5 },
  { name: "Remaining", value: 31.5 },
];

const capexData = [
  { name: "Absorbed", value: 72.3 },
  { name: "Remaining", value: 27.7 },
];

const COLORS = {
  absorbed: "hsl(var(--chart-1))",
  remaining: "hsl(var(--chart-3))",
};

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  total: string;
}

const DonutChart = ({ data, title, total }: DonutChartProps) => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? COLORS.absorbed : COLORS.remaining}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold">{data[0].value.toFixed(1)}%</p>
        <p className="text-sm text-muted-foreground">Absorbed</p>
        <p className="text-lg font-semibold mt-2 text-primary">{total}</p>
      </div>
    </div>
  );
};

export const BudgetDonutCharts = () => {
  return (
    <Card className="glass-card p-6 animate-fade-in">
      <h3 className="text-xl font-bold mb-6">Budget Absorption Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DonutChart data={opexData} title="OPEX" total="IDR 125.6B" />
        <DonutChart data={capexData} title="CAPEX" total="IDR 89.3B" />
      </div>
    </Card>
  );
};
