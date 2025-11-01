import { Card } from "@/components/ui/card";
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
    ongoingRequests: "IDR 12.5B",
    inProgress: "IDR 8.3B",
    projects: 15,
    status: "On Track",
  },
  {
    division: "Technology",
    ongoingRequests: "IDR 18.7B",
    inProgress: "IDR 14.2B",
    projects: 23,
    status: "On Track",
  },
  {
    division: "Marketing",
    ongoingRequests: "IDR 6.2B",
    inProgress: "IDR 3.8B",
    projects: 8,
    status: "Delayed",
  },
  {
    division: "Finance",
    ongoingRequests: "IDR 4.1B",
    inProgress: "IDR 2.9B",
    projects: 6,
    status: "On Track",
  },
  {
    division: "Human Resources",
    ongoingRequests: "IDR 3.5B",
    inProgress: "IDR 2.1B",
    projects: 4,
    status: "On Track",
  },
];

export const OngoingProjectsTable = () => {
  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Ongoing Project Monitoring</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time tracking of projects in progress
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold">Division</TableHead>
              <TableHead className="font-semibold">On-going Requests</TableHead>
              <TableHead className="font-semibold">In-progress Procurement</TableHead>
              <TableHead className="font-semibold text-center">Projects</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ongoingProjects.map((project) => (
              <TableRow key={project.division} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">{project.division}</TableCell>
                <TableCell>{project.ongoingRequests}</TableCell>
                <TableCell>{project.inProgress}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {project.projects}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={project.status === "On Track" ? "default" : "destructive"}
                    className={
                      project.status === "On Track"
                        ? "bg-success/10 text-success border-success/30"
                        : ""
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
