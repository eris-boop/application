import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Calendar, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Habit } from '@/types';

interface AddHabitFormProps {
  habit?: Habit | null;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  onClose: () => void;
}

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ habit, onAddHabit, onClose }) => {
  const [name, setName] = useState(habit?.name || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(habit?.frequency || 'daily');

  const handleSubmit = () => {
    if (!name.trim()) return;

    onAddHabit({
      name: name.trim(),
      frequency,
    });

    if (!habit) {
      setName('');
      setFrequency('daily');
    }
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter habit name..."
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.frequencyContainer}>
        {(['daily', 'weekly'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.frequencyButton,
              frequency === f && styles.frequencyButtonActive,
            ]}
            onPress={() => setFrequency(f)}
          >
            <Calendar size={16} color={frequency === f ? 'white' : theme.colors.secondary} />
            <Text
              style={[
                styles.frequencyText,
                frequency === f && styles.frequencyTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Plus size={20} color="white" />
        <Text style={styles.submitButtonText}>
          {habit ? 'Update Habit' : 'Add Habit'}
        </Text>
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
  frequencyContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  frequencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    gap: theme.spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: theme.colors.secondary,
  },
  frequencyText: {
    fontWeight: '500',
    color: theme.colors.secondary,
  },
  frequencyTextActive: {
    color: 'white',
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