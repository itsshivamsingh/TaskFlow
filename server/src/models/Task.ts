import mongoose, { Document, Schema, Model } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  startDate?: Date;
  category: string;
  tags: string[];
  owner: mongoose.Types.ObjectId;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true,
    },
    startDate: {
      type: Date,
    },
    category: {
      type: String,
      default: 'Work',
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task owner is required'],
      index: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Compound indexes for optimal dashboard and filter queries
taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, dueDate: 1 });
taskSchema.index({ owner: 1, priority: 1 });
taskSchema.index({ owner: 1, category: 1 });
taskSchema.index({ owner: 1, createdAt: -1 });

export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
