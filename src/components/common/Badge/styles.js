import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { borderRadius, spacing } from '../../../constants/spacing';
import { fontSize, fontWeight } from '../../../constants/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xxs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 2,
  },

  // Variants
  primary: {
    backgroundColor: '#EEF2FF', // Indigo 50
  },
  success: {
    backgroundColor: '#ECFDF5', // Emerald 50
  },
  warning: {
    backgroundColor: '#FFFBEB', // Amber 50
  },
  error: {
    backgroundColor: '#FEF2F2', // Red 50
  },
  neutral: {
    backgroundColor: '#F1F5F9', // Slate 100
  },

  // Text
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  text_primary: {
    color: colors.primary,
  },
  text_success: {
    color: '#059669', // Emerald 600
  },
  text_warning: {
    color: '#D97706', // Amber 600
  },
  text_error: {
    color: '#DC2626', // Red 600
  },
  text_neutral: {
    color: colors.textSecondary,
  },

  // Dots
  dot_primary: {
    backgroundColor: colors.primary,
  },
  dot_success: {
    backgroundColor: '#10B981',
  },
  dot_warning: {
    backgroundColor: '#F59E0B',
  },
  dot_error: {
    backgroundColor: '#EF4444',
  },
  dot_neutral: {
    backgroundColor: colors.textSecondary,
  },
});

