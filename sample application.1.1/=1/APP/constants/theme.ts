import { StyleSheet } from 'react-native';
import Colors from './colors';

export const theme = {
  colors: Colors.light,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: StyleSheet.create({
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.light.text,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.light.text,
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.light.text,
    },
    body: {
      fontSize: 16,
      color: Colors.light.text,
    },
    caption: {
      fontSize: 14,
      color: Colors.light.subtext,
    },
    small: {
      fontSize: 12,
      color: Colors.light.subtext,
    },
  }),
};