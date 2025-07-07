import { Exercise, WorkoutPlan } from '@/types';

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Running',
    category: 'Cardio',
    caloriesBurnedPerMinute: 10,
    description: 'Running at a moderate pace helps improve cardiovascular health and burn calories.',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '2',
    name: 'Push-ups',
    category: 'Strength',
    caloriesBurnedPerMinute: 7,
    description: 'Push-ups target your chest, shoulders, and triceps while also engaging your core.',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '3',
    name: 'Squats',
    category: 'Strength',
    caloriesBurnedPerMinute: 8,
    description: 'Squats are a compound exercise that primarily targets your quadriceps, hamstrings, and glutes.',
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '4',
    name: 'Cycling',
    category: 'Cardio',
    caloriesBurnedPerMinute: 8.5,
    description: 'Cycling is a low-impact cardio exercise that strengthens your legs and improves endurance.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '5',
    name: 'Plank',
    category: 'Core',
    caloriesBurnedPerMinute: 5,
    description: 'Planks strengthen your core, improve posture, and reduce back pain.',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '6',
    name: 'Yoga',
    category: 'Flexibility',
    caloriesBurnedPerMinute: 4,
    description: 'Yoga improves flexibility, balance, and mental well-being through various poses and breathing techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];

export const workoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Beginner Cardio',
    exercises: [
      { exercise: exercises[0], duration: 15 },
      { exercise: exercises[3], duration: 15 },
      { exercise: exercises[4], duration: 5 },
    ],
  },
  {
    id: '2',
    name: 'Full Body Strength',
    exercises: [
      { exercise: exercises[1], duration: 10, sets: 3, reps: 10 },
      { exercise: exercises[2], duration: 10, sets: 3, reps: 15 },
      { exercise: exercises[4], duration: 5, sets: 3 },
    ],
  },
  {
    id: '3',
    name: 'Flexibility & Recovery',
    exercises: [
      { exercise: exercises[5], duration: 20 },
      { exercise: exercises[4], duration: 5 },
    ],
  },
];