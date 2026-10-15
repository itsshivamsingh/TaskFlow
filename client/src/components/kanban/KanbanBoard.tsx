import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { taskService } from '../../services/taskService';
import { toast } from 'sonner';

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (updatedTasks: Task[]) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTasksChange,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onQuickAddTask,
}) => {
  const [boardTasks, setBoardTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const todoTasks = boardTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = boardTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = boardTasks.filter((t) => t.status === 'completed');

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const previousTasks = [...boardTasks];

    // Optimistic UI update
    const updatedTasks = boardTasks.map((task) => {
      if (task._id === draggableId) {
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });

    setBoardTasks(updatedTasks);
    onTasksChange(updatedTasks);

    try {
      await taskService.updateTaskStatus(draggableId, newStatus);
      toast.success(
        `Task moved to ${
          newStatus === 'in_progress' ? 'In Progress' : newStatus === 'todo' ? 'To Do' : 'Completed'
        }`
      );
    } catch (err: any) {
      // Revert state on error
      setBoardTasks(previousTasks);
      onTasksChange(previousTasks);
      toast.error('Failed to update task status on server. Reverting change.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
    const previousTasks = [...boardTasks];

    const updatedTasks = boardTasks.map((t) =>
      t._id === task._id
        ? {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          }
        : t
    );

    setBoardTasks(updatedTasks);
    onTasksChange(updatedTasks);

    try {
      await taskService.updateTaskStatus(task._id, nextStatus);
      toast.success(nextStatus === 'completed' ? 'Task marked as completed' : 'Task reopened');
    } catch (err) {
      setBoardTasks(previousTasks);
      onTasksChange(previousTasks);
      toast.error('Failed to update task status');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        <KanbanColumn
          id="todo"
          title="To Do"
          tasks={todoTasks}
          onViewTask={onViewTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleComplete={handleToggleComplete}
          onQuickAddTask={onQuickAddTask}
        />

        <KanbanColumn
          id="in_progress"
          title="In Progress"
          tasks={inProgressTasks}
          onViewTask={onViewTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleComplete={handleToggleComplete}
          onQuickAddTask={onQuickAddTask}
        />

        <KanbanColumn
          id="completed"
          title="Completed"
          tasks={completedTasks}
          onViewTask={onViewTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleComplete={handleToggleComplete}
          onQuickAddTask={onQuickAddTask}
        />
      </div>
    </DragDropContext>
  );
};
