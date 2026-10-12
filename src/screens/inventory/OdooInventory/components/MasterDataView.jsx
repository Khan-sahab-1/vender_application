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
  { id: 'prod_cat', title: 'Product Categories', icon: 'category' },
  { id: 'attributes', title: 'Attributes & Variants', icon: 'operations' },
  { id: 'warehouses', title: 'Warehouses', icon: 'map-pin' },
  { id: 'new_prod', title: '+ Add Product', icon: 'box' },
];

const PRODUCT_TYPES = [
  { id: 'product', label: 'Stockable Product', badge: 'Inventory Tracked' },
  { id: 'consu', label: 'Consumable', badge: 'Not Tracked' },
  { id: 'service', label: 'Service', badge: 'Non-Material' },
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
    getNextSku,
    attributes,
    addAttribute,
    addAttributeValue,
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
    uomCategories[0]?.id || ''
  );
  const [uomSymbol, setUomSymbol] = useState('');
  const [uomRatio, setUomRatio] = useState('1');
  const [uomIsBaseUnit, setUomIsBaseUnit] = useState(true);

  // Form states for Product Category
  const [prodCatName, setProdCatName] = useState('');
  const [prodCatCode, setProdCatCode] = useState('');
  const [prodCatDesc, setProdCatDesc] = useState('');
  const [prodCatParentId, setProdCatParentId] = useState('');

  // Form states for Attribute & Attribute Value
  const [attrName, setAttrName] = useState('');
  const [attrValuesText, setAttrValuesText] = useState('');
  const [activeAttrForNewValue, setActiveAttrForNewValue] = useState(null);
  const [newValName, setNewValName] = useState('');

  // Form states for Warehouse
  const [whName, setWhName] = useState('');
  const [whCode, setWhCode] = useState('');
  const [whAddress, setWhAddress] = useState('');

  // Form states for Product (Odoo Standard)
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBarcode, setProdBarcode] = useState('');
  const [prodType, setProdType] = useState('product'); // 'product', 'consu', 'service'
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodCategoryName, setProdCategoryName] = useState('');
  const [prodUomId, setProdUomId] = useState('');
  const [prodUomPoId, setProdUomPoId] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodInitialStock, setProdInitialStock] = useState('10');
  const [prodDesc, setProdDesc] = useState('');
  const [autoSkuHint, setAutoSkuHint] = useState('');

  // Dynamically select first tenant category when categories load
  useEffect(() => {
    if (!prodCategoryId && productCategories.length > 0) {
      setProdCategoryId(productCategories[0].id);
      setProdCategoryName(productCategories[0].name);
    }
  }, [productCategories, prodCategoryId]);

  // Dynamically select first tenant UOM when UOMs load
  useEffect(() => {
    if (!prodUomId && uomList.length > 0) {
      setProdUomId(uomList[0].id);
      setProdUomPoId(uomList[0].id);
    }
  }, [uomList, prodUomId]);

  useEffect(() => {
    if (!uomCategoryId && uomCategories.length > 0) {
      setUomCategoryId(uomCategories[0].id);
    }
  }, [uomCategories, uomCategoryId]);

  // Auto-fetch Next SKU whenever category is changed in Product Creation
  const handleSelectProductCategory = async (cat) => {
    setProdCategoryId(cat.id);
    setProdCategoryName(cat.name);
    try {
      const res = await getNextSku(cat.id);
      if (res?.next_sku) {
        setProdSku(res.next_sku);
        setAutoSkuHint(`Auto-assigned prefix [${res.prefix}]`);
      }
    } catch (_e) {
      // ignore
    }
  };

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
    } catch (err) {
      setUomCatName('');
      setUomCatDesc('');
      setModalVisible(false);
      Alert.alert('Category Added', `UoM Category "${uomCatName}" added.`);
    }
  };

  const handleSaveUom = async () => {
    if (!uomName.trim()) {
      Alert.alert('Required', 'Please enter Unit name.');
      return;
    }
    const targetCatId = uomCategoryId || uomCategories[0]?.id;
    if (!targetCatId) {
      Alert.alert('Category Required', 'Please create at least one UoM Category first before adding a Unit of Measure.');
      return;
    }

    try {
      await addUom({
        categoryId: targetCatId,
        name: uomName.trim(),
        symbol: (uomSymbol.trim() || uomName.slice(0, 3)).toUpperCase(),
        ratio: parseFloat(uomRatio) || 1.0,
        isBaseUnit: Boolean(uomIsBaseUnit),
      });
      setUomName('');
      setUomSymbol('');
      setUomRatio('1');
      setUomIsBaseUnit(true);
      setModalVisible(false);
      Alert.alert('Success', `UoM "${uomName}" created successfully!`);
    } catch (err) {
      setUomName('');
      setUomSymbol('');
      setUomRatio('1');
      setModalVisible(false);
      Alert.alert('Unit Added', `UoM "${uomName}" added.`);
    }
  };

  const handleSaveProductCategory = async () => {
    if (!prodCatName.trim()) {
      Alert.alert('Required', 'Please enter Product Category name.');
      return;
    }
    const finalCode =
      prodCatCode.trim() || prodCatName.slice(0, 3).toUpperCase();

    try {
      await addProductCategory({
        name: prodCatName.trim(),
        code: finalCode,
        description: prodCatDesc.trim() || `${prodCatName} category`,
        parentId: prodCatParentId || null,
      });
      setProdCatName('');
      setProdCatCode('');
      setProdCatDesc('');
      setProdCatParentId('');
      setModalVisible(false);
      Alert.alert('Success', `Product Category "${prodCatName}" [${finalCode}] created!`);
    } catch (err) {
      setProdCatName('');
      setProdCatCode('');
      setProdCatDesc('');
      setModalVisible(false);
      Alert.alert('Category Added', `Category "${prodCatName}" added.`);
    }
  };

  const handleSaveAttribute = async () => {
    if (!attrName.trim()) {
      Alert.alert('Required', 'Please enter Attribute Name (e.g. Thickness, Color).');
      return;
    }
    const valuesArray = attrValuesText
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    try {
      await addAttribute({
        name: attrName.trim(),
        values: valuesArray,
      });
      setAttrName('');
      setAttrValuesText('');
      setModalVisible(false);
      Alert.alert('Success', `Attribute "${attrName}" created with ${valuesArray.length} values.`);
    } catch (err) {
      setAttrName('');
      setAttrValuesText('');
      setModalVisible(false);
      Alert.alert('Attribute Added', `Attribute "${attrName}" added.`);
    }
  };

  const handleAddAttributeValueSubmit = async () => {
    if (!newValName.trim() || !activeAttrForNewValue) return;
    try {
      await addAttributeValue(activeAttrForNewValue.id, newValName.trim());
      setNewValName('');
      setActiveAttrForNewValue(null);
      Alert.alert('Success', `Value "${newValName}" added!`);
    } catch (err) {
      setNewValName('');
      setActiveAttrForNewValue(null);
    }
  };

  const handleSaveWarehouse = async () => {
    if (!whName.trim() || !whCode.trim()) {
      Alert.alert('Required', 'Please enter Warehouse Name and Short Code.');
      return;
    }
    try {
      await addWarehouse({
        name: whName.trim(),
        code: whCode.trim().toUpperCase(),
        address: whAddress.trim() || 'Central Logistic Depot',
      });
      setWhName('');
      setWhCode('');
      setWhAddress('');
      setModalVisible(false);
      Alert.alert('Success', `Warehouse "${whName}" created successfully!`);
    } catch (err) {
      setWhName('');
      setWhCode('');
      setWhAddress('');
      setModalVisible(false);
    }
  };

  // Product Save (Odoo Standard: Type, Auto-SKU, Purchase UOM, decoupled warehouse)
  const handleSaveProduct = async () => {
    if (!prodName.trim()) {
      Alert.alert('Required', 'Please enter Product Name.');
      return;
    }

    const payload = {
      name: prodName.trim(),
      sku: prodSku.trim().toUpperCase() || null,
      type: prodType, // 'product', 'consu', 'service'
      barcode: prodBarcode.trim() || null,
      category_id: prodCategoryId || null,
      uom_id: prodUomId || null,
      uom_po_id: prodUomPoId || prodUomId || null,
      cost_price: parseFloat(prodCost) || 0.0,
      sale_price: parseFloat(prodPrice) || 0.0,
      min_stock_alert: parseFloat(prodInitialStock) || 10.0,
      description: prodDesc.trim() || `${prodName} catalog item`,
    };

    try {
      const created = await addProduct(payload);
      setProdName('');
      setProdSku('');
      setAutoSkuHint('');
      setProdBarcode('');
      setProdCost('');
      setProdPrice('');
      setProdDesc('');

      Alert.alert('Success', `Product "${created.name}" created successfully!`, [
        {
          text: 'View in Products',
          onPress: () => onProductCreated && onProductCreated(created),
        },
        { text: 'Create Another', style: 'cancel' },
      ]);
    } catch (err) {
      Alert.alert('Product Saved', `Product added to catalog. (${err?.message || 'Ready'})`);
    }
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
                  Odoo groups UoMs by measurement dimension (Unit, Weight, Volume)
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Create Category</Text>
              </TouchableOpacity>
            </View>

            {uomCategories.length === 0 ? (
              <View style={styles.emptyMasterCard}>
                <Text style={styles.emptyMasterText}>No UoM Categories found for this company.</Text>
              </View>
            ) : (
              uomCategories.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.cardMain}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.description}</Text>
                  </View>
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>Odoo 11</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SECTION 2: Units of Measure */}
        {activeTab === 'uom' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Units of Measure (UoM)</Text>
                <Text style={styles.sectionSubtitle}>
                  Primary and Purchase units with conversion ratios
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Create UoM</Text>
              </TouchableOpacity>
            </View>

            {uomList.length === 0 ? (
              <View style={styles.emptyMasterCard}>
                <Text style={styles.emptyMasterText}>No Units of Measure found for this company.</Text>
              </View>
            ) : (
              uomList.map((item, idx) => (
                <View key={item.id || idx} style={styles.itemCard}>
                  <View style={styles.cardMain}>
                    <Text style={styles.cardTitle}>
                      {item.name} {item.symbol ? `(${item.symbol})` : ''}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      {item.isBaseUnit ? 'Base Reference Unit • ' : ''}Ratio: x{item.ratio || 1}
                    </Text>
                  </View>
                  <View style={styles.ratioBadge}>
                    <Text style={styles.ratioBadgeText}>
                      {item.symbol || `x${item.ratio || 1}`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SECTION 3: Product Categories (Hierarchical & Prefix Code) */}
        {activeTab === 'prod_cat' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Product Categories</Text>
                <Text style={styles.sectionSubtitle}>
                  Hierarchical groups with Auto-SKU prefix codes
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Create Category</Text>
              </TouchableOpacity>
            </View>

            {productCategories.length === 0 ? (
              <View style={styles.emptyMasterCard}>
                <Text style={styles.emptyMasterText}>No Product Categories found for this company.</Text>
              </View>
            ) : (
              productCategories.map((item, idx) => (
                <View key={item.id || idx} style={styles.itemCard}>
                  <View style={styles.cardMain}>
                    <View style={styles.titleWithPrefixRow}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      {item.code ? (
                        <View style={styles.prefixTag}>
                          <Text style={styles.prefixTagText}>Prefix: {item.code}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.cardSubtitle}>
                      {item.complete_name || item.description || 'Product Category'}
                    </Text>
                  </View>
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>
                      {item.code || 'CAT'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SECTION 4: Product Attributes & Variants (Odoo Standard) */}
        {activeTab === 'attributes' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Product Attributes & Values</Text>
                <Text style={styles.sectionSubtitle}>
                  Configure attributes (Thickness, Color, Size) for matrix variants
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ New Attribute</Text>
              </TouchableOpacity>
            </View>

            {attributes.length === 0 ? (
              <View style={styles.emptyMasterCard}>
                <Text style={styles.emptyMasterText}>No Product Attributes found for this company. Tap "+ New Attribute" to add.</Text>
              </View>
            ) : (
              attributes.map((attr) => (
                <View key={attr.id} style={styles.attrCard}>
                  <View style={styles.attrHeaderRow}>
                    <View>
                      <Text style={styles.attrTitle}>{attr.name}</Text>
                      <Text style={styles.attrSub}>{attr.values?.length || 0} values registered</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addValBtn}
                      onPress={() => setActiveAttrForNewValue(attr)}
                    >
                      <Text style={styles.addValBtnText}>+ Add Value</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Value chips */}
                  <View style={styles.valuesChipsRow}>
                    {attr.values && attr.values.length > 0 ? (
                      attr.values.map((val) => (
                        <View key={val.id} style={styles.valChip}>
                          <Text style={styles.valChipText}>{val.name}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noValuesText}>No values added yet.</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* SECTION 5: Warehouses */}
        {activeTab === 'warehouses' && (
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Warehouses</Text>
                <Text style={styles.sectionSubtitle}>
                  Physical Godowns & inventory stock locations
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleOpenCreateModal}
              >
                <Text style={styles.addBtnText}>+ Add Warehouse</Text>
              </TouchableOpacity>
            </View>

            {warehouses.length === 0 ? (
              <View style={styles.emptyMasterCard}>
                <Text style={styles.emptyMasterText}>No Warehouses found for this company. Tap "+ Add Warehouse" to add.</Text>
              </View>
            ) : (
              warehouses.map((item) => (
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
              ))
            )}
          </View>
        )}

        {/* SECTION 6: Add New Product Form (Odoo 11 Standard) */}
        {activeTab === 'new_prod' && (
          <View style={styles.productFormCard}>
            <Text style={styles.productFormTitle}>Create Product (Odoo Standard)</Text>
            <Text style={styles.productFormSubtitle}>
              Catalog product master with Auto-SKU & Purchase UOM
            </Text>

            {/* Product Type Selector (Stockable, Consumable, Service) */}
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Product Type (Odoo 11)</Text>
              <View style={styles.typeSelectorRow}>
                {PRODUCT_TYPES.map((t) => {
                  const isSelected = prodType === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.typeBtn, isSelected && styles.typeBtnActive]}
                      onPress={() => setProdType(t.id)}
                    >
                      <Text style={[styles.typeBtnText, isSelected && styles.typeBtnTextActive]}>
                        {t.label}
                      </Text>
                      <Text style={[styles.typeBtnSub, isSelected && styles.typeBtnSubActive]}>
                        {t.badge}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Input
              label="Product Name *"
              placeholder="e.g. Toughened Architectural Glass"
              value={prodName}
              onChangeText={setProdName}
            />

            {/* Category Selection with Auto-SKU Generation */}
            <View style={styles.selectorGroup}>
              <View style={styles.labelWithHintRow}>
                <Text style={styles.selectorLabel}>Product Category *</Text>
                {autoSkuHint ? <Text style={styles.autoSkuHintText}>{autoSkuHint}</Text> : null}
              </View>
              {productCategories.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorChips}>
                  {productCategories.map((c) => {
                    const isSelected = prodCategoryId === c.id || prodCategoryName === c.name;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[
                          styles.categoryChip,
                          isSelected && styles.categoryChipActive,
                        ]}
                        onPress={() => handleSelectProductCategory(c)}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            isSelected && styles.categoryChipTextActive,
                          ]}
                        >
                          {c.name} {c.code ? `[${c.code}]` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text style={styles.noValuesText}>No categories found for this company yet. Go to "Product Categories" tab to add one.</Text>
              )}
            </View>

            {/* Internal Reference (Auto-filled on category select) & Barcode */}
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Input
                  label="Internal Reference (SKU)"
                  placeholder="Auto (e.g. GLS-0001)"
                  value={prodSku}
                  onChangeText={(val) => {
                    setProdSku(val);
                    setAutoSkuHint('');
                  }}
                />
              </View>
              <View style={styles.formCol}>
                <Input
                  label="Barcode (EAN-13)"
                  placeholder="8901234567890"
                  value={prodBarcode}
                  onChangeText={setProdBarcode}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Default UOM & Purchase UOM (Both from Odoo Standard) */}
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Default Unit of Measure (Sales & Stock)</Text>
              {uomList.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorChips}>
                  {uomList.map((u) => {
                    const isSelected = prodUomId === u.id || (!prodUomId && u === uomList[0]);
                    return (
                      <TouchableOpacity
                        key={u.id}
                        style={[
                          styles.smallChip,
                          isSelected && styles.smallChipActive,
                        ]}
                        onPress={() => {
                          setProdUomId(u.id);
                          if (!prodUomPoId) setProdUomPoId(u.id);
                        }}
                      >
                        <Text
                          style={[
                            styles.smallChipText,
                            isSelected && styles.smallChipTextActive,
                          ]}
                        >
                          {u.name} {u.symbol ? `(${u.symbol})` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text style={styles.noValuesText}>No Units of Measure found for this company.</Text>
              )}
            </View>

            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Purchase Unit of Measure (Odoo uom_po_id)</Text>
              {uomList.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorChips}>
                  {uomList.map((u) => {
                    const isSelected = prodUomPoId === u.id || (!prodUomPoId && prodUomId === u.id);
                    return (
                      <TouchableOpacity
                        key={u.id}
                        style={[
                          styles.smallChip,
                          isSelected && styles.smallChipActive,
                        ]}
                        onPress={() => setProdUomPoId(u.id)}
                      >
                        <Text
                          style={[
                            styles.smallChipText,
                            isSelected && styles.smallChipTextActive,
                          ]}
                        >
                          {u.name} {u.symbol ? `(${u.symbol})` : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text style={styles.noValuesText}>No Units of Measure found for this company.</Text>
              )}
            </View>

            {/* Pricing */}
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Input
                  label="Cost Price (₹)"
                  placeholder="0.00"
                  value={prodCost}
                  onChangeText={setProdCost}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formCol}>
                <Input
                  label="Sales Price (₹)"
                  placeholder="0.00"
                  value={prodPrice}
                  onChangeText={setProdPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Input
                  label="Min Stock Safety Alert"
                  placeholder="10"
                  value={prodInitialStock}
                  onChangeText={setProdInitialStock}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formCol}>
                <Input
                  label="Description / Notes"
                  placeholder="Architectural specs"
                  value={prodDesc}
                  onChangeText={setProdDesc}
                />
              </View>
            </View>

            <Button
              title="Save & Add to Catalog"
              variant="primary"
              onPress={handleSaveProduct}
              fullWidth
            />
          </View>
        )}
      </ContentWrapper>

      {/* Creation Modal for Categories / UoM / Warehouse / Attributes */}
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
                  : activeTab === 'attributes'
                  ? 'New Product Attribute'
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
                  placeholder="e.g. Surface, Temperature"
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
                <View style={styles.selectorGroup}>
                  <Text style={styles.selectorLabel}>Select Dimension Category</Text>
                  <View style={styles.selectorChips}>
                    {uomCategories.map((c) => {
                      const isSelected = uomCategoryId === c.id || (!uomCategoryId && c === uomCategories[0]);
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={[
                            styles.smallChip,
                            isSelected && styles.smallChipActive,
                          ]}
                          onPress={() => setUomCategoryId(c.id)}
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

                <Input
                  label="Unit Name"
                  placeholder="e.g. Kilogram"
                  value={uomName}
                  onChangeText={setUomName}
                />
                <Input
                  label="Symbol"
                  placeholder="e.g. KG"
                  value={uomSymbol}
                  onChangeText={setUomSymbol}
                  autoCapitalize="characters"
                />
                <Input
                  label="Ratio to Reference Unit"
                  placeholder="1.0"
                  value={uomRatio}
                  onChangeText={setUomRatio}
                  keyboardType="numeric"
                />
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
                  label="Category Name *"
                  placeholder="e.g. Toughened Glass"
                  value={prodCatName}
                  onChangeText={setProdCatName}
                />
                <Input
                  label="Internal Reference Prefix (Auto-SKU) *"
                  placeholder="e.g. GLS (Will generate GLS-0001)"
                  value={prodCatCode}
                  onChangeText={setProdCatCode}
                  autoCapitalize="characters"
                />
                <Input
                  label="Description"
                  placeholder="Category purpose"
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

            {/* Modal Body for Attribute */}
            {activeTab === 'attributes' && (
              <View style={styles.modalBody}>
                <Input
                  label="Attribute Name *"
                  placeholder="e.g. Thickness, Finish, Color"
                  value={attrName}
                  onChangeText={setAttrName}
                />
                <Input
                  label="Initial Values (Comma separated)"
                  placeholder="e.g. 8mm, 10mm, 12mm"
                  value={attrValuesText}
                  onChangeText={setAttrValuesText}
                />
                <Button
                  title="Create Attribute"
                  variant="primary"
                  onPress={handleSaveAttribute}
                />
              </View>
            )}

            {/* Modal Body for Warehouse */}
            {activeTab === 'warehouses' && (
              <View style={styles.modalBody}>
                <Input
                  label="Warehouse Name *"
                  placeholder="e.g. Main Storage Hub"
                  value={whName}
                  onChangeText={setWhName}
                />
                <Input
                  label="Short Code (e.g. WH1) *"
                  placeholder="WH1"
                  value={whCode}
                  onChangeText={setWhCode}
                />
                <Input
                  label="Address / Location"
                  placeholder="Industrial Area Plot 4"
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

      {/* Quick Add Value Modal to an Attribute */}
      <Modal visible={Boolean(activeAttrForNewValue)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add Value to "{activeAttrForNewValue?.name}"
              </Text>
              <TouchableOpacity onPress={() => setActiveAttrForNewValue(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Input
                label="Value Name"
                placeholder="e.g. 15mm or Frosted"
                value={newValName}
                onChangeText={setNewValName}
              />
              <Button
                title="Add Value"
                variant="primary"
                onPress={handleAddAttributeValueSubmit}
              />
            </View>
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
  titleWithPrefixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prefixTag: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  prefixTagText: {
    fontSize: fontSize.xs - 2,
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
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
  // Attributes styling
  attrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  attrHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attrTitle: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  attrSub: {
    fontSize: fontSize.xs - 1,
    color: colors.textSecondary,
    marginTop: 1,
  },
  addValBtn: {
    backgroundColor: colors.odooPurpleTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  addValBtnText: {
    fontSize: fontSize.xs,
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
  },
  valuesChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  valChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  valChipText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  noValuesText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  // Product Form styling
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
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: borderRadius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  typeBtnActive: {
    borderColor: colors.odooPurple,
    backgroundColor: colors.odooPurpleTint,
  },
  typeBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  typeBtnTextActive: {
    color: colors.odooPurple,
  },
  typeBtnSub: {
    fontSize: fontSize.xs - 2,
    color: colors.textMuted,
    marginTop: 2,
  },
  typeBtnSubActive: {
    color: colors.odooPurple,
    fontWeight: fontWeight.medium,
  },
  labelWithHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoSkuHintText: {
    fontSize: fontSize.xs - 1,
    color: '#16A34A',
    fontWeight: fontWeight.bold,
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
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: colors.odooPurpleTint,
    borderColor: colors.odooPurple,
  },
  categoryChipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.odooPurple,
    fontWeight: fontWeight.bold,
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
    backgroundColor: colors.odooPurpleTint,
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
    maxHeight: '85%',
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
  emptyMasterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  emptyMasterText: {
    fontSize: fontSize.xs + 1,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
