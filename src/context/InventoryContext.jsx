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
    parent: 'All',
    costingMethod: 'FIFO',
    inventoryValuation: 'Automated',
  },
  {
    id: 'pcat_2',
    name: 'Furniture',
    parent: 'All',
    costingMethod: 'Average Cost (AVCO)',
    inventoryValuation: 'Automated',
  },
  {
    id: 'pcat_3',
    name: 'Accessories',
    parent: 'All',
    costingMethod: 'Standard Price',
    inventoryValuation: 'Manual',
  },
  {
    id: 'pcat_4',
    name: 'Grains & Pulses',
    parent: 'All',
    costingMethod: 'FIFO',
    inventoryValuation: 'Automated',
  },
];

const INITIAL_WAREHOUSES = [
  {
    id: 'wh_1',
    name: 'Main Warehouse',
    code: 'WH1',
    address: 'Plot 42, Industrial Area, Sector 5',
    viewLocation: 'WH1/Stock',
    inLocation: 'WH1/Input',
    outLocation: 'WH1/Output',
  },
  {
    id: 'wh_2',
    name: 'Secondary Warehouse',
    code: 'WH2',
    address: 'Market Logistics Hub Gate 2',
    viewLocation: 'WH2/Stock',
    inLocation: 'WH2/Input',
    outLocation: 'WH2/Output',
  },
  {
    id: 'wh_3',
    name: 'WH/Stock Internal',
    code: 'INT1',
    address: 'Internal Depot Central Shelf',
    viewLocation: 'WH/Stock',
    inLocation: 'WH/Input',
    outLocation: 'WH/Output',
  },
];

