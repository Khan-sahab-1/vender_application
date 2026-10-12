/**
 * Dynamic Authentication & Inventory API Services (FastAPI ERP Backend)
 * Connects React Native app to FastAPI Odoo 11 standard endpoints.
 */

import { Platform } from 'react-native';

// For Android emulator 10.0.2.2 maps to host machine port 8000.
// On physical device or web, change or override with LAN IP.
export let API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

export const setApiBaseUrl = (url) => {
  if (url) {
    API_BASE_URL = url.trim().replace(/\/+$/, '');
  }
};

export const API_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  ME: '/api/v1/auth/me',
  SUMMARY: '/api/v1/inventory/summary',
  UOM_CATEGORIES: '/api/v1/inventory/uom-categories',
  UOMS: '/api/v1/inventory/uoms',
  CATEGORIES: '/api/v1/inventory/categories',
  NEXT_SKU: (categoryId) => `/api/v1/inventory/categories/${categoryId}/next-sku`,
  ATTRIBUTES: '/api/v1/inventory/attributes',
  ATTRIBUTE_VALUES: (attributeId) => `/api/v1/inventory/attributes/${attributeId}/values`,
  PRODUCTS: '/api/v1/inventory/products',
  PRODUCT_DETAIL: (productId) => `/api/v1/inventory/products/${productId}`,
  VARIANTS: (productId) => `/api/v1/inventory/products/${productId}/variants`,
  GENERATE_VARIANTS: (productId) => `/api/v1/inventory/products/${productId}/generate-variants`,
  WAREHOUSES: '/api/v1/inventory/warehouses',
  // Sales Orders (Vendor Portal mirrored from Odoo POs)
  SALES_SUMMARY: '/api/v1/sales/summary',
  SALES_ORDERS: '/api/v1/sales/orders',
  SALES_ORDER_DETAIL: (poId) => `/api/v1/sales/orders/${poId}`,
  ACKNOWLEDGE_ORDER: (poId) => `/api/v1/sales/orders/${poId}/acknowledge`,
};

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseErrorMessage = (data, response) => {
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail)) {
    return data.detail.map((err) => `${err.loc?.slice(-1)?.[0] || 'field'}: ${err.msg}`).join(', ');
  }
  return (
    data?.message ||
    data?.error ||
    data?.msg ||
    `Server returned status ${response?.status || 'Unknown'}`
  );
};

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(parseErrorMessage(data, response));
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout. Could not reach server at ${API_BASE_URL} within 12 seconds.`);
    }
    if (error.message === 'Network request failed') {
      throw new Error(`Unable to connect to ${API_BASE_URL}.\nPlease check backend server and network.`);
    }
    throw error;
  }
};

export const AuthService = {
  /**
   * POST /api/v1/auth/login
   */
  async login(credentials) {
    const { email, password } = credentials;
    const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: (email || '').trim(),
        password,
      }),
    });
  },

  /**
   * GET /api/v1/auth/me
   */
  async getMe(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ME}`;
    return request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
  },
};

