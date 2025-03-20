import { Id } from "../../../../convex/_generated/dataModel";

export type TaskStatus = "pending" | "in_progress" | "completed" | "all";
export type TaskPriority = "high" | "medium" | "low" | "all";

export interface TaskFilters {
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
}

export interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFormProps {
  onSubmit: (taskData: {
    title: string;
    description: string;
    dueDate: string;
    assignedTo: Id<"users">;
    isRecurring: boolean;
    recurrencePattern?: string;
    estimatedHours: number;
    priority: Exclude<TaskPriority, "all">;
    status: Exclude<TaskStatus, "all">;
    tags?: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

export interface TaskListProps {
  searchQuery: string;
  filter: TaskFilters;
  onTaskSelect?: (taskId: Id<"tasks">) => void;
}
