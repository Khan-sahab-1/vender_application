import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { useInventory } from '../../../../context/InventoryContext';

const FILTER_TABS = ['All', 'Receipts', 'Deliveries', 'Transfers'];

export const StockMovementsView = () => {
  const { movements } = useInventory();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredMovements = movements.filter((mov) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Receipts') return mov.type === 'Receipt';
    if (selectedFilter === 'Deliveries') return mov.type === 'Delivery';
    if (selectedFilter === 'Transfers') return mov.type === 'Transfer';
    return true;
  });

  const renderMovementItem = ({ item }) => {
    const isPositive = item.positive || item.qty > 0;
    const formattedQty = isPositive ? `+${Math.abs(item.qty)}` : `-${Math.abs(item.qty)}`;

    return (
      <View style={styles.movementCard}>
        <View style={styles.iconCol}>
          <View
            style={[
              styles.iconCircle,
              item.type === 'Receipt' && styles.iconCircleReceipt,
              item.type === 'Delivery' && styles.iconCircleDelivery,
              item.type === 'Transfer' && styles.iconCircleTransfer,
            ]}
          >
            <Icon
              name={
                item.type === 'Receipt'
                  ? 'receive'
                  : item.type === 'Delivery'
                  ? 'deliver'
                  : 'transfer'
              }
              size={18}
              color={
                item.type === 'Receipt'
                  ? '#16A34A'
                  : item.type === 'Delivery'
                  ? '#2563EB'
                  : colors.odooPurple
              }
            />
          </View>
        </View>

        <View style={styles.detailsCol}>
          <View style={styles.topRow}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.product}
            </Text>
            <View
              style={[
                styles.qtyBadge,
                isPositive ? styles.qtyBadgePositive : styles.qtyBadgeNegative,
              ]}
            >
              <Text
                style={[
                  styles.qtyBadgeText,
                  isPositive ? styles.qtyBadgeTextPositive : styles.qtyBadgeTextNegative,
                ]}
              >
                {formattedQty}
              </Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.refText} numberOfLines={1}>
              {item.reference}
            </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Movements Count */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          Showing {filteredMovements.length} Movements
        </Text>
      </View>

      {/* Movements List */}
      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={renderMovementItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="operations" size={40} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Stock Movements</Text>
            <Text style={styles.emptySub}>
              No {selectedFilter.toLowerCase()} operations recorded yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filtersWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  filtersScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: borderRadius.round,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: colors.odooPurple,
    borderColor: colors.odooPurple,
  },
  filterChipText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  countBar: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
  },
  countText: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl * 2,
    gap: spacing.sm,
  },
  movementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  iconCol: {
    marginRight: spacing.sm + 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleReceipt: {
    backgroundColor: '#DCFCE7',
  },
  iconCircleDelivery: {
    backgroundColor: '#DBEAFE',
  },
  iconCircleTransfer: {
    backgroundColor: '#F3E8FF',
  },
  detailsCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  qtyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  qtyBadgePositive: {
    backgroundColor: '#DCFCE7',
  },
  qtyBadgeNegative: {
    backgroundColor: '#FEE2E2',
  },
  qtyBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  qtyBadgeTextPositive: {
    color: '#16A34A',
  },
  qtyBadgeTextNegative: {
    color: '#DC2626',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refText: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.xs,
  },
  dateText: {
    fontSize: fontSize.xs - 2,
    color: colors.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptySub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});

