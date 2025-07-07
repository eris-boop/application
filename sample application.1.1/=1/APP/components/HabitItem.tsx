import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Edit, Trash2 } from 'lucide-react-native';
import { Habit } from '@/types';
import { theme } from '@/constants/theme';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isCompletedToday: boolean;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onToggle,
  onEdit,
  onDelete,
  isCompletedToday,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={[
          styles.checkbox, 
          isCompletedToday && styles.checkboxChecked
        ]} 
        onPress={onToggle}
      >
        {isCompletedToday && <Check size={16} color="white" />}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.name}>{habit.name}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.frequencyBadge}>
            <Text style={styles.frequencyText}>
              {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
            </Text>
          </View>
          
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>
              {habit.streak} day streak
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        {onEdit && (
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Edit size={16} color={theme.colors.secondary} />
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
    borderColor: theme.colors.secondary,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.secondary,
  },
  content: {
    flex: 1,
  },
  name: {
    ...theme.typography.body,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyBadge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  frequencyText: {
    ...theme.typography.small,
    color: theme.colors.subtext,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    ...theme.typography.small,
    color: theme.colors.subtext,
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