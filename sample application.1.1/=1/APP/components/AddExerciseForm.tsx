import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Dumbbell, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Exercise } from '@/types';

interface AddExerciseFormProps {
  onAddExercise: (exercise: Omit<Exercise, 'id'>) => void;
  onClose: () => void;
}

export const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ onAddExercise, onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [caloriesBurnedPerMinute, setCaloriesBurnedPerMinute] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !category.trim() || !caloriesBurnedPerMinute) return;

    onAddExercise({
      name: name.trim(),
      category: category.trim(),
      caloriesBurnedPerMinute: parseFloat(caloriesBurnedPerMinute),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });

    setName('');
    setCategory('');
    setCaloriesBurnedPerMinute('');
    setDescription('');
    setImageUrl('');
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter exercise name..."
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Cardio, Strength, Flexibility..."
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Calories Burned per Minute</Text>
      <TextInput
        style={styles.input}
        placeholder="10"
        value={caloriesBurnedPerMinute}
        onChangeText={setCaloriesBurnedPerMinute}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the exercise..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Image URL (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/image.jpg"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Plus size={20} color="white" />
        <Text style={styles.submitButtonText}>Add Exercise</Text>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
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