import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { InventoryApiService } from '../services';
import { useAuth } from './AuthContext';

const INITIAL_UOM_CATEGORIES = [
  { id: 'uom_cat_1', name: 'Unit', description: 'Pieces, Dozens, Boxes, Cartons' },
  { id: 'uom_cat_2', name: 'Weight', description: 'Grams, Kilograms, Tonnes' },
  { id: 'uom_cat_3', name: 'Volume', description: 'Milliliters, Liters, Gallons' },
  { id: 'uom_cat_4', name: 'Length', description: 'Millimeters, Meters, Kilometers' },
  { id: 'uom_cat_5', name: 'Working Time', description: 'Hours, Days' },
];

const INITIAL_UOMS = [
  {
    id: 'uom_1',
    name: 'Units(s)',
    category: 'Unit',
    type: 'Reference',
    ratio: 1.0,
    rounding: 1.0,
  },
  {
    id: 'uom_2',
    name: 'Dozen (12 pcs)',
    category: 'Unit',
    type: 'Bigger than reference',
    ratio: 12.0,
    rounding: 1.0,
  },
  {
    id: 'uom_3',
    name: 'Box (24 pcs)',
    category: 'Unit',
    type: 'Bigger than reference',
    ratio: 24.0,
    rounding: 1.0,
  },
  {
    id: 'uom_4',
    name: 'kg',
    category: 'Weight',
    type: 'Reference',
    ratio: 1.0,
    rounding: 0.001,
  },
  {
    id: 'uom_5',
    name: 'Liter',
    category: 'Volume',
    type: 'Reference',
    ratio: 1.0,
    rounding: 0.001,
  },
];

const INITIAL_PRODUCT_CATEGORIES = [
  {
    id: 'pcat_1',
    name: 'Electronics',
    code: 'ELEC',
    description: 'Computers, accessories and gadgets',
    complete_name: 'All / Electronics',
  },
  {
    id: 'pcat_2',
    name: 'Furniture',
    code: 'FURN',
    description: 'Chairs, desks and tables',
    complete_name: 'All / Furniture',
  },
  {
    id: 'pcat_3',
    name: 'Hardware & Fittings',
    code: 'HDW',
    description: 'Hinges, handles and architectural fittings',
    complete_name: 'All / Hardware & Fittings',
  },
  {
    id: 'pcat_4',
    name: 'Glass Products',
    code: 'GLS',
    description: 'Toughened and architectural glass',
    complete_name: 'All / Glass Products',
  },
];

const INITIAL_ATTRIBUTES = [
  {
    id: 'attr_1',
    name: 'Thickness',
    values: [
      { id: 'val_1', name: '8mm' },
      { id: 'val_2', name: '10mm' },
      { id: 'val_3', name: '12mm' },
    ],
  },
  {
    id: 'attr_2',
    name: 'Color / Finish',
    values: [
      { id: 'val_4', name: 'Clear' },
      { id: 'val_5', name: 'Frosted' },
      { id: 'val_6', name: 'Tinted Black' },
    ],
  },
];