// Odoo 11 Products from image
const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Laptop Pro 15',
    sku: 'LP-001',
    barcode: '123456789012',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Units(s)',
    productType: 'Storable Product',
    warehouse: 'Main Warehouse',
    costPrice: 850.0,
    sellPrice: 1200.0,
    stock: 45.0,
    forecasted: 45.0,
    allocated: 0.0,
    available: 45.0,
    minThreshold: 10,
    shelfLocation: 'Aisle 1 - Vault A',
    description: 'High performance laptop with 15-inch display.',
    warehouseBreakdown: {
      'Main Warehouse': 45.0,
      'Secondary Warehouse': 0.0,
      'WH/Stock': 0.0,
    },
  },
  {
    id: 'prod_2',
    name: 'Wireless Mouse',
    sku: 'WM-002',
    barcode: '123456789013',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Box (24 pcs)',
    productType: 'Storable Product',
    warehouse: 'Main Warehouse',
    costPrice: 15.0,
    sellPrice: 25.0,
    stock: 120.0,
    forecasted: 120.0,
    allocated: 0.0,
    available: 120.0,
    minThreshold: 20,
    shelfLocation: 'Aisle 2 - Shelf B',
    description: 'Ergonomic 2.4GHz wireless mouse with USB receiver.',
    warehouseBreakdown: {
      'Main Warehouse': 100.0,
      'Secondary Warehouse': 20.0,
      'WH/Stock': 0.0,
    },
  },
  {
    id: 'prod_3',
    name: 'Keyboard',
    sku: 'KB-003',
    barcode: '123456789014',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Box (24 pcs)',
    productType: 'Storable Product',
    warehouse: 'Main Warehouse',
    costPrice: 35.0,
    sellPrice: 55.0,
    stock: 80.0,
    forecasted: 80.0,
    allocated: 0.0,
    available: 80.0,
    minThreshold: 15,
    shelfLocation: 'Aisle 2 - Shelf C',
    description: 'Mechanical tactile feedback keyboard.',
    warehouseBreakdown: {
      'Main Warehouse': 60.0,
      'Secondary Warehouse': 20.0,
      'WH/Stock': 0.0,
    },
  },
  {
    id: 'prod_4',
    name: 'HD Monitor',
    sku: 'MON-004',
    barcode: '123456789015',
    category: 'Electronics',
    uom: 'Units(s)',
    purchaseUom: 'Units(s)',
    productType: 'Storable Product',
    warehouse: 'Main Warehouse',
    costPrice: 120.0,
    sellPrice: 180.0,
    stock: 25.0,
    forecasted: 25.0,
    allocated: 0.0,
    available: 25.0,
    minThreshold: 30, // Trigger low stock!
    shelfLocation: 'Aisle 3 - Bay 1',
    description: '27-inch 4K IPS display monitor.',
    warehouseBreakdown: {
      'Main Warehouse': 25.0,
      'Secondary Warehouse': 0.0,
      'WH/Stock': 0.0,
    },
  },
  {
    id: 'prod_5',
    name: 'Office Chair',
    sku: 'CH-005',
    barcode: '123456789016',
    category: 'Furniture',
    uom: 'Units(s)',
    purchaseUom: 'Units(s)',
    productType: 'Storable Product',
    warehouse: 'Main Warehouse',
    costPrice: 90.0,
    sellPrice: 145.0,
    stock: 15.0,
    forecasted: 15.0,
    allocated: 0.0,
    available: 15.0,
    minThreshold: 5,
    shelfLocation: 'Floor Storage Bay 4',
    description: 'Adjustable mesh ergonomic office chair.',
    warehouseBreakdown: {
      'Main Warehouse': 15.0,
      'Secondary Warehouse': 0.0,
      'WH/Stock': 0.0,
    },
  },
  {
    id: 'prod_6',
    name: 'USB Cable',
    sku: 'CB-006',
    barcode: '123456789017',
    category: 'Accessories',
    uom: 'Units(s)',
    purchaseUom: 'Box (24 pcs)',
    productType: 'Storable Product',
    warehouse: 'Secondary Warehouse',
    costPrice: 2.5,
    sellPrice: 6.0,
    stock: 200.0,
    forecasted: 200.0,
    allocated: 0.0,
    available: 200.0,
    minThreshold: 50,
    shelfLocation: 'Aisle 4 - Bin 22',
    description: 'Type-C high speed fast charging cable 1.5m.',
    warehouseBreakdown: {
      'Main Warehouse': 150.0,
      'Secondary Warehouse': 50.0,
      'WH/Stock': 0.0,
    },
  },
];

// Odoo 11 Stock Movements ledger from image
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
  {
    id: 'mov_4',
    date: '07 Aug 2025',
    type: 'Receipt',
    reference: 'Receipt (WH/IN/00044)',
    product: 'USB Cable',
    qty: 20,
    positive: true,
  },
  {
    id: 'mov_5',
    date: '02 Aug 2025',
    type: 'Delivery',
    reference: 'Delivery (WH/OUT/00029)',
    product: 'Office Chair',
    qty: -15,
    positive: false,
  },
];

const InventoryContext = createContext(undefined);

