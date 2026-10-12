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
import { Input } from '../../../../components/common/Input';
import { useInventory } from '../../../../context/InventoryContext';

export const DeliveryOrderView = ({ onComplete }) => {
  const { products, warehouses, processDeliverStock } = useInventory();

  const [customer, setCustomer] = useState('');
  const [warehouse, setWarehouse] = useState(warehouses[0]?.name || '');
  const [reference, setReference] = useState(`SO-${new Date().getFullYear()}-004`);
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  );

  const [deliveryItems, setDeliveryItems] = useState(
    products.slice(0, 2).map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      qty: 2,
      uom: p.uom,
    }))
  );

  const handleQtyChange = (sku, delta) => {
    setDeliveryItems((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleValidate = () => {
    if (deliveryItems.length === 0) {
      Alert.alert('No Items', 'No items to deliver. Please create products first.');
      return;
    }
    processDeliverStock({
      customer,
      warehouse,
      reference,
      items: deliveryItems,
    });

    Alert.alert(
      'Delivery Order Validated! (Odoo)',
      `Items successfully dispatched to ${customer}. Reference: ${reference}`,
      [{ text: 'OK', onPress: onComplete }]
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Header Fields Form */}
      <View style={styles.formCard}>
        <Input
          label="Customer"
          value={customer}
          onChangeText={setCustomer}
          placeholder="e.g. XYZ Traders"
        />

        <Input
          label="Dispatch Warehouse"
          value={warehouse}
          onChangeText={setWarehouse}
          placeholder="e.g. WH-01 or Select Warehouse"
        />

        <View style={styles.rowTwo}>
          <Input
            label="Reference No."
            value={reference}
            onChangeText={setReference}
            containerStyle={styles.halfInputWithMargin}
          />
          <Input
            label="Delivery Date"
            value={date}
            onChangeText={setDate}
            containerStyle={styles.halfInput}
          />
        </View>
      </View>

      {/* Products Delivery List */}
      <Text style={styles.sectionTitle}>Products to Dispatch</Text>
      <View style={styles.itemsCard}>
        {deliveryItems.length === 0 ? (
          <View style={{ paddingVertical: 18, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              No products found in this company to dispatch.
            </Text>
          </View>
        ) : (
          deliveryItems.map((item) => (
            <View key={item.sku} style={styles.itemRow}>
              <View style={styles.itemIcon}>
                <Icon name="box" size={18} color={colors.odooPurple} />
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSku}>{item.sku}</Text>
              </View>

              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => handleQtyChange(item.sku, -1)}
                >
                  <Icon name="minus" size={12} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => handleQtyChange(item.sku, 1)}
                >
                  <Icon name="plus" size={12} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.uomText}>{item.uom}</Text>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addMoreRow}
          onPress={() => Alert.alert('Add Product', 'Select additional SKU to dispatch')}
        >
          <Icon name="plus" size={14} color={colors.odooPurple} />
          <Text style={styles.addMoreText}>+ Add Product Line</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Validate Delivery"
        variant="primary"
        size="lg"
        onPress={handleValidate}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  rowTwo: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
  },
  halfInputWithMargin: {
    flex: 1,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.odooPurpleTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  itemSku: {
    fontSize: fontSize.xs - 1,
    color: colors.textMuted,
    marginTop: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  uomText: {
    fontSize: fontSize.xs - 2,
    color: colors.textSecondary,
    marginRight: 6,
    marginLeft: 2,
  },
  addMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    gap: 4,
  },
  addMoreText: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
});

