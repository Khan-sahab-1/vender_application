import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { InventoryApiService } from '../services';
import { useAuth } from './AuthContext';

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
    uom: p.uom?.name || p.uom || 'Units',
    uomId: p.uom_id || p.uom?.id || null,
    purchaseUom: p.purchase_uom?.name || p.purchaseUom || p.uom?.name || 'Units',
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
  const { authToken, currentTenant } = useAuth();

  // Strict tenant-scoped state: starts completely empty, NEVER prefilled with mock items from another company
  const [uomCategories, setUomCategories] = useState([]);
  const [uomList, setUomList] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
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

  // Clear all in-memory data to guarantee strict isolation whenever user logs out or switches tenant
  const resetTenantData = useCallback(() => {
    setUomCategories([]);
    setUomList([]);
    setProductCategories([]);
    setAttributes([]);
    setWarehouses([]);
    setProducts([]);
    setMovements([]);
    setInventorySummary({
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
  }, []);

  // Fetch Master Data dynamically from Backend API strictly for the authenticated tenant
  const fetchMasterData = useCallback(async () => {
    if (!authToken) {
      resetTenantData();
      return;
    }

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

      // Set only what belongs to this company (empty array if 0 records exist for this company)
      if (uomCatsRes.status === 'fulfilled' && Array.isArray(uomCatsRes.value)) {
        setUomCategories(
          uomCatsRes.value.map((c) => ({
            id: String(c.id),
            name: c.name,
            description: c.description || '',
          }))
        );
      } else {
        setUomCategories([]);
      }

      if (uomsRes.status === 'fulfilled' && Array.isArray(uomsRes.value)) {
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
      } else {
        setUomList([]);
      }

      if (prodCatsRes.status === 'fulfilled' && Array.isArray(prodCatsRes.value)) {
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
      } else {
        setProductCategories([]);
      }

      if (attrsRes.status === 'fulfilled' && Array.isArray(attrsRes.value)) {
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
      } else {
        setAttributes([]);
      }

      if (whRes.status === 'fulfilled' && Array.isArray(whRes.value)) {
        setWarehouses(
          whRes.value.map((w) => ({
            id: String(w.id),
            name: w.name,
            code: w.code,
            address: w.address || '',
            viewLocation: `${w.code}/Stock`,
          }))
        );
      } else {
        setWarehouses([]);
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

      // Products strictly for this tenant: if company has 0 products, show empty list!
      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) {
        setProducts(prodsRes.value.map(normalizeProduct));
      } else {
        setProducts([]);
      }
    } catch (_err) {
      // Keep resilient
    } finally {
      setIsLoadingMasterData(false);
    }
  }, [authToken, resetTenantData]);

  // Reactive tenant isolation: when user logs in, logs out, or switches tenant, wipe & re-fetch
  useEffect(() => {
    if (!authToken) {
      resetTenantData();
    } else {
      fetchMasterData();
    }
  }, [authToken, currentTenant?.id, fetchMasterData, resetTenantData]);

  // Fetch products with filters strictly for current tenant
  const fetchProducts = async (params = {}) => {
    if (!authToken) return;
    setIsLoadingProducts(true);
    try {
      const data = await InventoryApiService.getProducts(params, authToken);
      if (Array.isArray(data)) {
        setProducts(data.map(normalizeProduct));
      } else {
        setProducts([]);
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
    const created = await InventoryApiService.createUomCategory(newCat, authToken);
    const item = {
      id: String(created.id),
      name: created.name,
      description: created.description || '',
    };
    setUomCategories((prev) => [item, ...prev]);
    return item;
  };

  // UoM CRUD
  const addUom = async (newUom) => {
    const created = await InventoryApiService.createUom(newUom, authToken);
    const item = {
      id: String(created.id),
      categoryId: String(created.category_id || newUom.categoryId || newUom.category_id),
      name: created.name,
      symbol: created.symbol,
      ratio: Number(created.ratio) || 1,
      isBaseUnit: Boolean(created.is_base_unit),
      uom_type: created.uom_type || 'reference',
      rounding: Number(created.rounding) || 0.01,
    };
    setUomList((prev) => [item, ...prev]);
    return item;
  };

  // Product Category CRUD
  const addProductCategory = async (newCat) => {
    const created = await InventoryApiService.createProductCategory(newCat, authToken);
    const item = {
      id: String(created.id),
      name: created.name,
      code: created.code || '',
      description: created.description || '',
      parent_id: created.parent_id ? String(created.parent_id) : null,
      complete_name: created.complete_name || created.name,
    };
    setProductCategories((prev) => [item, ...prev]);
    return item;
  };

  // Attribute CRUD
  const addAttribute = async (newAttr) => {
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
  };

  const addAttributeValue = async (attributeId, valueName) => {
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
  };

  // Warehouse CRUD
  const addWarehouse = async (newWh) => {
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
  };

  // Product CRUD strictly saved to tenant in backend
  const addProduct = async (newProductData) => {
    const created = await InventoryApiService.createProduct(newProductData, authToken);
    const normalized = normalizeProduct(created);
    setProducts((prev) => [normalized, ...prev]);
    // Increment summary
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
