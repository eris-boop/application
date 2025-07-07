import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TaskItem } from '@/components/TaskItem';
import { HabitItem } from '@/components/HabitItem';
import { AIButton } from '@/components/AIButton';
import { CustomModal } from '@/components/CustomModal';
import { AddTaskForm } from '@/components/AddTaskForm';
import { AddHabitForm } from '@/components/AddHabitForm';
import { useProductivityStore } from '@/store/productivity-store';
import { AIService } from '@/services/ai-service';
import { theme } from '@/constants/theme';
import { Plus, CheckSquare, Calendar, Trash2, Sparkles } from 'lucide-react-native';
import { Task, Habit } from '@/types';

export default function ProductivityScreen() {
  const { 
    tasks, 
    habits, 
    addTask, 
    updateTask,
    removeTask,
    toggleTaskCompletion, 
    addHabit,
    updateHabit,
    removeHabit,
    toggleHabitCompletion,
    clearCompletedTasks,
    getCompletedTasksCount,
  } = useProductivityStore();
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits'>('tasks');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const completedTasksCount = getCompletedTasksCount();
  
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    addTask(taskData);
    setShowAddTaskModal(false);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };
  
  const handleUpdateTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowAddTaskModal(false);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeTask(taskId) },
      ]
    );
  };
  
  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => {
    addHabit(habitData);
    setShowAddHabitModal(false);
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowAddHabitModal(true);
  };
  
  const handleUpdateHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
      setEditingHabit(null);
      setShowAddHabitModal(false);
    }
  };
  
  const handleDeleteHabit = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeHabit(habitId) },
      ]
    );
  };
  
  const isHabitCompletedToday = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.completedDates.includes(today) : false;
  };
  
  const handleGetAIProductivityTips = async () => {
    try {
      const currentHour = new Date().getHours();
      let timeOfDay = 'morning';
      if (currentHour >= 12 && currentHour < 17) timeOfDay = 'afternoon';
      else if (currentHour >= 17) timeOfDay = 'evening';
      
      const suggestion = await AIService.generateProductivityTips({
        currentTasks: tasks.filter(t => !t.completed).length,
        completedToday: completedTasksCount,
        timeOfDay,
      });
      setAiSuggestion(suggestion);
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI suggestion. Please try again.');
    }
  };
  
  const handleClearCompleted = () => {
    Alert.alert(
      'Clear Completed Tasks',
      'Are you sure you want to remove all completed tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCompletedTasks },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Productivity</Text>
        <View style={styles.headerButtons}>
          {completedTasksCount > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearCompleted}
            >
              <Trash2 size={18} color={theme.colors.error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              if (activeTab === 'tasks') {
                setEditingTask(null);
                setShowAddTaskModal(true);
              } else {
                setEditingHabit(null);
                setShowAddHabitModal(true);
              }
            }}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <AIButton
        title="Get AI Productivity Tips"
        subtitle="Personalized tips to boost your productivity"
        onPress={handleGetAIProductivityTips}
      />
      
      {aiSuggestion ? (
        <View style={styles.aiSuggestionContainer}>
          <View style={styles.aiSuggestionHeader}>
            <Sparkles size={20} color={theme.colors.purple} />
            <Text style={styles.aiSuggestionTitle}>AI Productivity Tips</Text>
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
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'tasks' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('tasks')}
        >
          <CheckSquare 
            size={20} 
            color={activeTab === 'tasks' ? theme.colors.primary : theme.colors.subtext} 
          />
          <Text 
            style={[
              styles.tabButtonText,
              activeTab === 'tasks' && styles.activeTabButtonText,
            ]}
          >
            Tasks ({tasks.filter(t => !t.completed).length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'habits' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('habits')}
        >
          <Calendar 
            size={20} 
            color={activeTab === 'habits' ? theme.colors.secondary : theme.colors.subtext} 
          />
          <Text 
            style={[
              styles.tabButtonText,
              activeTab === 'habits' && styles.activeTabButtonText,
              activeTab === 'habits' && { color: theme.colors.secondary },
            ]}
          >
            Habits ({habits.filter(h => isHabitCompletedToday(h.id)).length}/{habits.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'tasks' && (
        <View style={styles.tasksContainer}>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckSquare size={48} color={theme.colors.border} />
              <Text style={styles.emptyStateTitle}>No tasks yet</Text>
              <Text style={styles.emptyStateText}>
                Add your first task to get started with productivity tracking
              </Text>
            </View>
          ) : (
            <>
              {/* Pending Tasks */}
              {tasks.filter(t => !t.completed).length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>Pending Tasks</Text>
                  {tasks
                    .filter(task => !task.completed)
                    .map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTaskCompletion(task.id)}
                        onEdit={() => handleEditTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                </>
              )}
              
              {/* Completed Tasks */}
              {tasks.filter(t => t.completed).length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>
                    Completed Tasks ({completedTasksCount})
                  </Text>
                  {tasks
                    .filter(task => task.completed)
                    .map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTaskCompletion(task.id)}
                        onEdit={() => handleEditTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </View>
      )}
      
      {activeTab === 'habits' && (
        <View style={styles.habitsContainer}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={48} color={theme.colors.border} />
              <Text style={styles.emptyStateTitle}>No habits yet</Text>
              <Text style={styles.emptyStateText}>
                Start building positive habits to improve your daily routine
              </Text>
            </View>
          ) : (
            habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={() => toggleHabitCompletion(habit.id)}
                onEdit={() => handleEditHabit(habit)}
                onDelete={() => handleDeleteHabit(habit.id)}
                isCompletedToday={isHabitCompletedToday(habit.id)}
              />
            ))
          )}
        </View>
      )}
      
      <CustomModal
        visible={showAddTaskModal}
        onClose={() => {
          setShowAddTaskModal(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <AddTaskForm
          task={editingTask}
          onAddTask={editingTask ? handleUpdateTask : handleAddTask}
          onClose={() => {
            setShowAddTaskModal(false);
            setEditingTask(null);
          }}
        />
      </CustomModal>
      
      <CustomModal
        visible={showAddHabitModal}
        onClose={() => {
          setShowAddHabitModal(false);
          setEditingHabit(null);
        }}
        title={editingHabit ? 'Edit Habit' : 'Add New Habit'}
      >
        <AddHabitForm
          habit={editingHabit}
          onAddHabit={editingHabit ? handleUpdateHabit : handleAddHabit}
          onClose={() => {
            setShowAddHabitModal(false);
            setEditingHabit(null);
          }}
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
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  activeTabButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  tabButtonText: {
    ...theme.typography.body,
    marginLeft: theme.spacing.xs,
    color: theme.colors.subtext,
    fontSize: 14,
  },
  activeTabButtonText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  tasksContainer: {
    marginBottom: theme.spacing.lg,
  },
  habitsContainer: {
    marginBottom: theme.spacing.lg,
  },
  subsectionTitle: {
    ...theme.typography.h3,
    fontSize: 18,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateTitle: {
    ...theme.typography.h3,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
});