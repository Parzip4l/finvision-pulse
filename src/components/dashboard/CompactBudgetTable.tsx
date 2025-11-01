import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface BudgetRow {
  division: string;
  type: "OPEX" | "CAPEX";
  finalBudget: number;
  absorption: number;
  absorptionPercent: number;
  remaining: number;
}

const budgetData: BudgetRow[] = [
  {
    division: "Operations",
    type: "OPEX",
    finalBudget: 47000,
    absorption: 32000,
    absorptionPercent: 68.1,
    remaining: 15000,
  },
  {
    division: "Technology",
    type: "CAPEX",
    finalBudget: 57000,
    absorption: 41000,
    absorptionPercent: 71.9,
    remaining: 16000,
  },
  {
    division: "Marketing",
    type: "OPEX",
    finalBudget: 29500,
    absorption: 19000,
    absorptionPercent: 64.4,
    remaining: 10500,
  },
  {
    division: "Finance",
    type: "OPEX",
    finalBudget: 42500,
    absorption: 29800,
    absorptionPercent: 70.1,
    remaining: 12700,
  },
  {
    division: "HR",
    type: "OPEX",
    finalBudget: 38400,
    absorption: 25000,
    absorptionPercent: 65.1,
    remaining: 13400,
  },
];

export const CompactBudgetTable = () => {
  const getAbsorptionColor = (percent: number) => {
    if (percent >= 70) return "text-success";
    if (percent >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="h-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[10px] font-semibold py-1.5">Division</TableHead>
            <TableHead className="text-[10px] font-semibold py-1.5">Type</TableHead>
            <TableHead className="text-[10px] font-semibold text-right py-1.5">Budget</TableHead>
            <TableHead className="text-[10px] font-semibold text-right py-1.5">Absorbed</TableHead>
            <TableHead className="text-[10px] font-semibold text-right py-1.5">%</TableHead>
            <TableHead className="text-[10px] font-semibold text-right py-1.5">Remaining</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetData.map((row) => (
            <TableRow key={row.division} className="border-border">
              <TableCell className="text-[10px] font-medium py-1.5">{row.division}</TableCell>
              <TableCell className="py-1.5">
                <Badge
                  variant="outline"
                  className={`text-[8px] px-1.5 py-0 ${
                    row.type === "OPEX"
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-secondary/10 text-secondary border-secondary/30"
                  }`}
                >
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] text-right py-1.5">
                {row.finalBudget.toLocaleString()}M
              </TableCell>
              <TableCell className="text-[10px] text-right py-1.5">
                {row.absorption.toLocaleString()}M
              </TableCell>
              <TableCell className={`text-[10px] text-right font-semibold py-1.5 ${getAbsorptionColor(row.absorptionPercent)}`}>
                {row.absorptionPercent.toFixed(1)}%
              </TableCell>
              <TableCell className="text-[10px] text-right text-muted-foreground py-1.5">
                {row.remaining.toLocaleString()}M
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
