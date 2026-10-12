import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { Button } from '../../../../components/common/Button';
import { useInventory } from '../../../../context/InventoryContext';

export const InternalTransferView = ({ onComplete }) => {
  const { products, warehouses, processTransferStock } = useInventory();

  const [fromWarehouse, setFromWarehouse] = useState(
    warehouses[0]?.name || 'Main Warehouse'
  );
  const [toWarehouse, setToWarehouse] = useState(
    warehouses[1]?.name || 'Secondary Warehouse'
  );

  // Transfer items
  const [transferItems, setTransferItems] = useState([
    {
      id: products[0]?.id || '1',
      name: products[0]?.name || 'Laptop Pro 15',
      sku: products[0]?.sku || 'LP-001',
      qty: 2,
      uom: 'Pcs',
    },
    {
      id: products[1]?.id || '2',
      name: products[1]?.name || 'Wireless Mouse',
      sku: products[1]?.sku || 'WM-002',
      qty: 5,
      uom: 'Pcs',
    },
  ]);

  const handleQtyChange = (sku, delta) => {
    setTransferItems((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleSwapWarehouses = () => {
    const temp = fromWarehouse;
    setFromWarehouse(toWarehouse);
    setToWarehouse(temp);
  };

  const handleValidateTransfer = () => {
    if (fromWarehouse === toWarehouse) {
      Alert.alert(
        'Invalid Transfer',
        'Source and Destination warehouses cannot be the same.'
      );
      return;
    }

    processTransferStock({
      fromWarehouse,
      toWarehouse,
      items: transferItems,
    });

    Alert.alert(
      'Internal Transfer Validated!',
      `Successfully transferred ${transferItems.reduce((acc, i) => acc + i.qty, 0)} items from ${fromWarehouse} to ${toWarehouse}.`,
      [{ text: 'OK', onPress: onComplete }]
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Transfer Location Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Location Details</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>WH/INT/00021</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <View style={styles.locationBox}>
            <Text style={styles.locationLabel}>Source Location</Text>
            <View style={styles.warehouseSelector}>
              <Icon name="map-pin" size={14} color={colors.odooPurple} />
              <Text style={styles.warehouseText} numberOfLines={1}>
                {fromWarehouse}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.swapBtn}
            onPress={handleSwapWarehouses}
            activeOpacity={0.7}
          >
            <Icon name="transfer" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.locationBox}>
            <Text style={styles.locationLabel}>Destination Location</Text>
            <View style={styles.warehouseSelector}>
              <Icon name="map-pin" size={14} color={colors.success} />
              <Text style={styles.warehouseText} numberOfLines={1}>
                {toWarehouse}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.whPickerContainer}>
          <Text style={styles.pickerSectionTitle}>Quick Select Warehouses:</Text>
          <View style={styles.whChipWrap}>
            {warehouses.map((wh) => (
              <TouchableOpacity
                key={wh.id}
                style={[
                  styles.whChip,
                  fromWarehouse === wh.name && styles.whChipActiveFrom,
                  toWarehouse === wh.name && styles.whChipActiveTo,
                ]}
                onPress={() => {
                  if (fromWarehouse !== wh.name) {
                    setToWarehouse(wh.name);
                  } else {
                    setFromWarehouse(wh.name);
                  }
                }}
              >
                <Text
                  style={[
                    styles.whChipText,
                    (fromWarehouse === wh.name || toWarehouse === wh.name) &&
                      styles.whChipTextActive,
                  ]}
                >
                  {wh.code} - {wh.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Transfer Items Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Items to Move ({transferItems.length})</Text>
        </View>

        {transferItems.map((item, idx) => (
          <View
            key={item.sku}
            style={[
              styles.itemRow,
              idx === transferItems.length - 1 && styles.itemRowLast,
            ]}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku} • {item.uom}</Text>
            </View>

            {/* Stepper */}
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleQtyChange(item.sku, -1)}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.stepperValue}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleQtyChange(item.sku, 1)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Summary Note Card */}
      <View style={styles.noticeCard}>
        <Icon name="operations" size={18} color={colors.odooPurple} />
        <Text style={styles.noticeText}>
          Stock reservation will be checked automatically upon validation in Odoo 11.
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <Button
          title="Transfer Stock"
          variant="primary"
          onPress={handleValidateTransfer}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: spacing.xl * 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  locationBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationLabel: {
    fontSize: fontSize.xs - 2,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: fontWeight.medium,
  },
  warehouseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warehouseText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  swapBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.odooPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whPickerContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  pickerSectionTitle: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  whChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  whChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  whChipActiveFrom: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.odooPurple,
  },
  whChipActiveTo: {
    backgroundColor: '#DCFCE7',
    borderColor: colors.success,
  },
  whChipText: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  whChipTextActive: {
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  itemName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  itemSku: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  stepperValue: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#F3E8FF',
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  noticeText: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.odooPurple,
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: spacing.xs,
  },
});

