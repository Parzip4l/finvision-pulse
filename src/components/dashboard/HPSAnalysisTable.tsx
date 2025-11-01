import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const hpsData = [
  {
    division: "Operations",
    jan: 2400,
    feb: 1398,
    mar: 9800,
    apr: 3908,
    may: 4800,
    jun: 3800,
    jul: 4300,
    aug: 5600,
    sep: 6200,
    oct: 4900,
    nov: 5800,
    dec: 6900,
  },
  {
    division: "Technology",
    jan: 3200,
    feb: 2100,
    mar: 11000,
    apr: 4500,
    may: 5300,
    jun: 4200,
    jul: 4800,
    aug: 6100,
    sep: 6800,
    oct: 5400,
    nov: 6300,
    dec: 7500,
  },
  {
    division: "Marketing",
    jan: 1800,
    feb: 900,
    mar: 4200,
    apr: 2100,
    may: 2800,
    jun: 2100,
    jul: 2400,
    aug: 3200,
    sep: 3500,
    oct: 2800,
    nov: 3300,
    dec: 3900,
  },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const HPSAnalysisTable = () => {
  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold">HPS Analysis by Division</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly breakdown of Estimated Owner's Price (HPS) per division
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold sticky left-0 bg-card z-10">Division</TableHead>
              {months.map((month) => (
                <TableHead key={month} className="font-semibold text-right">
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hpsData.map((row) => (
              <TableRow key={row.division} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium sticky left-0 bg-card z-10">
                  {row.division}
                </TableCell>
                <TableCell className="text-right">{row.jan.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.feb.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.mar.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.apr.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.may.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.jun.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.jul.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.aug.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.sep.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.oct.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.nov.toLocaleString()}M</TableCell>
                <TableCell className="text-right">{row.dec.toLocaleString()}M</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
