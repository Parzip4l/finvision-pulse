import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ongoingProjects = [
  {
    division: "Operations",
    ongoing: "12.5B",
    inProgress: "8.3B",
    projects: 15,
    status: "On Track",
  },
  {
    division: "Technology",
    ongoing: "18.7B",
    inProgress: "14.2B",
    projects: 23,
    status: "On Track",
  },
  {
    division: "Marketing",
    ongoing: "6.2B",
    inProgress: "3.8B",
    projects: 8,
    status: "Delayed",
  },
  {
    division: "Finance",
    ongoing: "4.1B",
    inProgress: "2.9B",
    projects: 6,
    status: "On Track",
  },
];

export const CompactOngoingTable = () => {
  return (
    <div className="h-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[10px] font-semibold py-1.5">Division</TableHead>
            <TableHead className="text-[10px] font-semibold text-right py-1.5">Ongoing</TableHead>
            <TableHead className="text-[10px] font-semibold text-right py-1.5">Progress</TableHead>
            <TableHead className="text-[10px] font-semibold text-center py-1.5">Proj</TableHead>
            <TableHead className="text-[10px] font-semibold py-1.5">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ongoingProjects.map((project) => (
            <TableRow key={project.division} className="border-border">
              <TableCell className="text-[10px] font-medium py-1.5">{project.division}</TableCell>
              <TableCell className="text-[10px] text-right py-1.5">{project.ongoing}</TableCell>
              <TableCell className="text-[10px] text-right py-1.5">{project.inProgress}</TableCell>
              <TableCell className="text-center py-1.5">
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">
                  {project.projects}
                </Badge>
              </TableCell>
              <TableCell className="py-1.5">
                <Badge
                  variant={project.status === "On Track" ? "default" : "destructive"}
                  className={`text-[8px] px-1.5 py-0 ${
                    project.status === "On Track"
                      ? "bg-success/10 text-success border-success/30"
                      : ""
                  }`}
                >
                  {project.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
