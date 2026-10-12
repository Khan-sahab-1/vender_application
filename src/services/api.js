/**
 * Dynamic Authentication & Inventory API Services
 * Base URL: http://192.168.1.8:8000
 */

export const API_BASE_URL = 'http://192.168.1.8:8000';

export const API_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  UOM_CATEGORIES: '/api/v1/inventory/uom-categories',
  PRODUCT_CATEGORIES: '/api/inventory/categories',
  SUMMARY: '/api/v1/inventory/summary',
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

export const AuthService = {
  /**
   * Dynamic Login Request
   * POST /api/v1/auth/login
   */
  async login(credentials) {
    const { email, password } = credentials;
    const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;

    const payload = {
      email: (email || '').trim(),
      password,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          data?.msg ||
          data?.errors?.[0]?.msg ||
          `Server returned status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(
          `Request timeout. Could not reach server at ${API_BASE_URL} within 10 seconds.`
        );
      }

      if (error.message === 'Network request failed') {
        throw new Error(
          `Unable to connect to ${API_BASE_URL}.\nPlease ensure the backend server is running.`
        );
      }

      throw error;
    }
  },
};

export const InventoryApiService = {
  /**
   * GET /api/v1/inventory/uom-categories
   */
  async getUomCategories(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOM_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to fetch UoM categories (${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || data?.categories || [];
  },

  /**
   * POST /api/v1/inventory/uom-categories
   * Payload: { name, description }
   */
  async createUomCategory(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOM_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        description: (payload.description || '').trim(),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to create UoM category (${response.status})`);
    }

    const data = await response.json();
    return data?.data || data || payload;
  },

  /**
   * GET UoM list via /api/v1/inventory/uom-categories
   */
  async getUoms(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOM_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to fetch UoMs (${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || data?.uoms || [];
  },

  /**
   * POST /api/v1/inventory/uom-categories
   * Payload: { categoryId, name, symbol, ratio, isBaseUnit }
   */
  async createUom(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.UOM_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        categoryId: payload.categoryId,
        name: (payload.name || '').trim(),
        symbol: (payload.symbol || '').trim(),
        ratio: Number(payload.ratio) || 1,
        isBaseUnit: Boolean(payload.isBaseUnit),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to create UoM (${response.status})`);
    }

    const data = await response.json();
    return data?.data || data || payload;
  },

  /**
   * GET /api/inventory/categories
   */
  async getProductCategories(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to fetch product categories (${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || data?.categories || [];
  },

  /**
   * POST /api/inventory/categories
   * Payload: { name, code, description }
   */
  async createProductCategory(payload, token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_CATEGORIES}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        name: (payload.name || '').trim(),
        code: (payload.code || '').trim(),
        description: (payload.description || '').trim(),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to create product category (${response.status})`);
    }

    const data = await response.json();
    return data?.data || data || payload;
  },

  /**
   * GET /api/v1/inventory/summary
   * Response: { total_products, stockable_products, consumable_products, service_products, total_stock_units, inventory_valuation, low_stock_count, out_of_stock_count, total_warehouses }
   */
  async getInventorySummary(token) {
    const url = `${API_BASE_URL}${API_ENDPOINTS.SUMMARY}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to fetch inventory summary (${response.status})`);
    }

    const data = await response.json();
    return data?.data || data;
  },
};
