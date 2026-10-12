import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { Button } from '../../../../components/common/Button';

export const StockOnHandView = ({ product, onAdjustStock }) => {
  if (!product) return null;

  const breakdown = product.warehouseBreakdown || {
    'Main Warehouse': product.stock,
    'Secondary Warehouse': 0.0,
    'WH/Stock': 0.0,
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Product Summary Header Card */}
      <View style={styles.productBanner}>
        <View style={styles.bannerIcon}>
          <Icon name="box" size={24} color={colors.odooPurple} />
        </View>
        <View style={styles.bannerTextCol}>
          <Text style={styles.bannerTitle}>{product.name}</Text>
          <Text style={styles.bannerSku}>[{product.sku}]</Text>
        </View>
      </View>

      {/* 4 Quantitative Status Metrics */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>On Hand</Text>
          <Text style={styles.statValue}>
            {product.stock.toFixed(2)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Forecasted</Text>
          <Text style={styles.statValue}>
            {(product.forecasted ?? product.stock).toFixed(2)}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Allocated</Text>
          <Text style={styles.statValue}>
            {(product.allocated ?? 0).toFixed(2)}
          </Text>
        </View>

        <View style={[styles.statRow, styles.statRowLast]}>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={styles.statValueAccent}>
            {(product.available ?? product.stock).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Warehouses Breakdown Section */}
      <Text style={styles.sectionHeader}>Warehouses</Text>
      <View style={styles.warehousesCard}>
        {Object.entries(breakdown).map(([whName, qty]) => (
          <View key={whName} style={styles.whRow}>
            <View style={styles.whLeft}>
              <Icon name="building" size={16} color={colors.odooPurple} />
              <Text style={styles.whNameText}>{whName}</Text>
            </View>
            <Text style={styles.whQtyText}>{qty.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Action Button */}
      <Button
        title="Update Stock Count"
        variant="primary"
        size="lg"
        onPress={() => onAdjustStock && onAdjustStock(product)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  productBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.odooPurpleTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  bannerSku: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  statValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statValueAccent: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  sectionHeader: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  warehousesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  whRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  whLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  whNameText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  whQtyText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
});

