import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FoodItem } from '@/components/FoodItem';
import { StatCard } from '@/components/StatCard';
import { AIButton } from '@/components/AIButton';
import { CustomModal } from '@/components/CustomModal';
import { AddFoodForm } from '@/components/AddFoodForm';
import { useNutritionStore } from '@/store/nutrition-store';
import { popularFoods } from '@/mocks/foods';
import { AIService } from '@/services/ai-service';
import { theme } from '@/constants/theme';
import { Search, Plus, Droplets, Sparkles } from 'lucide-react-native';
import { Food, Meal } from '@/types';

export default function NutritionScreen() {
  const { 
    getTodaysNutrition, 
    dailyCalorieGoal, 
    waterIntake, 
    setWaterIntake,
    addMeal,
    removeMeal,
    getTodaysMeals,
    addCustomFood,
    getAllFoods,
  } = useNutritionStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<{ food: Food; quantity: number }[]>([]);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  const todaysNutrition = getTodaysNutrition();
  const todaysMeals = getTodaysMeals();
  const customFoods = getAllFoods();
  const allFoods = [...popularFoods, ...customFoods];
  
  const filteredFoods = allFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFood = (food: Food) => {
    const existingFoodIndex = selectedFoods.findIndex(item => item.food.id === food.id);
    
    if (existingFoodIndex >= 0) {
      const updatedFoods = [...selectedFoods];
      updatedFoods[existingFoodIndex].quantity += food.servingSize;
      setSelectedFoods(updatedFoods);
    } else {
      setSelectedFoods([...selectedFoods, { food, quantity: food.servingSize }]);
    }
  };
  
  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(item => item.food.id !== foodId));
  };
  
  const handleDeleteMeal = (mealId: string) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeMeal(mealId) },
      ]
    );
  };
  
  const handleSaveMeal = () => {
    if (selectedFoods.length === 0) return;
    
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: 'Meal ' + (todaysMeals.length + 1),
      foods: selectedFoods,
      date: new Date().toISOString(),
    };
    
    addMeal(newMeal);
    setSelectedFoods([]);
  };
  
  const handleWaterChange = (amount: number) => {
    setWaterIntake(Math.max(0, waterIntake + amount));
  };
  
  const handleAddCustomFood = (foodData: Omit<Food, 'id'>) => {
    const newFood: Food = {
      ...foodData,
      id: Date.now().toString(),
    };
    addCustomFood(newFood);
  };
  
  const handleGetAIMealSuggestion = async () => {
    try {
      const caloriesRemaining = dailyCalorieGoal - todaysNutrition.calories;
      const suggestion = await AIService.generateMealSuggestion({
        calorieGoal: Math.max(caloriesRemaining, 300),
        dietaryRestrictions: '',
        mealType: getTimeBasedMealType(),
      });
      setAiSuggestion(suggestion);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI suggestion. Please try again.');
    }
  };
  
  const getTimeBasedMealType = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 15) return 'lunch';
    if (hour < 18) return 'snack';
    return 'dinner';
  };
  
  const caloriesRemaining = dailyCalorieGoal - todaysNutrition.calories;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Tracker</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddFoodModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <AIButton
        title="Get AI Meal Suggestion"
        subtitle={`${Math.round(caloriesRemaining > 0 ? caloriesRemaining : 0)} calories remaining`}
        onPress={handleGetAIMealSuggestion}
      />
      
      {aiSuggestion ? (
        <View style={styles.aiSuggestionContainer}>
          <View style={styles.aiSuggestionHeader}>
            <Sparkles size={20} color={theme.colors.purple} />
            <Text style={styles.aiSuggestionTitle}>AI Meal Suggestion</Text>
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
      
      <View style={styles.summaryContainer}>
        <View style={styles.calorieCard}>
          <Text style={styles.calorieTitle}>Calories Remaining</Text>
          <Text style={styles.calorieValue}>
            {Math.round(caloriesRemaining > 0 ? caloriesRemaining : 0)}
          </Text>
          <View style={styles.calorieMeta}>
            <Text style={styles.calorieMetaText}>
              Goal: {dailyCalorieGoal}
            </Text>
            <Text style={styles.calorieMetaText}>
              Food: {Math.round(todaysNutrition.calories)}
            </Text>
          </View>
        </View>
        
        <View style={styles.waterContainer}>
          <StatCard
            title="Water Intake"
            value={`${waterIntake} ml`}
            subtitle="Goal: 2000 ml"
            icon={<Droplets size={20} color={theme.colors.blue} />}
          />
          
          <View style={styles.waterControls}>
            <TouchableOpacity 
              style={styles.waterButton} 
              onPress={() => handleWaterChange(-250)}
            >
              <Text style={styles.waterButtonText}>-250ml</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.waterButton, styles.waterButtonPrimary]} 
              onPress={() => handleWaterChange(250)}
            >
              <Text style={styles.waterButtonTextPrimary}>+250ml</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={theme.colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {selectedFoods.length > 0 && (
        <View style={styles.selectedFoodsContainer}>
          <View style={styles.selectedFoodsHeader}>
            <Text style={styles.selectedFoodsTitle}>Selected Foods</Text>
            <TouchableOpacity 
              style={styles.addMealButton}
              onPress={handleSaveMeal}
            >
              <Text style={styles.addMealButtonText}>Save as Meal</Text>
            </TouchableOpacity>
          </View>
          
          {selectedFoods.map(item => (
            <View key={item.food.id} style={styles.selectedFoodItem}>
              <Text style={styles.selectedFoodName}>{item.food.name}</Text>
              <Text style={styles.selectedFoodQuantity}>
                {item.quantity}{item.food.servingUnit}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveFood(item.food.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <Text style={styles.sectionTitle}>
        {customFoods.length > 0 ? 'All Foods' : 'Popular Foods'}
      </Text>
      
      {filteredFoods.map(food => (
        <FoodItem 
          key={food.id} 
          food={food} 
          onPress={() => handleAddFood(food)}
        />
      ))}
      
      {todaysMeals.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          
          {todaysMeals.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteMeal(meal.id)}>
                  <Text style={styles.deleteMealButton}>Delete</Text>
                </TouchableOpacity>
              </View>
              
              {meal.foods.map(item => (
                <View key={item.food.id} style={styles.mealFoodItem}>
                  <Text style={styles.mealFoodName}>{item.food.name}</Text>
                  <Text style={styles.mealFoodCalories}>
                    {Math.round((item.food.calories * item.quantity) / item.food.servingSize)} cal
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </>
      )}
      
      <CustomModal
        visible={showAddFoodModal}
        onClose={() => setShowAddFoodModal(false)}
        title="Add Custom Food"
      >
        <AddFoodForm
          onAddFood={handleAddCustomFood}
          onClose={() => setShowAddFoodModal(false)}
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
    backgroundColor: theme.colors.accent,
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
  summaryContainer: {
    marginBottom: theme.spacing.lg,
  },
  calorieCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  calorieTitle: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.xs,
  },
  calorieValue: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  calorieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calorieMetaText: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
  },
  waterContainer: {
    marginBottom: theme.spacing.md,
  },
  waterControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  waterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.blue,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  waterButtonPrimary: {
    backgroundColor: theme.colors.blue,
  },
  waterButtonText: {
    color: theme.colors.blue,
    fontWeight: '500',
  },
  waterButtonTextPrimary: {
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    ...theme.typography.body,
  },
  selectedFoodsContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  selectedFoodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  selectedFoodsTitle: {
    ...theme.typography.h3,
  },
  addMealButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  addMealButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedFoodName: {
    ...theme.typography.body,
    flex: 1,
  },
  selectedFoodQuantity: {
    ...theme.typography.body,
    marginHorizontal: theme.spacing.md,
  },
  removeButton: {
    ...theme.typography.caption,
    color: theme.colors.error,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  mealCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  mealName: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  mealFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  mealFoodName: {
    ...theme.typography.body,
  },
  mealFoodCalories: {
    ...theme.typography.body,
    color: theme.colors.subtext,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  deleteMealButton: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
});