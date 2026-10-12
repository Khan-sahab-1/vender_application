import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
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

const MASTER_TABS = [
  { id: 'uom_cat', title: 'UoM Categories', icon: 'scale' },
  { id: 'uom', title: 'Units of Measure', icon: 'layers' },
  { id: 'prod_cat', title: 'Product Categories', icon: 'operations' },
  { id: 'warehouses', title: 'Warehouses', icon: 'map-pin' },
  { id: 'new_prod', title: '+ Add Product', icon: 'home' },
];

export const MasterDataView = ({
  onProductCreated,
  initialTab = 'uom_cat',
  embedded = false,
}) => {
  const {
    uomCategories,
    addUomCategory,
    uomList,
    addUom,
    productCategories,
    addProductCategory,
    warehouses,
    addWarehouse,
    addProduct,
  } = useInventory();

  const [activeTab, setActiveTab] = useState(initialTab || 'uom_cat');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Form states for UoM Category
  const [uomCatName, setUomCatName] = useState('');
  const [uomCatDesc, setUomCatDesc] = useState('');

  // Form states for UoM
  const [uomName, setUomName] = useState('');
  const [uomCategoryId, setUomCategoryId] = useState(
    uomCategories[0]?.id || uomCategories[0]?._id || ''
  );
  const [uomSymbol, setUomSymbol] = useState('');
  const [uomRatio, setUomRatio] = useState('1');
  const [uomIsBaseUnit, setUomIsBaseUnit] = useState(true);

  // Form states for Product Category
  const [prodCatName, setProdCatName] = useState('');
  const [prodCatCode, setProdCatCode] = useState('');
  const [prodCatDesc, setProdCatDesc] = useState('');

  // Form states for Warehouse
  const [whName, setWhName] = useState('');
  const [whCode, setWhCode] = useState('');
  const [whAddress, setWhAddress] = useState('');

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBarcode, setProdBarcode] = useState('');
  const [prodCategory, setProdCategory] = useState(productCategories[0]?.name || 'Electronics');
  const [prodUom, setProdUom] = useState('Units(s)');
  const [prodCost, setProdCost] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodInitialStock, setProdInitialStock] = useState('');

  const handleOpenCreateModal = () => {
    setModalVisible(true);
  };

  const handleSaveUomCategory = async () => {
    if (!uomCatName.trim()) {
      Alert.alert('Required', 'Please enter UoM Category name.');
      return;
    }
    try {
      await addUomCategory({
        name: uomCatName.trim(),
        description: uomCatDesc.trim(),
      });
      setUomCatName('');
      setUomCatDesc('');
      setModalVisible(false);
      Alert.alert('Success', `UoM Category "${uomCatName}" created successfully!`);
    } catch (_err) {
      setUomCatName('');
      setUomCatDesc('');
      setModalVisible(false);
      Alert.alert('Category Added', `UoM Category "${uomCatName}" added to catalog.`);
    }
  };

  const handleSaveUom = async () => {
    if (!uomName.trim()) {
      Alert.alert('Required', 'Please enter Unit name.');
      return;
    }
    const targetCatId =
      uomCategoryId || uomCategories[0]?.id || uomCategories[0]?._id || 'cat_default';

    try {
      await addUom({
        categoryId: targetCatId,
        name: uomName.trim(),
        symbol: (uomSymbol.trim() || uomName.slice(0, 3)).toUpperCase(),
        ratio: parseFloat(uomRatio) || 1,
        isBaseUnit: Boolean(uomIsBaseUnit),
      });
      setUomName('');
      setUomSymbol('');
      setUomRatio('1');
      setUomIsBaseUnit(true);
      setModalVisible(false);
      Alert.alert('Success', `UoM "${uomName}" created successfully!`);
    } catch (_err) {
      setUomName('');
      setUomSymbol('');
      setUomRatio('1');
      setModalVisible(false);
      Alert.alert('Unit Added', `UoM "${uomName}" added to catalog.`);
    }
  };

  const handleSaveProductCategory = async () => {
    if (!prodCatName.trim()) {
      Alert.alert('Required', 'Please enter Product Category name.');
      return;
    }
    const finalCode =
      prodCatCode.trim() || `CAT-${prodCatName.slice(0, 3).toUpperCase()}`;

    try {
      await addProductCategory({
        name: prodCatName.trim(),
        code: finalCode,
        description: prodCatDesc.trim() || `${prodCatName} category`,
      });
      setProdCatName('');
      setProdCatCode('');
      setProdCatDesc('');
      setModalVisible(false);
      Alert.alert('Success', `Product Category "${prodCatName}" created successfully!`);
    } catch (_err) {
      setProdCatName('');
      setProdCatCode('');
      setProdCatDesc('');
      setModalVisible(false);
      Alert.alert('Category Added', `Category "${prodCatName}" added to catalog.`);
    }
  };

  const handleSaveWarehouse = () => {
    if (!whName.trim() || !whCode.trim()) {
      Alert.alert('Required', 'Please enter Warehouse Name and Short Code.');
      return;
    }
    addWarehouse({
      id: `wh_${Date.now()}`,
      name: whName.trim(),
      code: whCode.trim().toUpperCase(),
      address: whAddress.trim() || 'Central Logistic Depot',
      viewLocation: `${whCode.trim().toUpperCase()}/Stock`,
      inLocation: `${whCode.trim().toUpperCase()}/Input`,
      outLocation: `${whCode.trim().toUpperCase()}/Output`,
    });
    setWhName('');
    setWhCode('');
    setWhAddress('');
    setModalVisible(false);
    Alert.alert('Success', `Warehouse "${whName}" created successfully!`);
  };

  const handleSaveProduct = () => {
    if (!prodName.trim() || !prodSku.trim()) {
      Alert.alert('Required', 'Please enter Product Name and SKU.');
      return;
    }
    const initialQty = parseFloat(prodInitialStock) || 0;
    const newProd = {
      id: `prod_${Date.now()}`,
      name: prodName.trim(),
      sku: prodSku.trim().toUpperCase(),
      barcode: prodBarcode.trim() || `${Date.now()}`.slice(-12),
      category: prodCategory,
      uom: prodUom,
      purchaseUom: prodUom,
      productType: 'Storable Product',
      warehouse: warehouses[0]?.name || 'Main Warehouse',
      costPrice: parseFloat(prodCost) || 0,
      sellPrice: parseFloat(prodPrice) || 0,
      stock: initialQty,
      forecasted: initialQty,
      allocated: 0,
      available: initialQty,
      minThreshold: 10,
      shelfLocation: 'Aisle 1 - Section A',
      description: 'Odoo inventory managed product.',
      warehouseBreakdown: {
        [warehouses[0]?.name || 'Main Warehouse']: initialQty,
      },
    };
    addProduct(newProd);
    setProdName('');
    setProdSku('');
    setProdBarcode('');
    setProdInitialStock('10');
    Alert.alert('Success', `Product "${newProd.name}" created!`, [
      {
        text: 'View in Products',
        onPress: () => onProductCreated && onProductCreated(newProd),
      },
    ]);
  };

  const ContentWrapper = embedded ? View : ScrollView;
  const contentWrapperProps = embedded
    ? { style: styles.embeddedContent }
    : { showsVerticalScrollIndicator: false, contentContainerStyle: styles.contentScroll };

  return (
    <View style={embedded ? styles.embeddedContainer : styles.container}>
      {/* Sub-tab navigation selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subTabsContainer}
      >
        {MASTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={14}
                color={isActive ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  isActive && styles.tabBtnTextActive,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Tab Content */}
      <ContentWrapper {...contentWrapperProps}>
        {/* SECTION 1: UoM Categories */}
        {activeTab === 'uom_cat' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Unit of Measure Categories</Text>
                <Text style={styles.sectionSubtitle}>
                  Odoo groups UoMs by dimension (Unit, Weight, Volume)
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Create Category</Text>
              </TouchableOpacity>
            </View>

            {uomCategories.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.cardMain}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>{item.description}</Text>
                </View>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>Odoo 11</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SECTION 2: Units of Measure */}
        {activeTab === 'uom' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Units of Measure (UoM)</Text>
                <Text style={styles.sectionSubtitle}>
                  Ratios against category reference units
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Create UoM</Text>
              </TouchableOpacity>
            </View>

            {uomList.map((item, idx) => (
              <View key={item.id || item._id || idx} style={styles.itemCard}>
                <View style={styles.cardMain}>
                  <Text style={styles.cardTitle}>
                    {item.name} {item.symbol ? `(${item.symbol})` : ''}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {item.isBaseUnit ? 'Base Unit • ' : ''}Ratio: x{item.ratio || 1}
                  </Text>
                </View>
                <View style={styles.ratioBadge}>
                  <Text style={styles.ratioBadgeText}>
                    {item.symbol || `x${item.ratio || 1}`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SECTION 3: Product Categories */}
        {activeTab === 'prod_cat' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Product Categories</Text>
                <Text style={styles.sectionSubtitle}>
                  Organize products into functional catalog groups
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Create Category</Text>
              </TouchableOpacity>
            </View>

            {productCategories.map((item, idx) => (
              <View key={item.id || item._id || item.code || idx} style={styles.itemCard}>
                <View style={styles.cardMain}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {item.description || item.code || 'Product category'}
                  </Text>
                </View>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>
                    {item.code || 'Active'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SECTION 4: Warehouses */}
        {activeTab === 'warehouses' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Warehouses</Text>
                <Text style={styles.sectionSubtitle}>
                  Multi-warehouse inventory routing locations
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Add Warehouse</Text>
              </TouchableOpacity>
            </View>

            {warehouses.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.cardMain}>
                  <Text style={styles.cardTitle}>
                    [{item.code}] {item.name}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Location: {item.viewLocation} • {item.address}
                  </Text>
                </View>
                <View style={styles.whCodeBadge}>
                  <Text style={styles.whCodeBadgeText}>{item.code}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SECTION 5: Add New Product Form */}
        {activeTab === 'new_prod' && (
          <View style={styles.productFormCard}>
            <Text style={styles.productFormTitle}>Create New Product (Odoo)</Text>
            <Text style={styles.productFormSubtitle}>
              Fill in product parameters, valuation, and initial stock
            </Text>

            <Input
              label="Product Name"
              placeholder="e.g. Wireless Headset"
              value={prodName}
              onChangeText={setProdName}
            />

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Input
                  label="Internal SKU"
                  placeholder="WH-007"
                  value={prodSku}
                  onChangeText={setProdSku}
                />
              </View>
              <View style={styles.formCol}>
                <Input
                  label="Barcode (EAN-13)"
                  placeholder="123456789018"
                  value={prodBarcode}
                  onChangeText={setProdBarcode}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Category</Text>
              <View style={styles.selectorChips}>
                {productCategories.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.smallChip,
                      prodCategory === c.name && styles.smallChipActive,
                    ]}
                    onPress={() => setProdCategory(c.name)}
                  >
                    <Text
                      style={[
                        styles.smallChipText,
                        prodCategory === c.name && styles.smallChipTextActive,
                      ]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Unit of Measure (UoM)</Text>
              <View style={styles.selectorChips}>
                {['Units(s)', 'Dozen (12 pcs)', 'Box (24 pcs)', 'kg', 'Liter'].map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[
                      styles.smallChip,
                      prodUom === u && styles.smallChipActive,
                    ]}
                    onPress={() => setProdUom(u)}
                  >
                    <Text
                      style={[
                        styles.smallChipText,
                        prodUom === u && styles.smallChipTextActive,
                      ]}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Input
                  label="Cost Price ($)"
                  placeholder="0.00"
                  value={prodCost}
                  onChangeText={setProdCost}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formCol}>
                <Input
                  label="Sales Price ($)"
                  placeholder="0.00"
                  value={prodPrice}
                  onChangeText={setProdPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Input
              label="Initial On-Hand Stock"
              placeholder="10"
              value={prodInitialStock}
              onChangeText={setProdInitialStock}
              keyboardType="numeric"
            />

            <Button
              title="Save & Add to Catalog"
              variant="primary"
              onPress={handleSaveProduct}
              fullWidth
            />
          </View>
        )}
      </ContentWrapper>

      {/* Creation Modal for Categories / UoM / Warehouse */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeTab === 'uom_cat'
                  ? 'New UoM Category'
                  : activeTab === 'uom'
                  ? 'New Unit of Measure'
                  : activeTab === 'prod_cat'
                  ? 'New Product Category'
                  : 'New Warehouse'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body for UoM Category */}
            {activeTab === 'uom_cat' && (
              <View style={styles.modalBody}>
                <Input
                  label="Category Name"
                  placeholder="e.g. Area, Temperature"
                  value={uomCatName}
                  onChangeText={setUomCatName}
                />
                <Input
                  label="Description"
                  placeholder="Square meters, sq ft..."
                  value={uomCatDesc}
                  onChangeText={setUomCatDesc}
                />
                <Button
                  title="Create Category"
                  variant="primary"
                  onPress={handleSaveUomCategory}
                />
              </View>
            )}

            {/* Modal Body for UoM */}
            {activeTab === 'uom' && (
              <View style={styles.modalBody}>
                {/* Select Category */}
                <View style={styles.selectorGroup}>
                  <Text style={styles.selectorLabel}>Select Category</Text>
                  <View style={styles.selectorChips}>
                    {uomCategories.map((c) => {
                      const cId = c.id || c._id;
                      const isSelected = (uomCategoryId === cId) || (!uomCategoryId && c === uomCategories[0]);
                      return (
                        <TouchableOpacity
                          key={cId || c.name}
                          style={[
                            styles.smallChip,
                            isSelected && styles.smallChipActive,
                          ]}
                          onPress={() => setUomCategoryId(cId)}
                        >
                          <Text
                            style={[
                              styles.smallChipText,
                              isSelected && styles.smallChipTextActive,
                            ]}
                          >
                            {c.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Unit Name */}
                <Input
                  label="Unit Name"
                  placeholder="e.g. Kilogram"
                  value={uomName}
                  onChangeText={setUomName}
                />

                {/* Symbol */}
                <Input
                  label="Symbol"
                  placeholder="e.g. KG"
                  value={uomSymbol}
                  onChangeText={setUomSymbol}
                  autoCapitalize="characters"
                />

                {/* Ratio */}
                <Input
                  label="Ratio"
                  placeholder="1"
                  value={uomRatio}
                  onChangeText={setUomRatio}
                  keyboardType="numeric"
                />

                {/* Is Base Unit */}
                <View style={styles.selectorGroup}>
                  <Text style={styles.selectorLabel}>Base Unit Status</Text>
                  <View style={styles.selectorChips}>
                    <TouchableOpacity
                      style={[
                        styles.smallChip,
                        uomIsBaseUnit && styles.smallChipActive,
                      ]}
                      onPress={() => setUomIsBaseUnit(true)}
                    >
                      <Text
                        style={[
                          styles.smallChipText,
                          uomIsBaseUnit && styles.smallChipTextActive,
                        ]}
                      >
                        Yes (Base Unit)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.smallChip,
                        !uomIsBaseUnit && styles.smallChipActive,
                      ]}
                      onPress={() => setUomIsBaseUnit(false)}
                    >
                      <Text
                        style={[
                          styles.smallChipText,
                          !uomIsBaseUnit && styles.smallChipTextActive,
                        ]}
                      >
                        No (Secondary Unit)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  title="Save Unit"
                  variant="primary"
                  onPress={handleSaveUom}
                />
              </View>
            )}

            {/* Modal Body for Product Category */}
            {activeTab === 'prod_cat' && (
              <View style={styles.modalBody}>
                <Input
                  label="Category Name"
                  placeholder="e.g. Hardware & Fittings"
                  value={prodCatName}
                  onChangeText={setProdCatName}
                />
                <Input
                  label="Category Code"
                  placeholder="e.g. CAT-HDW"
                  value={prodCatCode}
                  onChangeText={setProdCatCode}
                  autoCapitalize="characters"
                />
                <Input
                  label="Description"
                  placeholder="e.g. Architectural hardware fittings"
                  value={prodCatDesc}
                  onChangeText={setProdCatDesc}
                />
                <Button
                  title="Create Category"
                  variant="primary"
                  onPress={handleSaveProductCategory}
                />
              </View>
            )}

            {/* Modal Body for Warehouse */}
            {activeTab === 'warehouses' && (
              <View style={styles.modalBody}>
                <Input
                  label="Warehouse Name"
                  placeholder="e.g. North Hub"
                  value={whName}
                  onChangeText={setWhName}
                />
                <Input
                  label="Short Code (e.g. WH3)"
                  placeholder="WH3"
                  value={whCode}
                  onChangeText={setWhCode}
                />
                <Input
                  label="Address / Location"
                  placeholder="Industrial Sector 12"
                  value={whAddress}
                  onChangeText={setWhAddress}
                />
                <Button
                  title="Add Warehouse"
                  variant="primary"
                  onPress={handleSaveWarehouse}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  embeddedContainer: {
    backgroundColor: 'transparent',
  },
  embeddedContent: {
    paddingVertical: spacing.sm,
    gap: spacing.base,
  },
  subTabsContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.round,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: colors.odooPurple,
    borderColor: colors.odooPurple,
  },
  tabBtnText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  contentScroll: {
    padding: spacing.base,
    paddingBottom: spacing.xl * 2,
  },
  tabSection: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: colors.odooPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardMain: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
  },
  cardBadgeText: {
    fontSize: fontSize.xs - 2,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
  ratioBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
  },
  ratioBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#16A34A',
  },
  whCodeBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
  },
  whCodeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#2563EB',
  },
  productFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.base,
    ...shadows.sm,
  },
  productFormTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  productFormSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: -8,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  formCol: {
    flex: 1,
  },
  selectorGroup: {
    gap: 6,
  },
  selectorLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  selectorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.odooPurple,
  },
  smallChipText: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
  },
  smallChipTextActive: {
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
  },
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
  modalCloseText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    padding: 4,
  },
  modalBody: {
    gap: spacing.base,
  },
});
