import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Clock, Flag, Edit, Trash2 } from 'lucide-react-native';
import { Task } from '@/types';
import { theme } from '@/constants/theme';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onPress,
}) => {
  const priorityColors = {
    low: theme.colors.secondary,
    medium: theme.colors.warning,
    high: theme.colors.error,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={[
          styles.checkbox, 
          task.completed && styles.checkboxChecked
        ]} 
        onPress={onToggle}
      >
        {task.completed && <Check size={16} color="white" />}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            task.completed && styles.titleCompleted
          ]}
        >
          {task.title}
        </Text>
        
        <View style={styles.metaContainer}>
          {task.dueDate && (
            <View style={styles.metaItem}>
              <Clock size={14} color={theme.colors.subtext} />
              <Text style={styles.metaText}>{formatDate(task.dueDate)}</Text>
            </View>
          )}
          
          {task.category && (
            <View style={styles.metaItem}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Flag size={16} color={priorityColors[task.priority]} />
        
        {onEdit && (
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Edit size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    ...theme.typography.body,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.subtext,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  metaText: {
    ...theme.typography.small,
    color: theme.colors.subtext,
    marginLeft: 4,
  },
  categoryText: {
    ...theme.typography.small,
    color: theme.colors.subtext,
    backgroundColor: theme.colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
});
