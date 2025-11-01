import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
      <h4 className="text-xs font-semibold mb-1">{title}</h4>
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={45}
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
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-1 text-center">
        <p className="text-base font-bold">{data[0].value.toFixed(1)}%</p>
        <p className="text-[9px] text-muted-foreground">{total}</p>
      </div>
    </div>
  );
};

export const CompactDonutCharts = () => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <DonutChart data={opexData} title="OPEX" total="125.6B" />
      <DonutChart data={capexData} title="CAPEX" total="89.3B" />
    </div>
  );
};
