import React from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from '../tasks/TaskCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Inbox } from 'lucide-react';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onQuickAddTask,
}) => {
  const getHeaderStyle = () => {
    switch (id) {
      case 'completed':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40';
      case 'in_progress':
        return 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40';
      case 'todo':
      default:
        return 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="flex-1 min-w-[280px] max-w-full flex flex-col bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800/70 shadow-xs">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getHeaderStyle()}`}>
            {title}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onQuickAddTask(id)}
          className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-2.5 min-h-[350px] p-1.5 rounded-xl transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-400/30'
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onView={onViewTask}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onToggleComplete={onToggleComplete}
                      isDragging={dragSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-white/40 dark:bg-slate-900/30">
                <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  No tasks in {title.toLowerCase()}
                </p>
                <button
                  type="button"
                  onClick={() => onQuickAddTask(id)}
                  className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  + Add a task
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
