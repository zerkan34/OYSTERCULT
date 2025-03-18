import React from 'react';
import { TaskCard } from './TaskCard';

interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  assignee: string;
  location: string;
  tags: string[];
}

interface TaskListProps {
  tasks: Task[];
  onEditTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onEditTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={{
            ...task,
            title: task.name
          }}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}
