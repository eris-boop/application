import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ExerciseItem } from '@/components/ExerciseItem';
import { ProgressCircle } from '@/components/ProgressCircle';
import { AIButton } from '@/components/AIButton';
import { CustomModal } from '@/components/CustomModal';
import { AddExerciseForm } from '@/components/AddExerciseForm';
import { useFitnessStore } from '@/store/fitness-store';
import { exercises, workoutPlans } from '@/mocks/exercises';
import { AIService } from '@/services/ai-service';
import { theme } from '@/constants/theme';
import { Dumbbell, Clock, Flame, Plus, Sparkles } from 'lucide-react-native';
import { Exercise, WorkoutPlan } from '@/types';

export default function FitnessScreen() {
  const { 
    getWeeklyProgress, 
    weeklyGoal, 
    addCompletedWorkout,
    getTodaysCaloriesBurned,
    addCustomExercise,
    getAllExercises,
  } = useFitnessStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  const weeklyProgress = getWeeklyProgress();
  const caloriesBurned = getTodaysCaloriesBurned();
  const customExercises = getAllExercises();
  const allExercises = [...exercises, ...customExercises];
  
  const categories = ['All', ...Array.from(new Set(allExercises.map(e => e.category)))];
  
  const filteredExercises = selectedCategory && selectedCategory !== 'All'
    ? allExercises.filter(exercise => exercise.category === selectedCategory)
    : allExercises;
  
  const handleCompleteWorkout = (plan: WorkoutPlan) => {
    // Calculate total duration and calories burned
    const totalDuration = plan.exercises.reduce((sum, item) => sum + item.duration, 0);
    const totalCalories = plan.exercises.reduce((sum, item) => 
      sum + (item.exercise.caloriesBurnedPerMinute * item.duration), 0);
    
    addCompletedWorkout({
      id: Date.now().toString(),
      planId: plan.id,
      date: new Date().toISOString(),
      duration: totalDuration,
      caloriesBurned: totalCalories,
    });
    
    Alert.alert('Workout Complete!', `Great job! You burned ${Math.round(totalCalories)} calories.`);
  };
  
  const handleAddCustomExercise = (exerciseData: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: Date.now().toString(),
    };
    addCustomExercise(newExercise);
    setShowAddExerciseModal(false);
  };
  
  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this custom exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Remove from custom exercises (you'll need to add this to store)
          console.log('Delete exercise:', exerciseId);
        }},
      ]
    );
  };
  
  const handleGetAIWorkoutSuggestion = async () => {
    try {
      const suggestion = await AIService.generateWorkoutSuggestion({
        fitnessLevel: 'intermediate',
        availableTime: 30,
        goals: 'general fitness and weight loss',
      });
      setAiSuggestion(suggestion);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI suggestion. Please try again.');
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Fitness Tracker</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddExerciseModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <AIButton
        title="Get AI Workout Plan"
        subtitle="Personalized workout based on your goals"
        onPress={handleGetAIWorkoutSuggestion}
      />
      
      {aiSuggestion ? (
        <View style={styles.aiSuggestionContainer}>
          <View style={styles.aiSuggestionHeader}>
            <Sparkles size={20} color={theme.colors.purple} />
            <Text style={styles.aiSuggestionTitle}>AI Workout Plan</Text>
          </View>
          <Text style={styles.aiSuggestionText}>{aiSuggestion}</Text>
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={() => setAiSuggestion('')}
          >
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
      <View style={styles.statsContainer}>
        <View style={styles.weeklyProgressContainer}>
          <ProgressCircle 
            progress={weeklyProgress / weeklyGoal} 
            size={100} 
            color={theme.colors.secondary}
          >
            <Text style={styles.progressValue}>
              {weeklyProgress}/{weeklyGoal}
            </Text>
            <Text style={styles.progressLabel}>Weekly</Text>
          </ProgressCircle>
        </View>
        
        <View style={styles.statsCards}>
          <View style={styles.statCard}>
            <Flame size={24} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{Math.round(caloriesBurned)}</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock size={24} color={theme.colors.secondary} />
            <Text style={styles.statValue}>
              {Math.round(caloriesBurned / 10)} min
            </Text>
            <Text style={styles.statLabel}>Active Time</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Workout Plans</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.workoutPlansContainer}
      >
        {workoutPlans.map(plan => (
          <View key={plan.id} style={styles.workoutPlanCard}>
            <Text style={styles.workoutPlanName}>{plan.name}</Text>
            
            <View style={styles.workoutPlanStats}>
              <View style={styles.workoutPlanStat}>
                <Clock size={16} color={theme.colors.subtext} />
                <Text style={styles.workoutPlanStatText}>
                  {plan.exercises.reduce((sum, item) => sum + item.duration, 0)} min
                </Text>
              </View>
              
              <View style={styles.workoutPlanStat}>
                <Dumbbell size={16} color={theme.colors.subtext} />
                <Text style={styles.workoutPlanStatText}>
                  {plan.exercises.length} exercises
                </Text>
              </View>
            </View>
            
            <View style={styles.workoutPlanExercises}>
              {plan.exercises.slice(0, 2).map(item => (
                <Text key={item.exercise.id} style={styles.workoutPlanExerciseItem}>
                  • {item.exercise.name} ({item.duration} min)
                </Text>
              ))}
              {plan.exercises.length > 2 && (
                <Text style={styles.workoutPlanExerciseItem}>
                  • {plan.exercises.length - 2} more...
                </Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.startWorkoutButton}
              onPress={() => handleCompleteWorkout(plan)}
            >
              <Text style={styles.startWorkoutButtonText}>Complete Workout</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <Text style={styles.sectionTitle}>
        {customExercises.length > 0 ? 'All Exercises' : 'Exercises'}
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category === selectedCategory ? null : category)}
          >
            <Text 
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {filteredExercises.map(exercise => (
        <View key={exercise.id} style={styles.exerciseContainer}>
          <ExerciseItem exercise={exercise} />
          {customExercises.some(e => e.id === exercise.id) && (
            <TouchableOpacity 
              style={styles.deleteExerciseButton}
              onPress={() => handleDeleteExercise(exercise.id)}
            >
              <Text style={styles.deleteExerciseText}>Delete Custom Exercise</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      
      <CustomModal
        visible={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        title="Add Custom Exercise"
      >
        <AddExerciseForm
          onAddExercise={handleAddCustomExercise}
          onClose={() => setShowAddExerciseModal(false)}
        />
      </CustomModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiSuggestionContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.purple,
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  aiSuggestionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
    color: theme.colors.purple,
  },
  aiSuggestionText: {
    ...theme.typography.body,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  dismissButton: {
    alignSelf: 'flex-end',
  },
  dismissButtonText: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  weeklyProgressContainer: {
    marginRight: theme.spacing.lg,
  },
  progressValue: {
    ...theme.typography.body,
    fontWeight: 'bold',
  },
  progressLabel: {
    ...theme.typography.small,
    color: theme.colors.subtext,
  },
  statsCards: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.h3,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  workoutPlansContainer: {
    paddingBottom: theme.spacing.md,
  },
  workoutPlanCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    width: 250,
  },
  workoutPlanName: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  workoutPlanStats: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  workoutPlanStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  workoutPlanStatText: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
    marginLeft: theme.spacing.xs,
  },
  workoutPlanExercises: {
    marginBottom: theme.spacing.md,
  },
  workoutPlanExerciseItem: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
  },
  startWorkoutButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  startWorkoutButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  categoryButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.card,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.secondary,
  },
  categoryButtonText: {
    ...theme.typography.body,
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  exerciseContainer: {
    marginBottom: theme.spacing.md,
  },
  deleteExerciseButton: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  deleteExerciseText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});