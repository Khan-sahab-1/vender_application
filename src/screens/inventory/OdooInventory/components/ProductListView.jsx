import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { Badge } from '../../../../components/common/Badge';
import { useInventory } from '../../../../context/InventoryContext';

const FILTER_PILLS = ['All', 'Stockable', 'Consumable', 'Service', 'Low Stock'];

export const ProductListView = ({ onSelectProduct, onCreateProduct }) => {
  const { products, fetchProducts, isLoadingProducts } = useInventory();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (activeFilter === 'Stockable') return p.type === 'product';
      if (activeFilter === 'Consumable') return p.type === 'consu';
      if (activeFilter === 'Service') return p.type === 'service';
      if (activeFilter === 'Low Stock') return p.type === 'product' && p.stock > 0 && p.stock <= p.minThreshold;
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
            placeholder="Search products by SKU, name or category..."
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
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_PILLS}
          keyExtractor={(item) => item}
          renderItem={({ item: pill }) => {
            const isActive = activeFilter === pill;
            return (
              <TouchableOpacity
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setActiveFilter(pill)}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {pill}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Products FlatList */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(isLoadingProducts)}
            onRefresh={() => fetchProducts && fetchProducts()}
            colors={[colors.odooPurple]}
          />
        }
        renderItem={({ item }) => {
          const isService = item.type === 'service';
          const isConsumable = item.type === 'consu';
          const isLow = !isService && !isConsumable && item.stock > 0 && item.stock <= item.minThreshold;
          const isOut = !isService && !isConsumable && item.stock <= 0;

          const badgeLabel = isService
            ? 'Service'
            : isConsumable
            ? 'Consumable'
            : isOut
            ? 'Out of Stock'
            : isLow
            ? 'Low Stock'
            : 'In Stock';

          const badgeVariant = isService
            ? 'info'
            : isConsumable
            ? 'secondary'
            : isOut
            ? 'error'
            : isLow
            ? 'warning'
            : 'success';

          return (
            <TouchableOpacity
              style={styles.productCard}
              activeOpacity={0.7}
              onPress={() => onSelectProduct(item)}
            >
              <View style={[styles.itemIconBox, isService && styles.iconBoxService]}>
                <Icon
                  name={isService ? 'operations' : 'box'}
                  size={20}
                  color={isService ? '#2563EB' : colors.odooPurple}
                />
              </View>

              <View style={styles.itemInfoCol}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.skuTypeRow}>
                  <Text style={styles.itemSku}>{item.sku}</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.itemCategory}>{item.category || 'General'}</Text>
                </View>
                <View style={styles.stockPriceRow}>
                  {!isService ? (
                    <Text style={styles.itemOnHand}>
                      On Hand: <Text style={styles.stockBold}>{Number(item.stock).toFixed(1)} {item.uom}</Text>
                    </Text>
                  ) : (
                    <Text style={styles.itemOnHand}>Non-inventory item</Text>
                  )}
                  {item.sellPrice ? (
                    <Text style={styles.itemPrice}>₹{Number(item.sellPrice).toLocaleString()}</Text>
                  ) : null}
                </View>
              </View>

              <Badge
                label={badgeLabel}
                variant={badgeVariant}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No products found matching filters.</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={onCreateProduct}>
              <Text style={styles.emptyAddBtnText}>+ Add Product</Text>
            </TouchableOpacity>
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
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
  iconBoxService: {
    backgroundColor: '#DBEAFE',
  },
  itemInfoCol: {
    flex: 1,
    marginRight: spacing.xs,
  },
  itemName: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  skuTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  itemSku: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
  },
  dotSeparator: {
    fontSize: fontSize.xs - 1,
    color: colors.textMuted,
  },
  itemCategory: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
  },
  stockPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingRight: 6,
  },
  itemOnHand: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  stockBold: {
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  itemPrice: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
  emptyBox: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  emptyAddBtn: {
    backgroundColor: colors.odooPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