const INITIAL_WAREHOUSES = [
  {
    id: 'wh_1',
    name: 'Main Warehouse',
    code: 'WH1',
    address: 'Plot 42, Industrial Area, Sector 5',
    viewLocation: 'WH1/Stock',
  },
  {
    id: 'wh_2',
    name: 'Secondary Warehouse',
    code: 'WH2',
    address: 'Market Logistics Hub Gate 2',
    viewLocation: 'WH2/Stock',
  },
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Laptop Pro 15',
    sku: 'LP-001',
    barcode: '123456789012',
    type: 'product',
    productType: 'Stockable Product',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Units(s)',
    costPrice: 850.0,
    sellPrice: 1200.0,
    stock: 45.0,
    forecasted: 45.0,
    allocated: 0.0,
    available: 45.0,
    minThreshold: 10,
    shelfLocation: 'Aisle 1 - Vault A',
    description: 'High performance laptop with 15-inch display.',
  },
  {
    id: 'prod_2',
    name: 'Wireless Mouse',
    sku: 'WM-002',
    barcode: '123456789013',
    type: 'product',
    productType: 'Stockable Product',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Box (24 pcs)',
    costPrice: 15.0,
    sellPrice: 25.0,
    stock: 120.0,
    forecasted: 120.0,
    allocated: 0.0,
    available: 120.0,
    minThreshold: 20,
    shelfLocation: 'Aisle 2 - Shelf B',
    description: 'Ergonomic 2.4GHz wireless mouse with USB receiver.',
  },
  {
    id: 'prod_3',
    name: 'Keyboard',
    sku: 'KB-003',
    barcode: '123456789014',
    type: 'product',
    productType: 'Stockable Product',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Box (24 pcs)',
    costPrice: 35.0,
    sellPrice: 55.0,
    stock: 80.0,
    forecasted: 80.0,
    allocated: 0.0,
    available: 80.0,
    minThreshold: 15,
    shelfLocation: 'Aisle 2 - Shelf C',
    description: 'Mechanical tactile feedback keyboard.',
  },
  {
    id: 'prod_4',
    name: 'HD Monitor',
    sku: 'MON-004',
    barcode: '123456789015',
    type: 'product',
    productType: 'Stockable Product',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Units(s)',
    costPrice: 120.0,
    sellPrice: 180.0,
    stock: 25.0,
    forecasted: 25.0,
    allocated: 0.0,
    available: 25.0,
    minThreshold: 30,
    shelfLocation: 'Aisle 3 - Bay 1',
    description: '27-inch 4K IPS display monitor.',
  },
  {
    id: 'prod_5',
    name: 'Standard Installation Service',
    sku: 'SRV-0001',
    barcode: '',
    type: 'service',
    productType: 'Service',
    category: 'Hardware & Fittings',
    uom: 'Units(s)',
    purchaseUom: 'Units(s)',
    costPrice: 50.0,
    sellPrice: 100.0,
    stock: 0.0,
    forecasted: 0.0,
    allocated: 0.0,
    available: 0.0,
    minThreshold: 0,
    shelfLocation: 'N/A',
    description: 'On-site installation and fitting service.',
  },
];

const INITIAL_MOVEMENTS = [
  {
    id: 'mov_1',
    date: '10 Oct 2025',
    type: 'Receipt',
    reference: 'Receipt (WH/IN/00045)',
    product: 'Laptop Pro 15',
    qty: 50,
    positive: true,
  },
  {
    id: 'mov_2',
    date: '29 Sep 2025',
    type: 'Delivery',
    reference: 'Delivery (WH/OUT/00032)',
    product: 'Keyboard',
    qty: -10,
    positive: false,
  },
  {
    id: 'mov_3',
    date: '08 Sep 2025',
    type: 'Transfer',
    reference: 'Transfer (WH/IN/00021)',
    product: 'Mouse',
    qty: -5,
    positive: false,
  },
];

const normalizeProduct = (p) => {
  const typeLabelMap = {
    product: 'Stockable Product',
    consu: 'Consumable',
    service: 'Service',
  };
  const type = p.type || 'product';
  const stock = Number(p.stock_on_hand ?? p.stock) || 0;

  return {
    ...p,
    id: String(p.id || p._id || `prod_${Date.now()}`),
    name: p.name || 'Unnamed Product',
    sku: p.sku || 'SKU-NONE',
    barcode: p.barcode || '',
    type,
    productType: p.type_label || typeLabelMap[type] || 'Stockable Product',
    category: p.category?.name || p.category || 'General',
    categoryId: p.category_id || p.category?.id || null,
    uom: p.uom?.name || p.uom || 'Units(s)',
    uomId: p.uom_id || p.uom?.id || null,
    purchaseUom: p.purchase_uom?.name || p.purchaseUom || p.uom?.name || 'Units(s)',
    uomPoId: p.uom_po_id || p.purchase_uom?.id || null,
    costPrice: Number(p.cost_price ?? p.costPrice) || 0,
    sellPrice: Number(p.sale_price ?? p.sellPrice) || 0,
    stock,
    forecasted: stock,
    allocated: 0,
    available: stock,
    minThreshold: Number(p.min_stock_alert ?? p.minThreshold) || 10,
    shelfLocation: p.shelfLocation || 'WH/Stock',
    description: p.description || '',
    variants: p.variants || [],
  };
};

const InventoryContext = createContext(undefined);

