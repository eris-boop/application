import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Habit } from '@/types';
import { sampleTasks, sampleHabits } from '@/mocks/productivity';

interface ProductivityState {
  tasks: Task[];
  habits: Habit[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  removeHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string) => void;
  getTodaysTasks: () => Task[];
  getCompletedTasksCount: () => number;
  getCompletedHabitsCount: () => number;
  clearCompletedTasks: () => void;
}

export const useProductivityStore = create<ProductivityState>()(
  persist(
    (set, get) => ({
      tasks: sampleTasks,
      habits: sampleHabits,
      
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, { ...task, id: Date.now().toString() }] 
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })),
      
      removeTask: (taskId) => set((state) => ({ 
        tasks: state.tasks.filter((task) => task.id !== taskId) 
      })),
      
      toggleTaskCompletion: (taskId) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      })),
      
      addHabit: (habit) => set((state) => ({ 
        habits: [...state.habits, { 
          ...habit, 
          id: Date.now().toString(),
          completedDates: [],
          streak: 0,
        }] 
      })),
      
      updateHabit: (habitId, updates) => set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === habitId ? { ...habit, ...updates } : habit
        ),
      })),
      
      removeHabit: (habitId) => set((state) => ({ 
        habits: state.habits.filter((habit) => habit.id !== habitId) 
      })),
      
      toggleHabitCompletion: (habitId) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        
        return {
          habits: state.habits.map((habit) => {
            if (habit.id !== habitId) return habit;
            
            const isCompleted = habit.completedDates.includes(today);
            const completedDates = isCompleted
              ? habit.completedDates.filter((date) => date !== today)
              : [...habit.completedDates, today];
            
            // Calculate streak
            let streak = 0;
            if (completedDates.length > 0) {
              completedDates.sort();
              streak = 1;
              
              for (let i = completedDates.length - 1; i > 0; i--) {
                const current = new Date(completedDates[i]);
                const prev = new Date(completedDates[i - 1]);
                const diffDays = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                  streak++;
                } else {
                  break;
                }
              }
            }
            
            return {
              ...habit,
              completedDates,
              streak,
            };
          }),
        };
      }),
      
      getTodaysTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter((task) => {
          if (!task.dueDate) return true;
          return task.dueDate.startsWith(today);
        });
      },
      
      getCompletedTasksCount: () => {
        return get().tasks.filter((task) => task.completed).length;
      },
      
      getCompletedHabitsCount: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().habits.filter((habit) => 
          habit.completedDates.includes(today)
        ).length;
      },
      
      clearCompletedTasks: () => set((state) => ({
        tasks: state.tasks.filter((task) => !task.completed)
      })),
    }),
    {
      name: 'productivity-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);