export const InventoryProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [uomCategories, setUomCategories] = useState(INITIAL_UOM_CATEGORIES);
  const [uomList, setUomList] = useState(INITIAL_UOMS);
  const [productCategories, setProductCategories] = useState(INITIAL_PRODUCT_CATEGORIES);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState(false);
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

  // Counters for Odoo overview calculated dynamically from movements
  const incomingCount = movements.filter((m) => m.type === 'Receipt').length;
  const outgoingCount = movements.filter((m) => m.type === 'Delivery').length;

  // Fetch Master Data dynamically from Backend API
  const fetchMasterData = useCallback(async () => {
    setIsLoadingMasterData(true);
    try {
      const [uomCatsRes, uomsRes, prodCatsRes, summaryRes] = await Promise.allSettled([
        InventoryApiService.getUomCategories(authToken),
        InventoryApiService.getUoms(authToken),
        InventoryApiService.getProductCategories(authToken),
        InventoryApiService.getInventorySummary(authToken),
      ]);

      if (uomCatsRes.status === 'fulfilled' && Array.isArray(uomCatsRes.value)) {
        const list = uomCatsRes.value.map((c, idx) => ({
          id: c.id || c._id || `uom_cat_${idx}`,
          name: c.name || '',
          description: c.description || '',
        }));
        setUomCategories(list);
      }

      if (uomsRes.status === 'fulfilled' && Array.isArray(uomsRes.value)) {
        const list = uomsRes.value.map((u, idx) => ({
          id: u.id || u._id || `uom_${idx}`,
          categoryId: u.categoryId || '',
          name: u.name || '',
          symbol: u.symbol || (u.name ? u.name.slice(0, 3).toUpperCase() : 'UNIT'),
          ratio: Number(u.ratio) || 1,
          isBaseUnit: Boolean(u.isBaseUnit),
        }));
        setUomList(list);
      }

      if (prodCatsRes.status === 'fulfilled' && Array.isArray(prodCatsRes.value)) {
        const list = prodCatsRes.value.map((p, idx) => ({
          id: p.id || p._id || `pcat_${idx}`,
          name: p.name || '',
          code: p.code || '',
          description: p.description || '',
        }));
        setProductCategories(list);
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
    } catch (_err) {
      // Keep existing data if offline
    } finally {
      setIsLoadingMasterData(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // UoM Category CRUD (POST /api/v1/inventory/uom-categories)
  const addUomCategory = async (newCat) => {
    try {
      const created = await InventoryApiService.createUomCategory(newCat, authToken);
      const item = {
        id: created.id || created._id || `uom_cat_${Date.now()}`,
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

  // UoM CRUD (POST /api/v1/inventory/uom-categories)
  const addUom = async (newUom) => {
    try {
      const created = await InventoryApiService.createUom(newUom, authToken);
      const item = {
        id: created.id || created._id || `uom_${Date.now()}`,
        categoryId: created.categoryId || newUom.categoryId,
        name: created.name || newUom.name,
        symbol: created.symbol || newUom.symbol,
        ratio: Number(created.ratio || newUom.ratio) || 1,
        isBaseUnit: Boolean(created.isBaseUnit ?? newUom.isBaseUnit),
      };
      setUomList((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `uom_${Date.now()}`,
        categoryId: newUom.categoryId,
        name: newUom.name,
        symbol: newUom.symbol,
        ratio: Number(newUom.ratio) || 1,
        isBaseUnit: Boolean(newUom.isBaseUnit),
      };
      setUomList((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  // Product Category CRUD (POST /api/inventory/categories)
  const addProductCategory = async (newCat) => {
    try {
      const created = await InventoryApiService.createProductCategory(newCat, authToken);
      const item = {
        id: created.id || created._id || `pcat_${Date.now()}`,
        name: created.name || newCat.name,
        code: created.code || newCat.code,
        description: created.description || newCat.description,
      };
      setProductCategories((prev) => [item, ...prev]);
      return item;
    } catch (err) {
      const localItem = {
        id: `pcat_${Date.now()}`,
        name: newCat.name,
        code: newCat.code,
        description: newCat.description,
      };
      setProductCategories((prev) => [localItem, ...prev]);
      throw err;
    }
  };

  // Warehouse CRUD
  const addWarehouse = (newWh) => {
    setWarehouses((prev) => [newWh, ...prev]);
  };

  // Product CRUD
  const addProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProductStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, stock: newStock } : item))
    );
  };

  // Odoo Operation: Receive Stock (Incoming)
  const processReceiveStock = ({ vendor, warehouse, reference, items }) => {
    // Increment items stock and log movement
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

  // Odoo Operation: Deliver Stock (Outgoing)
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

  // Odoo Operation: Internal Transfer
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
        inventorySummary,
        fetchMasterData,
        isLoadingMasterData,
        warehouses,
        addWarehouse,
        products,
        addProduct,
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
