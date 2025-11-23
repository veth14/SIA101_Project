import React, { useEffect, useState } from 'react';
import { TaskCard } from "../staff-task/TaskCard";
import { ClipboardList } from "lucide-react";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../config/firebase';

interface FetchedTask {
  id: string;
  assignedTo: string;
  category: string;
  description: string;
  roomNumber: string;
}

const StaffTaskWorkflow: React.FC = () => {
  const [tasks, setTasks] = useState<FetchedTask[]>([]);

  useEffect(() => {
    const q = query(collection(db, "tickets_task"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: FetchedTask[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          assignedTo: data.assignedTo ?? '',
          category: data.category ?? '',
          description: data.description ?? '',
          roomNumber: data.roomNumber ?? '',
        });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const maintenanceTasks = tasks.filter(task => task.category.toLowerCase() === "maintenance");
  const housekeepingTasks = tasks.filter(task => task.category.toLowerCase() !== "maintenance");

  return (
    <div className="min-h-screen bg-[#F9F6EE] relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-heritage-green/5 to-emerald-100/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute top-32 right-16 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl animate-pulse delay-1000 opacity-25"></div>
        <div className="absolute bottom-16 left-1/4 w-72 h-72 bg-gradient-to-r from-heritage-light/10 to-heritage-neutral/10 rounded-full blur-3xl animate-pulse delay-2000 opacity-20"></div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(134, 134, 134, 0.1) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>
      <div className="relative z-10 mx-auto px-8 py-8 max-w-[1800px] w-full font-poppins">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold text-foreground font-poppins">
              Task Management
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track and manage facility tasks in real-time
          </p>
        </div>

        {/* Two Boxes Container */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* Maintenance Tasks Box */}
          <div className="flex-1 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-semibold mb-4 text-accent font-poppins">Maintenance Tasks</h2>
            {maintenanceTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {maintenanceTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={{
                      id: task.id,
                      staffName: task.assignedTo,
                      actionNeeded: task.description,
                      roomNumber: task.roomNumber,
                      classification: "maintenance"
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No maintenance tasks found</p>
            )}
          </div>

          {/* Housekeeping Tasks Box */}
          <div className="flex-1 bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-semibold mb-4 text-secondary font-poppins">Housekeeping Tasks</h2>
            {housekeepingTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {housekeepingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={{
                      id: task.id,
                      staffName: task.assignedTo,
                      actionNeeded: task.description,
                      roomNumber: task.roomNumber,
                      classification: "housekeeping"
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">No housekeeping tasks found</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffTaskWorkflow;
