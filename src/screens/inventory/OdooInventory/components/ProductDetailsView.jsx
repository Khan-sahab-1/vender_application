import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { Badge } from '../../../../components/common/Badge';
import { Button } from '../../../../components/common/Button';
import { useInventory } from '../../../../context/InventoryContext';

const TABS = ['Overview', 'Stock', 'Variants'];

export const ProductDetailsView = ({
  product,
  onBack,
  onViewStockOnHand,
  onEditStock,
}) => {
  const {
    attributes,
    fetchProductVariants,
    generateVariants,
  } = useInventory();

  const [activeTab, setActiveTab] = useState('Overview');
  const [variants, setVariants] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState([]);

  useEffect(() => {
    if (product?.id && activeTab === 'Variants') {
      loadVariants();
    }
  }, [product?.id, activeTab]);

  const loadVariants = async () => {
    setIsLoadingVariants(true);
    try {
      const res = await fetchProductVariants(product.id);
      if (Array.isArray(res)) {
        setVariants(res);
      }
    } catch (_err) {
      // ignore
    } finally {
      setIsLoadingVariants(false);
    }
  };

  const toggleAttributeSelect = (attrId) => {
    setSelectedAttributeIds((prev) =>
      prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId]
    );
  };

  const handleRunGenerateVariants = async () => {
    if (selectedAttributeIds.length === 0) {
      Alert.alert('Select Attributes', 'Please select at least 1 attribute to generate variant combinations.');
      return;
    }
    setIsLoadingVariants(true);
    try {
      const result = await generateVariants(product.id, selectedAttributeIds);
      setVariants(result || []);
      setGenerateModalVisible(false);
      setSelectedAttributeIds([]);
      Alert.alert('Variants Generated!', `Successfully generated ${result?.length || 0} variant combinations.`);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to generate variants.');
    } finally {
      setIsLoadingVariants(false);
    }
  };

  if (!product) return null;

  const isService = product.type === 'service';
  const isConsumable = product.type === 'consu';
  const isStockable = product.type === 'product';

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Product Hero Card */}
      <View style={styles.heroCard}>
        <View style={[styles.heroIconBox, isService && styles.iconBoxService]}>
          <Icon name={isService ? 'operations' : 'box'} size={36} color={isService ? '#2563EB' : colors.odooPurple} />
        </View>

        <View style={styles.heroTitleRow}>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productCode}>[{product.sku}]</Text>
        </View>

        <Badge
          label={isService ? 'Service' : isConsumable ? 'Consumable' : product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          variant={isService ? 'info' : isConsumable ? 'secondary' : product.stock > 0 ? 'success' : 'error'}
          showDot={isStockable}
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
            <View style={styles.typeBadgeContainer}>
              <Text style={styles.fieldValue}>{product.productType || 'Stockable Product'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Internal Reference (SKU)</Text>
            <Text style={styles.fieldValueAccent}>{product.sku}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Category</Text>
            <Text style={styles.fieldValue}>{product.category}</Text>
          </View>

          {/* Unit of Measure */}
          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Default Unit of Measure</Text>
            <Text style={styles.fieldValue}>{product.uom || 'Units(s)'}</Text>
          </View>

          {/* Purchase Unit of Measure */}
          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Purchase Unit of Measure (PO)</Text>
            <Text style={styles.fieldValueHighlight}>
              {product.purchaseUom || product.uom || 'Units(s)'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Sales Price</Text>
            <Text style={styles.fieldValue}>₹{Number(product.sellPrice || 0).toLocaleString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Cost Price</Text>
            <Text style={styles.fieldValue}>₹{Number(product.costPrice || 0).toLocaleString()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>Barcode</Text>
            <Text style={styles.fieldValue}>{product.barcode || 'N/A'}</Text>
          </View>

          {product.description ? (
            <View style={styles.descBox}>
              <Text style={styles.fieldLabel}>Description</Text>
              <Text style={styles.descText}>{product.description}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Tab Content: Stock */}
      {activeTab === 'Stock' && (
        <View style={styles.infoCard}>
          {!isService ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.fieldLabel}>Quantity On Hand</Text>
                <Text style={styles.fieldValueAccent}>
                  {Number(product.stock || 0).toFixed(2)} {product.uom}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.fieldLabel}>Safety Stock Threshold</Text>
                <Text style={styles.fieldValue}>{product.minThreshold} {product.uom}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.fieldLabel}>Inventory Valuation</Text>
                <Text style={styles.fieldValue}>
                  ₹{(Number(product.stock || 0) * Number(product.costPrice || 0)).toLocaleString()}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyTabBox}>
              <Text style={styles.emptyTabText}>
                This is a Service product. Stock movements and on-hand balances are not tracked.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Tab Content: Variants (Odoo Matrix) */}
      {activeTab === 'Variants' && (
        <View style={styles.variantsSection}>
          <View style={styles.variantActionHeader}>
            <View>
              <Text style={styles.variantSectionTitle}>Product Variants ({variants.length})</Text>
              <Text style={styles.variantSectionSub}>
                Odoo 11 attribute matrix combinations
              </Text>
            </View>
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={() => setGenerateModalVisible(true)}
            >
              <Text style={styles.generateBtnText}>+ Generate</Text>
            </TouchableOpacity>
          </View>

          {isLoadingVariants ? (
            <ActivityIndicator size="small" color={colors.odooPurple} style={{ marginVertical: 20 }} />
          ) : variants.length > 0 ? (
            variants.map((v, idx) => (
              <View key={v.id || idx} style={styles.variantCard}>
                <View style={styles.variantCardHeader}>
                  <Text style={styles.variantName}>{v.name || product.name}</Text>
                  <Text style={styles.variantSku}>{v.sku}</Text>
                </View>

                {/* Attribute values pills */}
                <View style={styles.variantValuesRow}>
                  {(v.attribute_values || []).map((val) => (
                    <View key={val.id} style={styles.attrPill}>
                      <Text style={styles.attrPillText}>{val.name}</Text>
                    </View>
                  ))}
                  {Number(v.price_extra || 0) > 0 ? (
                    <View style={styles.surchargePill}>
                      <Text style={styles.surchargePillText}>+₹{v.price_extra}</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.variantFooter}>
                  <Text style={styles.variantStock}>
                    Sale Price: ₹{(Number(product.sellPrice || 0) + Number(v.price_extra || 0)).toLocaleString()}
                  </Text>
                  <Text style={styles.variantStockMuted}>
                    Stock: {Number(v.stock_on_hand || 0).toFixed(1)} {product.uom}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyVariantsBox}>
              <Icon name="layers" size={28} color={colors.textMuted} />
              <Text style={styles.emptyVariantsTitle}>No Variants Generated</Text>
              <Text style={styles.emptyVariantsSub}>
                Tap "+ Generate" to create variant combinations using attributes like Thickness, Color, etc.
              </Text>
              <TouchableOpacity
                style={styles.emptyGenerateBtn}
                onPress={() => setGenerateModalVisible(true)}
              >
                <Text style={styles.emptyGenerateBtnText}>Generate Variants Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Bottom Action Buttons */}
      <View style={styles.bottomButtons}>
        {!isService && (
          <Button
            title="Stock On Hand Breakdown >"
            variant="primary"
            size="lg"
            onPress={() => onViewStockOnHand(product)}
          />
        )}

        <View style={styles.buttonRow}>
          <Button
            title="← Back to Catalog"
            variant="secondary"
            size="md"
            style={styles.halfBtnWithMargin}
            onPress={onBack}
          />
          {!isService && (
            <Button
              title="Adjust Stock"
              variant="outline"
              size="md"
              style={styles.halfBtn}
              onPress={() => onEditStock(product)}
            />
          )}
        </View>
      </View>

      {/* Generate Variants Matrix Modal */}
      <Modal visible={generateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Odoo Variant Generator</Text>
              <TouchableOpacity onPress={() => setGenerateModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select the attributes you want to combine to create variants for "{product.name}":
            </Text>

            <View style={styles.attrSelectionList}>
              {attributes.map((attr) => {
                const isSelected = selectedAttributeIds.includes(attr.id);
                return (
                  <TouchableOpacity
                    key={attr.id}
                    style={[styles.attrSelectionCard, isSelected && styles.attrSelectionCardActive]}
                    onPress={() => toggleAttributeSelect(attr.id)}
                  >
                    <View style={styles.attrSelectionLeft}>
                      <Text style={[styles.attrSelectionName, isSelected && styles.attrSelectionNameActive]}>
                        {attr.name}
                      </Text>
                      <Text style={styles.attrSelectionValues}>
                        Values: {(attr.values || []).map((v) => v.name).join(', ') || 'No values'}
                      </Text>
                    </View>
                    <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleActive]}>
                      {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Generate Variant Combinations"
              variant="primary"
              loading={isLoadingVariants}
              onPress={handleRunGenerateVariants}
            />
          </View>
        </View>
      </Modal>
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
  iconBoxService: {
    backgroundColor: '#DBEAFE',
  },
  heroTitleRow: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  productTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
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
    color: colors.odooPurple,
  },
  fieldValueHighlight: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.bold,
    color: '#16A34A',
  },
  typeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyTabBox: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyTabText: {
    fontSize: fontSize.xs + 1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Variants styling
  variantsSection: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  variantActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  variantSectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  variantSectionSub: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
  },
  generateBtn: {
    backgroundColor: colors.odooPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  variantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    ...shadows.sm,
  },
  variantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variantName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  variantSku: {
    fontSize: fontSize.xs,
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
  },
  variantValuesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attrPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
  },
  attrPillText: {
    fontSize: fontSize.xs - 1,
    color: colors.textPrimary,
  },
  surchargePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
  },
  surchargePillText: {
    fontSize: fontSize.xs - 1,
    color: '#16A34A',
    fontWeight: fontWeight.bold,
  },
  variantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 4,
  },
  variantStock: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  variantStockMuted: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
  },
  emptyVariantsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyVariantsTitle: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  emptyVariantsSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyGenerateBtn: {
    backgroundColor: colors.odooPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    marginTop: 6,
  },
  emptyGenerateBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
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
  // Modal styling
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
    maxHeight: '80%',
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
  modalSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  modalCloseText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    padding: 4,
  },
  attrSelectionList: {
    gap: spacing.sm,
  },
  attrSelectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  attrSelectionCardActive: {
    borderColor: colors.odooPurple,
    backgroundColor: colors.odooPurpleTint,
  },
  attrSelectionLeft: {
    flex: 1,
  },
  attrSelectionName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  attrSelectionNameActive: {
    color: colors.odooPurple,
  },
  attrSelectionValues: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleActive: {
    borderColor: colors.odooPurple,
    backgroundColor: colors.odooPurple,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
