import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { useInventory } from '../../../../context/InventoryContext';

export const DashboardView = ({ onNavigate }) => {
  const {
    products,
    incomingCount,
    outgoingCount,
    uomCategories,
    uomList,
    productCategories,
    warehouses,
    inventorySummary,
  } = useInventory();

  const totalOnHand = Math.round(
    products.reduce((acc, curr) => acc + curr.stock, 0)
  );

  const displayTotalProducts =
    inventorySummary?.total_products !== undefined && inventorySummary?.total_products !== 0
      ? inventorySummary.total_products
      : products.length;

  const displayTotalStockUnits =
    inventorySummary?.total_stock_units !== undefined && inventorySummary?.total_stock_units !== 0
      ? inventorySummary.total_stock_units
      : totalOnHand;

  const displayValuation = (inventorySummary?.inventory_valuation || 0).toLocaleString();
  const lowStockCount = inventorySummary?.low_stock_count || 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Section 1: Stock Overview */}
      <Text style={styles.sectionHeader}>Stock Overview</Text>
      <View style={styles.overviewGrid}>
        {/* Total Products */}
        <TouchableOpacity
          style={styles.overviewCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('products')}
        >
          <View style={[styles.overviewIconBox, styles.iconBoxBlue]}>
            <Icon name="box" size={20} color="#2563EB" />
          </View>
          <Text style={styles.overviewCount}>{displayTotalProducts}</Text>
          <Text style={styles.overviewLabel}>Total Products</Text>
        </TouchableOpacity>

        {/* Total Stock Units */}
        <TouchableOpacity
          style={styles.overviewCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('products')}
        >
          <View style={[styles.overviewIconBox, styles.iconBoxGreen]}>
            <Icon name="check" size={18} color="#16A34A" />
          </View>
          <Text style={[styles.overviewCount, styles.countGreen]}>
            {displayTotalStockUnits.toLocaleString()}
          </Text>
          <Text style={styles.overviewLabel}>Stock Units</Text>
        </TouchableOpacity>

        {/* Inventory Valuation */}
        <View style={styles.overviewCard}>
          <View style={[styles.overviewIconBox, styles.iconBoxPurple]}>
            <Icon name="scale" size={18} color="#7E22CE" />
          </View>
          <Text style={[styles.overviewCount, styles.countPurple]} numberOfLines={1}>
            ₹{displayValuation}
          </Text>
          <Text style={styles.overviewLabel}>Valuation</Text>
        </View>

        {/* Low Stock Alerts */}
        <TouchableOpacity
          style={styles.overviewCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('products')}
        >
          <View style={[styles.overviewIconBox, styles.iconBoxRed]}>
            <Icon name="operations" size={18} color="#DC2626" />
          </View>
          <Text style={[styles.overviewCount, styles.countRed]}>
            {lowStockCount}
          </Text>
          <Text style={styles.overviewLabel}>Low Stock Items</Text>
        </TouchableOpacity>

        {/* Incoming (Receipts) */}
        <TouchableOpacity
          style={styles.overviewCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('receive')}
        >
          <View style={[styles.overviewIconBox, styles.iconBoxYellow]}>
            <Icon name="receive" size={18} color="#D97706" />
          </View>
          <Text style={[styles.overviewCount, styles.countYellow]}>
            {incomingCount}
          </Text>
          <Text style={styles.overviewLabel}>Incoming (Receipts)</Text>
        </TouchableOpacity>

        {/* Outgoing (Deliveries) */}
        <TouchableOpacity
          style={styles.overviewCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('deliver')}
        >
          <View style={[styles.overviewIconBox, styles.iconBoxSky]}>
            <Icon name="deliver" size={18} color="#0284C7" />
          </View>
          <Text style={[styles.overviewCount, styles.countSky]}>
            {outgoingCount}
          </Text>
          <Text style={styles.overviewLabel}>Outgoing (Deliveries)</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Warehouse Operations */}
      <Text style={styles.sectionHeader}>Warehouse Operations</Text>
      <View style={styles.actionsList}>
        {/* Receive Stock */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('receive')}
        >
          <View style={[styles.actionIconCircle, styles.circleSky]}>
            <Icon name="receive" size={18} color="#0284C7" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Receive Stock</Text>
            <Text style={styles.actionSubtitle}>From vendor (PO Receipt)</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Deliver Stock */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('deliver')}
        >
          <View style={[styles.actionIconCircle, styles.circleGreen]}>
            <Icon name="deliver" size={18} color="#16A34A" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Deliver Stock</Text>
            <Text style={styles.actionSubtitle}>To customer (Delivery Order)</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Internal Transfer */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('transfer')}
        >
          <View style={[styles.actionIconCircle, styles.circlePurple]}>
            <Icon name="transfer" size={18} color="#7E22CE" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Internal Transfer</Text>
            <Text style={styles.actionSubtitle}>Between warehouses</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Stock Movements */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('movements')}
        >
          <View style={[styles.actionIconCircle, styles.circleIndigo]}>
            <Icon name="operations" size={18} color={colors.primary} />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Stock Movements</Text>
            <Text style={styles.actionSubtitle}>Audit trail of all receipts & deliveries</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Barcode Scanner */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('scan')}
        >
          <View style={[styles.actionIconCircle, styles.circleSlate]}>
            <Icon name="barcode" size={18} color={colors.textPrimary} />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Barcode Scan</Text>
            <Text style={styles.actionSubtitle}>Instant SKU & barcode camera lookup</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Section 3: Master Data Management (Individual Action Tabs) */}
      <Text style={styles.sectionHeader}>Master Data Management</Text>
      <View style={styles.actionsList}>
        {/* UoM Categories */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('uom_cat')}
        >
          <View style={[styles.actionIconCircle, styles.circleYellow]}>
            <Icon name="scale" size={18} color="#D97706" />
          </View>
          <View style={styles.actionTextCol}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.actionTitle}>UoM Categories</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{uomCategories.length} Categories</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>Unit of measure groups (Weight, Length, Volume...)</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Units of Measure (UoM) */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('uom')}
        >
          <View style={[styles.actionIconCircle, styles.circlePurple]}>
            <Icon name="layers" size={18} color="#7E22CE" />
          </View>
          <View style={styles.actionTextCol}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.actionTitle}>Units of Measure (UoM)</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{uomList.length} Units</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>Kilogram, Gram, Pieces, Liters with ratios</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Product Categories */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('prod_cat')}
        >
          <View style={[styles.actionIconCircle, styles.circlePink]}>
            <Icon name="operations" size={18} color="#BE185D" />
          </View>
          <View style={styles.actionTextCol}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.actionTitle}>Product Categories</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{productCategories.length} Categories</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>Hardware, Electronics, Fittings categorization</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Warehouses */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('warehouses')}
        >
          <View style={[styles.actionIconCircle, styles.circleGreen]}>
            <Icon name="map-pin" size={18} color="#16A34A" />
          </View>
          <View style={styles.actionTextCol}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.actionTitle}>Warehouses</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{inventorySummary?.total_warehouses || warehouses.length} Warehouses</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>Main warehouse, storage hubs & stock locations</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Products */}
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => onNavigate('products')}
        >
          <View style={[styles.actionIconCircle, styles.circleSky]}>
            <Icon name="box" size={18} color="#0284C7" />
          </View>
          <View style={styles.actionTextCol}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.actionTitle}>Products Catalog</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{displayTotalProducts} Products</Text>
              </View>
            </View>
            <Text style={styles.actionSubtitle}>Storable products, SKU, barcodes & stock levels</Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionSubheader: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: -2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  overviewCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  overviewIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs + 2,
  },
  iconBoxBlue: {
    backgroundColor: '#DBEAFE',
  },
  iconBoxGreen: {
    backgroundColor: '#DCFCE7',
  },
  iconBoxYellow: {
    backgroundColor: '#FEF3C7',
  },
  iconBoxSky: {
    backgroundColor: '#E0F2FE',
  },
  iconBoxPurple: {
    backgroundColor: '#F3E8FF',
  },
  iconBoxRed: {
    backgroundColor: '#FEE2E2',
  },
  countGreen: {
    color: '#15803D',
  },
  countYellow: {
    color: '#B45309',
  },
  countSky: {
    color: '#0369A1',
  },
  countPurple: {
    color: '#7E22CE',
  },
  countRed: {
    color: '#DC2626',
  },
  overviewCount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: colors.textPrimary,
  },
  overviewLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  actionsList: {
    gap: spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  circleSky: {
    backgroundColor: '#E0F2FE',
  },
  circleGreen: {
    backgroundColor: '#DCFCE7',
  },
  circlePurple: {
    backgroundColor: '#F3E8FF',
  },
  circleYellow: {
    backgroundColor: '#FEF3C7',
  },
  circleIndigo: {
    backgroundColor: '#EEF2FF',
  },
  circleSlate: {
    backgroundColor: '#F1F5F9',
  },
  circlePink: {
    backgroundColor: '#FCE7F3',
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.xs,
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countBadgeText: {
    fontSize: fontSize.xs - 2,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  actionSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

