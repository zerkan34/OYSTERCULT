import { Id } from "../../convex/_generated/dataModel";

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  _id: Id<"tasks">;
  _creationTime: number;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: Id<"users">;
  isRecurring: boolean;
  recurrencePattern?: string;
  estimatedHours: number;
  priority: TaskPriority;
  status: TaskStatus;
  tags?: string[];
  completedAt?: number;
  completedBy?: Id<"users">;
  parentTask?: Id<"tasks">;
  subtasks: Id<"tasks">[];
  attachments: string[];
  comments: {
    content: string;
    author: string;
    createdAt: number;
  }[];
  history: {
    action: string;
    timestamp: number;
    userId: Id<"users">;
  }[];
}
