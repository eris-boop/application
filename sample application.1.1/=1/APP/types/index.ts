export type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
};

export type Meal = {
  id: string;
  name: string;
  foods: {
    food: Food;
    quantity: number;
  }[];
  date: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  caloriesBurnedPerMinute: number;
  description: string;
  imageUrl?: string;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  exercises: {
    exercise: Exercise;
    duration: number;
    sets?: number;
    reps?: number;
  }[];
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
};

export type Habit = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  streak: number;
};

export type DailyStats = {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  tasksCompleted: number;
  habitsCompleted: number;
};