import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food, Meal } from '@/types';

interface NutritionState {
  meals: Meal[];
  customFoods: Food[];
  waterIntake: number;
  dailyCalorieGoal: number;
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  updateMeal: (updatedMeal: Meal) => void;
  addCustomFood: (food: Food) => void;
  removeCustomFood: (foodId: string) => void;
  setWaterIntake: (amount: number) => void;
  setDailyCalorieGoal: (goal: number) => void;
  getTodaysMeals: () => Meal[];
  getTodaysNutrition: () => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  getAllFoods: () => Food[];
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      meals: [],
      customFoods: [],
      waterIntake: 0,
      dailyCalorieGoal: 2000,
      
      addMeal: (meal) => set((state) => ({ 
        meals: [...state.meals, meal] 
      })),
      
      removeMeal: (mealId) => set((state) => ({ 
        meals: state.meals.filter((meal) => meal.id !== mealId) 
      })),
      
      updateMeal: (updatedMeal) => set((state) => ({ 
        meals: state.meals.map((meal) => 
          meal.id === updatedMeal.id ? updatedMeal : meal
        ) 
      })),
      
      addCustomFood: (food) => set((state) => ({
        customFoods: [...state.customFoods, food]
      })),
      
      removeCustomFood: (foodId) => set((state) => ({
        customFoods: state.customFoods.filter((food) => food.id !== foodId)
      })),
      
      setWaterIntake: (amount) => set({ waterIntake: amount }),
      
      setDailyCalorieGoal: (goal) => set({ dailyCalorieGoal: goal }),
      
      getTodaysMeals: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().meals.filter((meal) => meal.date.startsWith(today));
      },
      
      getTodaysNutrition: () => {
        const todaysMeals = get().getTodaysMeals();
        
        return todaysMeals.reduce(
          (acc, meal) => {
            meal.foods.forEach(({ food, quantity }) => {
              const multiplier = quantity / food.servingSize;
              acc.calories += food.calories * multiplier;
              acc.protein += food.protein * multiplier;
              acc.carbs += food.carbs * multiplier;
              acc.fat += food.fat * multiplier;
            });
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
      },
      
      getAllFoods: () => {
        return [...get().customFoods];
      },
    }),
    {
      name: 'nutrition-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);