export const InventoryApiService = {
  /**
   * GET /api/v1/inventory/summary
   */
  async getInventorySummary(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.SUMMARY}`;
    return request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
  },

  /**
   * GET /api/v1/inventory/uom-categories
   */
  async getUomCategories(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOM_CATEGORIES}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * POST /api/v1/inventory/uom-categories
   */
  async createUomCategory(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOM_CATEGORIES}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        description: (payload.description || '').trim() || null,
      }),
    });
  },

  /**
   * GET /api/v1/inventory/uoms
   */
  async getUoms(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOMS}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * POST /api/v1/inventory/uoms
   */
  async createUom(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOMS}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        category_id: payload.categoryId || payload.category_id,
        name: (payload.name || '').trim(),
        symbol: (payload.symbol || '').trim().toUpperCase(),
        ratio: Number(payload.ratio) || 1.0,
        is_base_unit: Boolean(payload.isBaseUnit ?? payload.is_base_unit),
        uom_type: payload.uom_type || (payload.isBaseUnit ? 'reference' : 'bigger'),
        rounding: Number(payload.rounding) || 0.01,
      }),
    });
  },

  /**
   * GET /api/v1/inventory/categories
   */
  async getProductCategories(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * POST /api/v1/inventory/categories
   */
  async createProductCategory(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        code: (payload.code || '').trim() || null,
        description: (payload.description || '').trim() || null,
        parent_id: payload.parentId || payload.parent_id || null,
      }),
    });
  },

  /**
   * GET /api/v1/inventory/categories/{categoryId}/next-sku
   * Auto-sequenced SKU suggestion based on category code (e.g. GLS-0001)
   */
  async getNextSku(categoryId, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.NEXT_SKU(categoryId)}`;
    return request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
  },

  /**
   * GET /api/v1/inventory/attributes
   */
  async getAttributes(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ATTRIBUTES}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * POST /api/v1/inventory/attributes
   */
  async createAttribute(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ATTRIBUTES}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        values: Array.isArray(payload.values) ? payload.values : [],
      }),
    });
  },

  /**
   * POST /api/v1/inventory/attributes/{attributeId}/values
   */
  async addAttributeValue(attributeId, name, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ATTRIBUTE_VALUES(attributeId)}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (name || '').trim(),
      }),
    });
  },

  /**
   * GET /api/v1/inventory/products
   */
  async getProducts(params = {}, token) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.product_type) queryParams.append('product_type', params.product_type);
    if (params?.category_id) queryParams.append('category_id', params.category_id);
    if (params?.low_stock) queryParams.append('low_stock', 'true');

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}${queryString ? `?${queryString}` : ''}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * GET /api/v1/inventory/products/{productId}
   */
  async getProduct(productId, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DETAIL(productId)}`;
    return request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
  },

  /**
   * POST /api/v1/inventory/products
   * Note: warehouse_id is decoupled from catalog product creation as per Odoo standard
   */
  async createProduct(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        sku: (payload.sku || '').trim() || null,
        type: payload.type || 'product', // 'product', 'consu', 'service'
        barcode: (payload.barcode || '').trim() || null,
        description: (payload.description || '').trim() || null,
        category_id: payload.categoryId || payload.category_id || null,
        uom_id: payload.uomId || payload.uom_id || null,
        uom_po_id: payload.uomPoId || payload.uom_po_id || null,
        tracking: payload.tracking || 'none',
        cost_price: Number(payload.costPrice ?? payload.cost_price) || 0.0,
        sale_price: Number(payload.salePrice ?? payload.sale_price) || 0.0,
        min_stock_alert: Number(payload.minStockAlert ?? payload.min_stock_alert ?? payload.minThreshold) || 10.0,
        tax_rate: Number(payload.taxRate ?? payload.tax_rate) || 18.0,
        hsn_code: payload.hsnCode || payload.hsn_code || null,
      }),
    });
  },

  /**
   * PUT /api/v1/inventory/products/{productId}
   */
  async updateProduct(productId, payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DETAIL(productId)}`;
    return request(url, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  /**
   * DELETE /api/v1/inventory/products/{productId}
   */
  async deleteProduct(productId, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DETAIL(productId)}`;
    return request(url, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
  },

  /**
   * GET /api/v1/inventory/products/{productId}/variants
   */
  async getProductVariants(productId, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.VARIANTS(productId)}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * POST /api/v1/inventory/products/{productId}/generate-variants
   */
  async generateVariants(productId, attributeIds, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.GENERATE_VARIANTS(productId)}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        attribute_ids: attributeIds,
      }),
    });
  },

  /**
   * POST /api/v1/inventory/products/{productId}/variants
   */
  async createVariant(productId, payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.VARIANTS(productId)}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        sku: (payload.sku || '').trim() || null,
        name: (payload.name || '').trim() || null,
        barcode: (payload.barcode || '').trim() || null,
        price_extra: Number(payload.price_extra || payload.priceExtra) || 0.0,
        attribute_value_ids: payload.attribute_value_ids || [],
      }),
    });
  },

  /**
   * GET /api/v1/inventory/warehouses
   */
  async getWarehouses(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.WAREHOUSES}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * POST /api/v1/inventory/warehouses
   */
  async createWarehouse(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.WAREHOUSES}`;
    return request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        code: (payload.code || '').trim().toUpperCase(),
        address: (payload.address || '').trim() || null,
      }),
    });
  },
};

export const SalesApiService = {
  /**
   * GET /api/v1/sales/orders
   */
  async getSalesOrders(params = {}, token) {
    const q = [];
    if (params.search) q.push(`search=${encodeURIComponent(params.search)}`);
    if (params.status) q.push(`status=${encodeURIComponent(params.status)}`);
    if (params.limit) q.push(`limit=${encodeURIComponent(params.limit)}`);
    const qs = q.length > 0 ? `?${q.join('&')}` : '';

    const url = `${API_BASE_URL}${API_ENDPOINTS.SALES_ORDERS}${qs}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return Array.isArray(data) ? data : data?.data || [];
  },

  /**
   * GET /api/v1/sales/orders/:poId
   */
  async getSalesOrderDetail(poId, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.SALES_ORDER_DETAIL(poId)}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return data?.data || data;
  },

  /**
   * POST /api/v1/sales/orders/:poId/acknowledge
   */
  async acknowledgeSalesOrder(poId, notes = '', token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ACKNOWLEDGE_ORDER(poId)}`;
    const data = await request(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ notes }),
    });
    return data?.data || data;
  },

  /**
   * GET /api/v1/sales/summary
   */
  async getSalesSummary(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.SALES_SUMMARY}`;
    const data = await request(url, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return data?.data || data;
  },
};

