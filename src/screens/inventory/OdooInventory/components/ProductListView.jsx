import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { Badge } from '../../../../components/common/Badge';
import { useInventory } from '../../../../context/InventoryContext';

const FILTER_PILLS = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

export const ProductListView = ({ onSelectProduct, onCreateProduct }) => {
  const { products } = useInventory();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (activeFilter === 'In Stock') return p.stock > 0;
      if (activeFilter === 'Low Stock') return p.stock > 0 && p.stock <= p.minThreshold;
      if (activeFilter === 'Out of Stock') return p.stock <= 0;
      return true;
    });
  }, [products, search, activeFilter]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          activeOpacity={0.8}
          onPress={onCreateProduct}
        >
          <Icon name="plus" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View style={styles.pillsRow}>
        {FILTER_PILLS.map((pill) => {
          const isActive = activeFilter === pill;
          return (
            <TouchableOpacity
              key={pill}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => setActiveFilter(pill)}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {pill}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Products FlatList */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isLow = item.stock > 0 && item.stock <= item.minThreshold;
          const isOut = item.stock <= 0;

          return (
            <TouchableOpacity
              style={styles.productCard}
              activeOpacity={0.7}
              onPress={() => onSelectProduct(item)}
            >
              <View style={styles.itemIconBox}>
                <Icon name="box" size={20} color={colors.odooPurple} />
              </View>

              <View style={styles.itemInfoCol}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSku}>{item.sku}</Text>
                <Text style={styles.itemOnHand}>
                  On Hand: {item.stock.toFixed(2)}
                </Text>
              </View>

              <Badge
                label={isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                variant={isOut ? 'error' : isLow ? 'warning' : 'success'}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No products found matching filters.</Text>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.xs + 2,
    paddingVertical: 0,
  },
  clearText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  createBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.odooPurple,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.xs + 2,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.odooPurple,
    borderColor: colors.odooPurple,
  },
  pillText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  itemIconBox: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.md,
    backgroundColor: colors.odooPurpleTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemInfoCol: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  itemSku: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  itemOnHand: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  emptyBox: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

