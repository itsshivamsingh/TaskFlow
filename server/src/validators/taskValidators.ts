import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional()
    .default(''),
  status: z.enum(['todo', 'in_progress', 'completed']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  dueDate: z.string({ required_error: 'Due date is required' }).refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid due date format',
  }),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid start date format',
    })
    .optional(),
  category: z.string().trim().max(50).optional().default('Work'),
  tags: z.array(z.string().trim().max(30)).optional().default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(['todo', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid due date format' })
    .optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date format' })
    .optional()
    .nullable(),
  category: z.string().trim().max(50).optional(),
  tags: z.array(z.string().trim().max(30)).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'completed'], {
    required_error: 'Valid status is required',
  }),
});

export const taskQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'todo', 'in_progress', 'completed']).optional(),
  priority: z.enum(['all', 'low', 'medium', 'high', 'urgent']).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  dueDateFilter: z.enum(['all', 'today', 'this_week', 'overdue', 'upcoming']).optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
});
