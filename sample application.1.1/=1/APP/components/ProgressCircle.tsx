import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface ProgressCircleProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = theme.colors.primary,
  backgroundColor = theme.colors.border,
  children,
}) => {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - normalizedProgress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.backgroundCircle}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor,
            },
          ]}
        />
      </View>
      
      <View style={styles.progressCircle}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: 'transparent',
              borderRightColor: normalizedProgress < 0.25 ? 'transparent' : color,
              borderBottomColor: normalizedProgress < 0.5 ? 'transparent' : color,
              borderLeftColor: normalizedProgress < 0.75 ? 'transparent' : color,
              transform: [{ rotateZ: `${normalizedProgress * 360}deg` }],
            },
          ]}
        />
      </View>
      
      <View style={styles.content}>
        {children || (
          <Text style={styles.progressText}>
            {Math.round(normalizedProgress * 100)}%
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circle: {
    borderStyle: 'solid',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
});