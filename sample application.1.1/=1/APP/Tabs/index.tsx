import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ProgressCircle } from '@/components/ProgressCircle';
import { StatCard } from '@/components/StatCard';
import { AIButton } from '@/components/AIButton';
import { useNutritionStore } from '@/store/nutrition-store';
import { useFitnessStore } from '@/store/fitness-store';
import { useProductivityStore } from '@/store/productivity-store';
import { AIService } from '@/services/ai-service';
import { theme } from '@/constants/theme';
import { Utensils, Dumbbell, CheckSquare, Droplets, TrendingUp, Sparkles } from 'lucide-react-native';

export default function DashboardScreen() {
  const { getTodaysNutrition, dailyCalorieGoal, waterIntake } = useNutritionStore();
  const { getTodaysCaloriesBurned, getWeeklyProgress, weeklyGoal } = useFitnessStore();
  const { getCompletedTasksCount, getCompletedHabitsCount, tasks, habits } = useProductivityStore();
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  const todaysNutrition = getTodaysNutrition();
  const caloriesBurned = getTodaysCaloriesBurned();
  const completedTasks = getCompletedTasksCount();
  const completedHabits = getCompletedHabitsCount();
  const weeklyWorkouts = getWeeklyProgress();
  
  const calorieProgress = Math.min(todaysNutrition.calories / dailyCalorieGoal, 1);
  const workoutProgress = Math.min(weeklyWorkouts / weeklyGoal, 1);
  const taskProgress = tasks.length > 0 ? completedTasks / tasks.length : 0;
  const habitProgress = habits.length > 0 ? completedHabits / habits.length : 0;
  const waterProgress = Math.min(waterIntake / 2000, 1);
  
  const handleGetDailyInsights = async () => {
    try {
      const insights = await AIService.generateProductivityTips({
        currentTasks: tasks.filter(t => !t.completed).length,
        completedToday: completedTasks,
        timeOfDay: getTimeOfDay(),
      });
      setAiSuggestion(insights);
    } catch (error) {
      Alert.alert('Error', 'Failed to get daily insights. Please try again.');
    }
  };
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };
  
  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const greetings = {
      morning: 'Good Morning! ☀️',
      afternoon: 'Good Afternoon! 🌤️',
      evening: 'Good Evening! 🌙',
    };
    return greetings[timeOfDay];
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.subtitle}>Here is your daily progress</Text>
      
      <AIButton
        title="Get Daily Insights"
        subtitle="AI-powered analysis of your progress"
        onPress={handleGetDailyInsights}
      />
      
      {aiSuggestion ? (
        <View style={styles.aiSuggestionContainer}>
          <View style={styles.aiSuggestionHeader}>
            <Sparkles size={20} color={theme.colors.purple} />
            <Text style={styles.aiSuggestionTitle}>Daily Insights</Text>
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
      
      <View style={styles.progressSection}>
        <View style={styles.progressItem}>
          <ProgressCircle 
            progress={calorieProgress} 
            size={90} 
            color={theme.colors.primary}
          >
            <Text style={styles.progressValue}>
              {Math.round(calorieProgress * 100)}%
            </Text>
            <Text style={styles.progressLabel}>Calories</Text>
          </ProgressCircle>
        </View>
        
        <View style={styles.progressItem}>
          <ProgressCircle 
            progress={workoutProgress} 
            size={90} 
            color={theme.colors.secondary}
          >
            <Text style={styles.progressValue}>
              {weeklyWorkouts}/{weeklyGoal}
            </Text>
            <Text style={styles.progressLabel}>Workouts</Text>
          </ProgressCircle>
        </View>
        
        <View style={styles.progressItem}>
          <ProgressCircle 
            progress={waterProgress} 
            size={90} 
            color={theme.colors.blue}
          >
            <Text style={styles.progressValue}>
              {Math.round(waterProgress * 100)}%
            </Text>
            <Text style={styles.progressLabel}>Water</Text>
          </ProgressCircle>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Today's Summary</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statsColumn}>
          <StatCard
            title="Calories Consumed"
            value={Math.round(todaysNutrition.calories)}
            subtitle={`Goal: ${dailyCalorieGoal}`}
            icon={<Utensils size={20} color={theme.colors.primary} />}
          />
          
          <StatCard
            title="Tasks Completed"
            value={`${completedTasks}/${tasks.length}`}
            subtitle={`${Math.round(taskProgress * 100)}% complete`}
            icon={<CheckSquare size={20} color={theme.colors.accent} />}
            color={theme.colors.accent}
          />
        </View>
        
        <View style={styles.statsColumn}>
          <StatCard
            title="Calories Burned"
            value={Math.round(caloriesBurned)}
            subtitle="From workouts"
            icon={<Dumbbell size={20} color={theme.colors.secondary} />}
            color={theme.colors.secondary}
          />
          
          <StatCard
            title="Habits Completed"
            value={`${completedHabits}/${habits.length}`}
            subtitle={`${Math.round(habitProgress * 100)}% complete`}
            icon={<TrendingUp size={20} color={theme.colors.pink} />}
            color={theme.colors.pink}
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
      
      <View style={styles.nutritionBreakdown}>
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: theme.colors.primary }]} />
          <Text style={styles.macroValue}>{Math.round(todaysNutrition.protein)}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: theme.colors.accent }]} />
          <Text style={styles.macroValue}>{Math.round(todaysNutrition.carbs)}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: theme.colors.error }]} />
          <Text style={styles.macroValue}>{Math.round(todaysNutrition.fat)}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
        
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, { backgroundColor: theme.colors.blue }]} />
          <Text style={styles.macroValue}>{waterIntake}ml</Text>
          <Text style={styles.macroLabel}>Water</Text>
        </View>
      </View>
      
      <View style={styles.motivationCard}>
        <Text style={styles.motivationTitle}>Keep Going! 💪</Text>
        <Text style={styles.motivationText}>
          You're making great progress. Every small step counts towards your goals.
        </Text>
      </View>
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
  greeting: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.lg,
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
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    ...theme.typography.body,
    fontWeight: 'bold',
  },
  progressLabel: {
    ...theme.typography.small,
    color: theme.colors.subtext,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  statsColumn: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  nutritionBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: theme.spacing.xs,
  },
  macroValue: {
    ...theme.typography.h3,
    fontSize: 16,
  },
  macroLabel: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
  },
  motivationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  motivationTitle: {
    ...theme.typography.h3,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.sm,
  },
  motivationText: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.subtext,
    lineHeight: 22,
  },
});