export const InventoryProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [uomCategories, setUomCategories] = useState(INITIAL_UOM_CATEGORIES);
  const [uomList, setUomList] = useState(INITIAL_UOMS);
  const [productCategories, setProductCategories] = useState(INITIAL_PRODUCT_CATEGORIES);
  const [attributes, setAttributes] = useState(INITIAL_ATTRIBUTES);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [inventorySummary, setInventorySummary] = useState({
    total_products: 0,
    stockable_products: 0,
    consumable_products: 0,
    service_products: 0,
    total_stock_units: 0,
    inventory_valuation: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
    total_warehouses: 0,
  });

  const incomingCount = movements.filter((m) => m.type === 'Receipt').length;
  const outgoingCount = movements.filter((m) => m.type === 'Delivery').length;

  // Fetch Master Data dynamically from Backend API
  const fetchMasterData = useCallback(async () => {
    setIsLoadingMasterData(true);
    try {
      const [uomCatsRes, uomsRes, prodCatsRes, attrsRes, whRes, summaryRes, prodsRes] =
        await Promise.allSettled([
          InventoryApiService.getUomCategories(authToken),
          InventoryApiService.getUoms(authToken),
          InventoryApiService.getProductCategories(authToken),
          InventoryApiService.getAttributes(authToken),
          InventoryApiService.getWarehouses(authToken),
          InventoryApiService.getInventorySummary(authToken),
          InventoryApiService.getProducts({}, authToken),
        ]);

      if (uomCatsRes.status === 'fulfilled' && Array.isArray(uomCatsRes.value) && uomCatsRes.value.length > 0) {
        setUomCategories(
          uomCatsRes.value.map((c) => ({
            id: String(c.id),
            name: c.name,
            description: c.description || '',
          }))
        );
      }

      if (uomsRes.status === 'fulfilled' && Array.isArray(uomsRes.value) && uomsRes.value.length > 0) {
        setUomList(
          uomsRes.value.map((u) => ({
            id: String(u.id),
            categoryId: u.category_id ? String(u.category_id) : '',
            name: u.name,
            symbol: u.symbol || u.name.slice(0, 3).toUpperCase(),
            ratio: Number(u.ratio) || 1.0,
            isBaseUnit: Boolean(u.is_base_unit),
            uom_type: u.uom_type || 'reference',
            rounding: Number(u.rounding) || 0.01,
          }))
        );
      }

      if (prodCatsRes.status === 'fulfilled' && Array.isArray(prodCatsRes.value) && prodCatsRes.value.length > 0) {
        setProductCategories(
          prodCatsRes.value.map((p) => ({
            id: String(p.id),
            name: p.name,
            code: p.code || '',
            description: p.description || '',
            parent_id: p.parent_id ? String(p.parent_id) : null,
            complete_name: p.complete_name || p.name,
          }))
        );
      }

      if (attrsRes.status === 'fulfilled' && Array.isArray(attrsRes.value) && attrsRes.value.length > 0) {
        setAttributes(
          attrsRes.value.map((a) => ({
            id: String(a.id),
            name: a.name,
            values: (a.values || []).map((v) => ({
              id: String(v.id),
              name: v.name,
            })),
          }))
        );
      }

      if (whRes.status === 'fulfilled' && Array.isArray(whRes.value) && whRes.value.length > 0) {
        setWarehouses(
          whRes.value.map((w) => ({
            id: String(w.id),
            name: w.name,
            code: w.code,
            address: w.address || '',
            viewLocation: `${w.code}/Stock`,
          }))
        );
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        const s = summaryRes.value;
        setInventorySummary({
          total_products: Number(s.total_products) || 0,
          stockable_products: Number(s.stockable_products) || 0,
          consumable_products: Number(s.consumable_products) || 0,
          service_products: Number(s.service_products) || 0,
          total_stock_units: Number(s.total_stock_units) || 0,
          inventory_valuation: Number(s.inventory_valuation) || 0,
          low_stock_count: Number(s.low_stock_count) || 0,
          out_of_stock_count: Number(s.out_of_stock_count) || 0,
          total_warehouses: Number(s.total_warehouses) || 0,
        });
      }

      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value) && prodsRes.value.length > 0) {
        setProducts(prodsRes.value.map(normalizeProduct));
      }
    } catch (_err) {
      // Keep state resilient
    } finally {
      setIsLoadingMasterData(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // Fetch products with filters
  const fetchProducts = async (params = {}) => {
    setIsLoadingProducts(true);
    try {
      const data = await InventoryApiService.getProducts(params, authToken);
      if (Array.isArray(data)) {
        setProducts(data.map(normalizeProduct));
      }
    } catch (err) {
      console.warn('Failed to fetch products from backend:', err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Get Next SKU for a Category
  const getNextSku = async (categoryId) => {
    try {
      return await InventoryApiService.getNextSku(categoryId, authToken);
    } catch (err) {
      console.warn('Next SKU endpoint fallback:', err.message);
      const cat = productCategories.find((c) => c.id === categoryId);
      const prefix = cat?.code || 'PRD';
      return {
        prefix,
        next_sku: `${prefix}-0001`,
      };
    }
  };

  // UoM Category CRUD
  const addUomCategory = async (newCat) => {
    try {
      const created = await InventoryApiService.createUomCategory(newCat, authToken);
      const item = {
        id: String(created.id || `uom_cat_${Date.now()}`),
        name: created.name || newCat.name,
        description: created.description || newCat.description,
      };
      setUomCategories((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `uom_cat_${Date.now()}`,
        name: newCat.name,
        description: newCat.description,
      };
      setUomCategories((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  // UoM CRUD
  const addUom = async (newUom) => {
    try {
      const created = await InventoryApiService.createUom(newUom, authToken);
      const item = {
        id: String(created.id || `uom_${Date.now()}`),
        categoryId: String(created.category_id || newUom.categoryId || newUom.category_id),
        name: created.name || newUom.name,
        symbol: created.symbol || newUom.symbol,
        ratio: Number(created.ratio || newUom.ratio) || 1,
        isBaseUnit: Boolean(created.is_base_unit ?? newUom.isBaseUnit),
        uom_type: created.uom_type || 'reference',
        rounding: Number(created.rounding) || 0.01,
      };
      setUomList((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `uom_${Date.now()}`,
        categoryId: String(newUom.categoryId || newUom.category_id),
        name: newUom.name,
        symbol: newUom.symbol,
        ratio: Number(newUom.ratio) || 1,
        isBaseUnit: Boolean(newUom.isBaseUnit),
        uom_type: newUom.uom_type || 'reference',
        rounding: Number(newUom.rounding) || 0.01,
      };
      setUomList((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  // Product Category CRUD
  const addProductCategory = async (newCat) => {
    try {
      const created = await InventoryApiService.createProductCategory(newCat, authToken);
      const item = {
        id: String(created.id || `pcat_${Date.now()}`),
        name: created.name || newCat.name,
        code: created.code || newCat.code,
        description: created.description || newCat.description,
        parent_id: created.parent_id ? String(created.parent_id) : null,
        complete_name: created.complete_name || created.name,
      };
      setProductCategories((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `pcat_${Date.now()}`,
        name: newCat.name,
        code: newCat.code,
        description: newCat.description,
        parent_id: newCat.parent_id || null,
        complete_name: newCat.name,
      };
      setProductCategories((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  // Attribute CRUD
  const addAttribute = async (newAttr) => {
    try {
      const created = await InventoryApiService.createAttribute(newAttr, authToken);
      const item = {
        id: String(created.id),
        name: created.name,
        values: (created.values || []).map((v) => ({
          id: String(v.id),
          name: v.name,
        })),
      };
      setAttributes((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `attr_${Date.now()}`,
        name: newAttr.name,
        values: (newAttr.values || []).map((v, i) => ({
          id: `val_${Date.now()}_${i}`,
          name: typeof v === 'string' ? v : v.name,
        })),
      };
      setAttributes((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  const addAttributeValue = async (attributeId, valueName) => {
    try {
      const created = await InventoryApiService.addAttributeValue(attributeId, valueName, authToken);
      const valueItem = { id: String(created.id), name: created.name };
      setAttributes((prev) =>
        prev.map((attr) =>
          attr.id === attributeId
            ? { ...attr, values: [...attr.values, valueItem] }
            : attr
        )
      );
      return valueItem;
    } catch (err) {
      const localVal = { id: `val_${Date.now()}`, name: valueName };
      setAttributes((prev) =>
        prev.map((attr) =>
          attr.id === attributeId
            ? { ...attr, values: [...attr.values, localVal] }
            : attr
        )
      );
      throw err;
    }
  };

  // Warehouse CRUD
  const addWarehouse = async (newWh) => {
    try {
      const created = await InventoryApiService.createWarehouse(newWh, authToken);
      const item = {
        id: String(created.id),
        name: created.name,
        code: created.code,
        address: created.address || '',
        viewLocation: `${created.code}/Stock`,
      };
      setWarehouses((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `wh_${Date.now()}`,
        name: newWh.name,
        code: newWh.code,
        address: newWh.address || '',
        viewLocation: `${newWh.code}/Stock`,
      };
      setWarehouses((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  // Product CRUD
  const addProduct = async (newProductData) => {
    try {
      const created = await InventoryApiService.createProduct(newProductData, authToken);
      const normalized = normalizeProduct(created);
      setProducts((prev) => [normalized, ...prev]);
      // Update local summary
      setInventorySummary((prev) => ({
        ...prev,
        total_products: prev.total_products + 1,
        stockable_products:
          normalized.type === 'product' ? prev.stockable_products + 1 : prev.stockable_products,
        consumable_products:
          normalized.type === 'consu' ? prev.consumable_products + 1 : prev.consumable_products,
        service_products:
          normalized.type === 'service' ? prev.service_products + 1 : prev.service_products,
      }));
      return normalized;
    } catch (err) {
      const fallback = normalizeProduct({
        ...newProductData,
        id: `prod_${Date.now()}`,
      });
      setProducts((prev) => [fallback, ...prev]);
      throw err;
    }
  };

  const updateProductStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: newStock, available: newStock } : item
      )
    );
  };

  // Variants management
  const fetchProductVariants = async (productId) => {
    try {
      return await InventoryApiService.getProductVariants(productId, authToken);
    } catch (err) {
      console.warn('Failed to load variants:', err.message);
      return [];
    }
  };

  const generateVariants = async (productId, attributeIds) => {
    const res = await InventoryApiService.generateVariants(productId, attributeIds, authToken);
    // Refresh products list to keep variants linked
    fetchProducts();
    return res;
  };

  // Stock Operations (Odoo Receipts & Deliveries)
  const processReceiveStock = ({ vendor, warehouse, reference, items }) => {
    items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.sku === item.sku || p.id === item.id
            ? { ...p, stock: p.stock + item.qty, available: p.available + item.qty }
            : p
        )
      );

      setMovements((prev) => [
        {
          id: `mov_${Date.now()}_${item.sku}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'Receipt',
          reference: `Receipt (${reference || 'WH/IN/' + Date.now().toString().slice(-5)})`,
          product: item.name,
          qty: item.qty,
          positive: true,
        },
        ...prev,
      ]);
    });
  };

  const processDeliverStock = ({ customer, warehouse, reference, items }) => {
    items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.sku === item.sku || p.id === item.id
            ? { ...p, stock: Math.max(0, p.stock - item.qty), available: Math.max(0, p.available - item.qty) }
            : p
        )
      );

      setMovements((prev) => [
        {
          id: `mov_${Date.now()}_${item.sku}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'Delivery',
          reference: `Delivery (${reference || 'WH/OUT/' + Date.now().toString().slice(-5)})`,
          product: item.name,
          qty: -item.qty,
          positive: false,
        },
        ...prev,
      ]);
    });
  };

  const processTransferStock = ({ fromWarehouse, toWarehouse, items }) => {
    items.forEach((item) => {
      setMovements((prev) => [
        {
          id: `mov_${Date.now()}_${item.sku}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'Transfer',
          reference: `Transfer (${fromWarehouse} -> ${toWarehouse})`,
          product: item.name,
          qty: -item.qty,
          positive: false,
        },
        ...prev,
      ]);
    });
  };

  return (
    <InventoryContext.Provider
      value={{
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
        fetchProductVariants,
        generateVariants,
        inventorySummary,
        fetchMasterData,
        isLoadingMasterData,
        warehouses,
        addWarehouse,
        products,
        addProduct,
        fetchProducts,
        isLoadingProducts,
        updateProductStock,
        movements,
        incomingCount,
        outgoingCount,
        processReceiveStock,
        processDeliverStock,
        processTransferStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
