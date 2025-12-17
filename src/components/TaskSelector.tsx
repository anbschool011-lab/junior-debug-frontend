import { Bug, Wand2, Zap, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TaskType =
  | "debug"
  | "refactor"
  | "debug-refactor"
  | "performance"
  | "comments";

interface TaskSelectorProps {
  selectedTask: TaskType;
  onTaskChange: (task: TaskType) => void;
}

const tasks = [
  {
    id: "debug" as TaskType,
    label: "Debug Only",
    icon: Bug,
    description: "Find and fix errors",
  },
  {
    id: "refactor" as TaskType,
    label: "Refactor Only",
    icon: Wand2,
    description: "Improve Structure",
  },
  {
    id: "debug-refactor" as TaskType,
    label: "Debug + Refactor",
    icon: Sparkles,
    description: "Full cleanup",
  },
  {
    id: "performance" as TaskType,
    label: "Improve Performance",
    icon: Zap,
    description: "Optimize Speed",
  },
  {
    id: "comments" as TaskType,
    label: "Add Comments",
    icon: MessageSquare,
    description: "Add Comments",
  },
];

const TaskSelector = ({ selectedTask, onTaskChange }: TaskSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Select Task</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isActive = selectedTask === task.id;
          return (
            <Button
              key={task.id}
              variant={isActive ? "taskActive" : "task"}
              className="h-auto py-3 px-3 flex flex-col items-center gap-1.5 text-center"
              onClick={() => onTaskChange(task.id)}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="text-xs font-medium leading-tight">
                {task.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {task.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskSelector;
