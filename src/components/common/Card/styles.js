import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { borderRadius, spacing } from '../../../constants/spacing';
import { shadows } from '../../../constants/shadows';

export const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
  },
  elevated: {
    ...shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  flat: {
    backgroundColor: colors.surfaceSubtle,
  },

  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: spacing.sm,
  },
  padding_md: {
    padding: spacing.base,
  },
  padding_lg: {
    padding: spacing.xl,
  },
});

