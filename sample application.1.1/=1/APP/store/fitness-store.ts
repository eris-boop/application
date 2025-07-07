import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, WorkoutPlan } from '@/types';

interface CompletedWorkout {
  id: string;
  planId: string;
  date: string;
  duration: number;
  caloriesBurned: number;
}

interface FitnessState {
  completedWorkouts: CompletedWorkout[];
  customExercises: Exercise[];
  favoriteExercises: string[];
  weeklyGoal: number;
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  addCustomExercise: (exercise: Exercise) => void;
  removeCustomExercise: (exerciseId: string) => void;
  toggleFavoriteExercise: (exerciseId: string) => void;
  setWeeklyGoal: (goal: number) => void;
  getWeeklyProgress: () => number;
  getTodaysCaloriesBurned: () => number;
  getAllExercises: () => Exercise[];
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      completedWorkouts: [],
      customExercises: [],
      favoriteExercises: [],
      weeklyGoal: 3,
      
      addCompletedWorkout: (workout) => set((state) => ({ 
        completedWorkouts: [...state.completedWorkouts, workout] 
      })),
      
      addCustomExercise: (exercise) => set((state) => ({
        customExercises: [...state.customExercises, exercise]
      })),
      
      removeCustomExercise: (exerciseId) => set((state) => ({
        customExercises: state.customExercises.filter((exercise) => exercise.id !== exerciseId)
      })),
      
      toggleFavoriteExercise: (exerciseId) => set((state) => {
        const isFavorite = state.favoriteExercises.includes(exerciseId);
        return {
          favoriteExercises: isFavorite
            ? state.favoriteExercises.filter((id) => id !== exerciseId)
            : [...state.favoriteExercises, exerciseId],
        };
      }),
      
      setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),
      
      getWeeklyProgress: () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const workoutsThisWeek = get().completedWorkouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= startOfWeek;
        });
        
        return workoutsThisWeek.length;
      },
      
      getTodaysCaloriesBurned: () => {
        const today = new Date().toISOString().split('T')[0];
        
        return get().completedWorkouts
          .filter((workout) => workout.date.startsWith(today))
          .reduce((total, workout) => total + workout.caloriesBurned, 0);
      },
      
      getAllExercises: () => {
        return [...get().customExercises];
      },
    }),
    {
      name: 'fitness-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);