import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Wrench, Sparkles } from "lucide-react";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const isMaintenance = task.classification === "maintenance";

  return (
    <Card
      className={`
        w-full
        p-4 shadow-lg hover:shadow-xl transition-all duration-300 
        border-l-8 bg-white
        ${
          isMaintenance
            ? "border-l-[hsl(var(--maintenance))]"
            : "border-l-[hsl(var(--housekeeping))]"
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isMaintenance ? (
            <Wrench className="h-8 w-8 text-accent" />
          ) : (
            <Sparkles className="h-8 w-8 text-secondary" />
          )}
          <h3 className="font-bold text-2xl text-card-foreground">
            {task.staffName}
          </h3>
        </div>

        <Badge
          className={
            isMaintenance
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-secondary-foreground"
          }
        >
          {task.classification}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Room:</span>
          <span className="text-xl font-bold text-primary">
            {task.roomNumber}
          </span>
        </div>

        <div className="mt-3 p-3 bg-muted rounded-md">
          <p className="text-lg text-card-foreground">{task.actionNeeded}</p>
        </div>
      </div>
    </Card>
  );
};
