import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { TaskFilters } from "@/components/TaskFilters";
import { ClipboardList } from "lucide-react";
import { Task } from "@/types/task";

// Mock data - this will be replaced with Firebase data
const mockTasks: Task[] = [
  {
    id: "1",
    staffName: "Maria Santos",
    roomNumber: "301",
    actionNeeded: "Deep cleaning required - guest checked out, complete sanitization needed",
    classification: "housekeeping",
  },
  {
    id: "2",
    staffName: "John Martinez",
    roomNumber: "405",
    actionNeeded: "Air conditioner not working - guest reported no cooling",
    classification: "maintenance",
  },
  {
    id: "3",
    staffName: "Sarah Chen",
    roomNumber: "212",
    actionNeeded: "Replenish toiletries and fresh towels",
    classification: "housekeeping",
  },
  {
    id: "4",
    staffName: "Robert Kim",
    roomNumber: "508",
    actionNeeded: "Leaking faucet in bathroom - needs immediate attention",
    classification: "maintenance",
  },
  {
    id: "5",
    staffName: "Linda Rodriguez",
    roomNumber: "103",
    actionNeeded: "Room cleaning and bed making",
    classification: "housekeeping",
  },
  {
    id: "6",
    staffName: "David Lee",
    roomNumber: "607",
    actionNeeded: "TV remote not functioning - batteries need replacement",
    classification: "maintenance",
  },
];

const Index = () => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "maintenance" | "housekeeping">("all");

  const filteredTasks = mockTasks.filter((task) => {
    const matchesFilter =
      selectedFilter === "all" || task.classification === selectedFilter;

    return matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Task Management</h1>
          </div>
          <p className="text-muted-foreground">
            Track and manage facility tasks in real-time
          </p>
        </div>

        <div className="mb-6">
          <TaskFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
