import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Exercise } from '@/types';
import { theme } from '@/constants/theme';
import { Clock, Flame } from 'lucide-react-native';

interface ExerciseItemProps {
  exercise: Exercise;
  onPress?: () => void;
  duration?: number;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onPress,
  duration,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {exercise.imageUrl ? (
          <Image 
            source={{ uri: exercise.imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{exercise.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Flame size={16} color={theme.colors.primary} />
            <Text style={styles.statText}>
              {exercise.caloriesBurnedPerMinute} cal/min
            </Text>
          </View>
          
          {duration && (
            <View style={styles.statItem}>
              <Clock size={16} color={theme.colors.primary} />
              <Text style={styles.statText}>{duration} min</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imagePlaceholder: {
    backgroundColor: theme.colors.border,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: theme.spacing.md,
  },
  name: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    ...theme.typography.caption,
    color: theme.colors.subtext,
    marginLeft: theme.spacing.xs,
  },
});
