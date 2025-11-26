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
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border-l-4" 
          style={{ borderLeftColor: isMaintenance ? "hsl(var(--maintenance))" : "hsl(var(--housekeeping))" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isMaintenance ? (
            <Wrench className="h-5 w-5 text-accent" />
          ) : (
            <Sparkles className="h-5 w-5 text-secondary" />
          )}
          <h3 className="font-semibold text-card-foreground">{task.staffName}</h3>
        </div>
        <Badge 
          className={isMaintenance ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}
        >
          {task.classification}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Room:</span>
          <span className="text-sm font-semibold text-primary">{task.roomNumber}</span>
        </div>
        
        <div className="mt-3 p-3 bg-muted rounded-md">
          <p className="text-sm text-card-foreground">{task.actionNeeded}</p>
        </div>
      </div>
    </Card>
  );
};
