import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Utensils, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Food } from '@/types';

interface AddFoodFormProps {
  onAddFood: (food: Omit<Food, 'id'>) => void;
  onClose: () => void;
}

export const AddFoodForm: React.FC<AddFoodFormProps> = ({ onAddFood, onClose }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [servingUnit, setServingUnit] = useState('g');

  const handleSubmit = () => {
    if (!name.trim() || !calories || !servingSize) return;

    onAddFood({
      name: name.trim(),
      calories: parseFloat(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      servingSize: parseFloat(servingSize),
      servingUnit: servingUnit.trim(),
    });

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setServingSize('');
    setServingUnit('g');
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Food Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter food name..."
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Serving Size</Text>
          <TextInput
            style={styles.input}
            placeholder="100"
            value={servingSize}
            onChangeText={setServingSize}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={styles.input}
            placeholder="g"
            value={servingUnit}
            onChangeText={setServingUnit}
          />
        </View>
      </View>

      <Text style={styles.label}>Calories (per serving)</Text>
      <TextInput
        style={styles.input}
        placeholder="250"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.thirdWidth}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="20"
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.thirdWidth}>
          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="30"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.thirdWidth}>
          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Plus size={20} color="white" />
        <Text style={styles.submitButtonText}>Add Food</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
