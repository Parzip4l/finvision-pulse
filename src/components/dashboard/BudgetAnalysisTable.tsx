import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface BudgetRow {
  id: string;
  name: string;
  type: "OPEX" | "CAPEX";
  initialProposal: number;
  changes: number;
  finalBudget: number;
  absorption: number;
  absorptionPercent: number;
  remaining: number;
  remainingPercent: number;
  children?: BudgetRow[];
}

const budgetData: BudgetRow[] = [
  {
    id: "ops",
    name: "Operations",
    type: "OPEX",
    initialProposal: 45000,
    changes: 2000,
    finalBudget: 47000,
    absorption: 32000,
    absorptionPercent: 68.1,
    remaining: 15000,
    remainingPercent: 31.9,
    children: [
      {
        id: "ops-facilities",
        name: "Facilities Management",
        type: "OPEX",
        initialProposal: 15000,
        changes: 500,
        finalBudget: 15500,
        absorption: 11000,
        absorptionPercent: 71.0,
        remaining: 4500,
        remainingPercent: 29.0,
      },
      {
        id: "ops-logistics",
        name: "Logistics",
        type: "OPEX",
        initialProposal: 30000,
        changes: 1500,
        finalBudget: 31500,
        absorption: 21000,
        absorptionPercent: 66.7,
        remaining: 10500,
        remainingPercent: 33.3,
      },
    ],
  },
  {
    id: "tech",
    name: "Technology",
    type: "CAPEX",
    initialProposal: 60000,
    changes: -3000,
    finalBudget: 57000,
    absorption: 41000,
    absorptionPercent: 71.9,
    remaining: 16000,
    remainingPercent: 28.1,
    children: [
      {
        id: "tech-infra",
        name: "Infrastructure",
        type: "CAPEX",
        initialProposal: 35000,
        changes: -2000,
        finalBudget: 33000,
        absorption: 24000,
        absorptionPercent: 72.7,
        remaining: 9000,
        remainingPercent: 27.3,
      },
      {
        id: "tech-software",
        name: "Software Development",
        type: "CAPEX",
        initialProposal: 25000,
        changes: -1000,
        finalBudget: 24000,
        absorption: 17000,
        absorptionPercent: 70.8,
        remaining: 7000,
        remainingPercent: 29.2,
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    type: "OPEX",
    initialProposal: 28000,
    changes: 1500,
    finalBudget: 29500,
    absorption: 19000,
    absorptionPercent: 64.4,
    remaining: 10500,
    remainingPercent: 35.6,
    children: [
      {
        id: "marketing-digital",
        name: "Digital Marketing",
        type: "OPEX",
        initialProposal: 18000,
        changes: 1000,
        finalBudget: 19000,
        absorption: 12500,
        absorptionPercent: 65.8,
        remaining: 6500,
        remainingPercent: 34.2,
      },
      {
        id: "marketing-events",
        name: "Events & PR",
        type: "OPEX",
        initialProposal: 10000,
        changes: 500,
        finalBudget: 10500,
        absorption: 6500,
        absorptionPercent: 61.9,
        remaining: 4000,
        remainingPercent: 38.1,
      },
    ],
  },
];

const BudgetTableRow = ({ row, level = 0 }: { row: BudgetRow; level?: number }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = row.children && row.children.length > 0;

  const getAbsorptionColor = (percent: number) => {
    if (percent >= 70) return "text-success";
    if (percent >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <>
      <TableRow className="border-border hover:bg-muted/30">
        <TableCell style={{ paddingLeft: `${level * 2 + 1}rem` }}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="hover:bg-muted rounded p-1 transition-colors"
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <span className="font-medium">{row.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={
              row.type === "OPEX"
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-secondary/10 text-secondary border-secondary/30"
            }
          >
            {row.type}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          IDR {row.initialProposal.toLocaleString()}M
        </TableCell>
        <TableCell className={`text-right ${row.changes >= 0 ? "text-success" : "text-destructive"}`}>
          {row.changes >= 0 ? "+" : ""}
          {row.changes.toLocaleString()}M
        </TableCell>
        <TableCell className="text-right font-semibold">
          IDR {row.finalBudget.toLocaleString()}M
        </TableCell>
        <TableCell className="text-right">
          IDR {row.absorption.toLocaleString()}M
        </TableCell>
        <TableCell className={`text-right font-semibold ${getAbsorptionColor(row.absorptionPercent)}`}>
          {row.absorptionPercent.toFixed(1)}%
        </TableCell>
        <TableCell className="text-right">
          IDR {row.remaining.toLocaleString()}M
        </TableCell>
        <TableCell className="text-right text-muted-foreground">
          {row.remainingPercent.toFixed(1)}%
        </TableCell>
      </TableRow>
      {expanded &&
        hasChildren &&
        row.children?.map((child) => (
          <BudgetTableRow key={child.id} row={child} level={level + 1} />
        ))}
    </>
  );
};

export const BudgetAnalysisTable = () => {
  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Detailed Budget Analysis</h3>
        <p className="text-sm text-muted-foreground mt-1">
          OPEX & CAPEX breakdown by Division and Department
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold">Division / Department</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold text-right">Initial Proposal</TableHead>
              <TableHead className="font-semibold text-right">Changes</TableHead>
              <TableHead className="font-semibold text-right">Final Budget</TableHead>
              <TableHead className="font-semibold text-right">Absorption</TableHead>
              <TableHead className="font-semibold text-right">Absorption %</TableHead>
              <TableHead className="font-semibold text-right">Remaining</TableHead>
              <TableHead className="font-semibold text-right">Remaining %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetData.map((row) => (
              <BudgetTableRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
