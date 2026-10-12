import React, { useState } from 'react';
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
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';

const TABS = ['Overview', 'Stock', 'Variants', 'More'];

export const ProductDetailsView = ({
  product,
  onBack,
  onViewStockOnHand,
  onEditStock,
}) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!product) return null;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Product Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroIconBox}>
          <Icon name="box" size={36} color={colors.odooPurple} />
        </View>

        <View style={styles.heroTitleRow}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productCode}>[{product.sku}]</Text>
        </View>

        <Badge
          label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          variant={product.stock > 0 ? 'success' : 'error'}
          showDot
        />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content: Overview */}
      {activeTab === 'Overview' && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Product Type</Text>
            <Text style={styles.fieldValue}>{product.productType || 'Storable Product'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Category</Text>
            <Text style={styles.fieldValue}>{product.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Unit of Measure</Text>
            <Text style={styles.fieldValue}>{product.uom || 'Units(s)'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Barcode</Text>
            <Text style={styles.fieldValue}>{product.barcode || '123456789012'}</Text>
          </View>

          <View style={styles.descBox}>
            <Text style={styles.fieldLabel}>Description</Text>
            <Text style={styles.descText}>
              {product.description || 'Enterprise catalog storable item.'}
            </Text>
          </View>
        </View>
      )}

      {/* Tab Content: Stock */}
      {activeTab === 'Stock' && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Quantity On Hand</Text>
            <Text style={styles.fieldValueAccent}>
              {product.stock.toFixed(2)} {product.uom}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Primary Warehouse</Text>
            <Text style={styles.fieldValue}>{product.warehouse}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Shelf / Location</Text>
            <Text style={styles.fieldValue}>{product.shelfLocation || 'WH/Stock'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Reorder Threshold</Text>
            <Text style={styles.fieldValue}>{product.minThreshold} {product.uom}</Text>
          </View>
        </View>
      )}

      {/* Bottom Action Buttons */}
      <View style={styles.bottomButtons}>
        <Button
          title="Stock On Hand Breakdown >"
          variant="primary"
          size="lg"
          onPress={() => onViewStockOnHand(product)}
        />

        <View style={styles.buttonRow}>
          <Button
            title="Edit Product"
            variant="secondary"
            size="md"
            style={styles.halfBtnWithMargin}
            onPress={onBack}
          />
          <Button
            title="Adjust Stock"
            variant="outline"
            size="md"
            style={styles.halfBtn}
            onPress={() => onEditStock(product)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  heroIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.odooPurpleTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitleRow: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  productTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  productCode: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 3,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabBtnActive: {
    backgroundColor: colors.odooPurple,
  },
  tabText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fieldLabel: {
    fontSize: fontSize.xs + 1,
    color: colors.textSecondary,
  },
  fieldValue: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  fieldValueAccent: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  descBox: {
    paddingTop: spacing.md,
  },
  descText: {
    fontSize: fontSize.xs + 1,
    color: colors.textPrimary,
    lineHeight: 18,
    marginTop: 4,
  },
  bottomButtons: {
    gap: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  halfBtn: {
    flex: 1,
  },
  halfBtnWithMargin: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
