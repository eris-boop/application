import { Task, Habit } from '@/types';

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: 'high',
    category: 'Work',
  },
  {
    id: '2',
    title: 'Go grocery shopping',
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'medium',
    category: 'Personal',
  },
  {
    id: '3',
    title: 'Schedule dentist appointment',
    completed: false,
    priority: 'low',
    category: 'Health',
  },
  {
    id: '4',
    title: 'Read 30 pages',
    completed: false,
    priority: 'medium',
    category: 'Personal',
  },
];

export const sampleHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink 8 glasses of water',
    frequency: 'daily',
    completedDates: [],
    streak: 0,
  },
  {
    id: '2',
    name: 'Meditate for 10 minutes',
    frequency: 'daily',
    completedDates: [],
    streak: 0,
  },
  {
    id: '3',
    name: 'Exercise for 30 minutes',
    frequency: 'daily',
    completedDates: [],
    streak: 0,
  },
  {
    id: '4',
    name: 'Clean the house',
    frequency: 'weekly',
    completedDates: [],
    streak: 0,
  },
];