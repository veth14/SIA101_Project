import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface TaskFiltersProps {
  selectedFilter: "all" | "maintenance" | "housekeeping";
  onFilterChange: (filter: "all" | "maintenance" | "housekeeping") => void;
}

export const TaskFilters = ({
  selectedFilter,
  onFilterChange,
}: TaskFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All Tasks
        </Button>
        <Button
          variant={selectedFilter === "maintenance" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("maintenance")}
          className={selectedFilter === "maintenance" ? "bg-accent hover:bg-accent/90" : ""}
        >
          Maintenance
        </Button>
        <Button
          variant={selectedFilter === "housekeeping" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("housekeeping")}
          className={selectedFilter === "housekeeping" ? "bg-secondary hover:bg-secondary/90" : ""}
        >
          Housekeeping
        </Button>
      </div>
    </div>
  );
};
