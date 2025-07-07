import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Food } from '@/types';
import { theme } from '@/constants/theme';

interface FoodItemProps {
  food: Food;
  onPress?: () => void;
  showAddButton?: boolean;
}

export const FoodItem: React.FC<FoodItemProps> = ({
  food,
  onPress,
  showAddButton = true,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.servingSize}>
          {food.servingSize}{food.servingUnit}
        </Text>
      </View>
      
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{food.calories}</Text>
          <Text style={styles.nutritionLabel}>Cal</Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{food.protein}g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{food.carbs}g</Text>
          <Text style={styles.nutritionLabel}>Carbs</Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{food.fat}g</Text>
          <Text style={styles.nutritionLabel}>Fat</Text>
        </View>
        
        {showAddButton && (
          <TouchableOpacity style={styles.addButton} onPress={onPress}>
            <Plus size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'column',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  servingSize: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  nutritionLabel: {
    ...theme.typography.small,
    color: theme.colors.subtext,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});