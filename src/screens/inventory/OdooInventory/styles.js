import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { borderRadius, spacing } from '../../../constants/spacing';
import { fontSize, fontWeight } from '../../../constants/typography';
import { shadows } from '../../../constants/shadows';

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Odoo Flagship Plum Header
  odooHeader: {
    backgroundColor: colors.odooPurple,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    flex: 1,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  headerSubtitleText: {
    fontSize: fontSize.xs - 1,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },

  // Odoo Sub Navigation Bar (Home | Products | Operations | More)
  subTabsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 6,
  },
  subTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  subTabLabel: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginTop: 2,
  },
  subTabLabelActive: {
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
  },
  subTabIndicator: {
    width: 20,
    height: 2.5,
    backgroundColor: colors.odooPurple,
    borderRadius: 1.5,
    marginTop: 3,
  },

  // Generic Content Container
  contentContainer: {
    flex: 1,
  },

  // Tenant Switcher Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.base,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.bold,
  },
  tenantList: {
    gap: spacing.sm,
  },
  tenantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tenantItemActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.odooPurple,
  },
  tenantItemLeft: {
    flex: 1,
  },
  tenantItemName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  tenantItemBranch: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tenantItemCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
    backgroundColor: '#E2E8F0',
  },
  tenantItemCodeText: {
    fontSize: fontSize.xs - 2,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
});

