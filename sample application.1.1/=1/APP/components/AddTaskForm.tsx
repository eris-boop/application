import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Calendar, Flag, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Task } from '@/types';

interface AddTaskFormProps {
  task?: Task | null;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ task, onAddTask, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate?.split('T')[0] || '');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      completed: task?.completed || false,
      priority,
      category: category.trim() || undefined,
      dueDate: dueDate || undefined,
    });

    if (!task) {
      setTitle('');
      setCategory('');
      setPriority('medium');
      setDueDate('');
    }
    onClose();
  };

  const priorityColors = {
    low: theme.colors.success,
    medium: theme.colors.warning,
    high: theme.colors.error,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title..."
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <Text style={styles.label}>Category (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Work, Personal, Health..."
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Due Date (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityContainer}>
        {(['low', 'medium', 'high'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityButton,
              { borderColor: priorityColors[p] },
              priority === p && { backgroundColor: priorityColors[p] },
            ]}
            onPress={() => setPriority(p)}
          >
            <Flag size={16} color={priority === p ? 'white' : priorityColors[p]} />
            <Text
              style={[
                styles.priorityText,
                { color: priority === p ? 'white' : priorityColors[p] },
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Plus size={20} color="white" />
        <Text style={styles.submitButtonText}>
          {task ? 'Update Task' : 'Add Task'}
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
  priorityContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    gap: theme.spacing.xs,
  },
  priorityText: {
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
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