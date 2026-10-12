import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SalesApiService } from '../services';
import { useAuth } from './AuthContext';

const SalesContext = createContext(undefined);

export const SalesProvider = ({ children }) => {
  const { authToken, currentTenant } = useAuth();

  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    total_orders: 0,
    pending_acknowledgment: 0,
    acknowledged_orders: 0,
    completed_orders: 0,
    total_sales_value: 0.0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Clear state when switching tenant or logging out
  const resetSalesData = useCallback(() => {
    setOrders([]);
    setSummary({
      total_orders: 0,
      pending_acknowledgment: 0,
      acknowledged_orders: 0,
      completed_orders: 0,
      total_sales_value: 0.0,
    });
    setFilterStatus('all');
    setSearchQuery('');
  }, []);

  const fetchOrders = useCallback(async (params = {}) => {
    if (!authToken) {
      resetSalesData();
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = {
        search: params.search ?? (searchQuery || undefined),
        limit: 150,
      };

      const [ordersRes, summaryRes] = await Promise.allSettled([
        SalesApiService.getSalesOrders(queryParams, authToken),
        SalesApiService.getSalesSummary(authToken),
      ]);

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      } else if (ordersRes.status === 'rejected') {
        console.warn('[SalesContext] Failed to fetch orders:', ordersRes.reason?.message || ordersRes.reason);
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        setSummary({
          total_orders: Number(summaryRes.value.total_orders) || 0,
          pending_acknowledgment: Number(summaryRes.value.pending_acknowledgment) || 0,
          acknowledged_orders: Number(summaryRes.value.acknowledged_orders) || 0,
          completed_orders: Number(summaryRes.value.completed_orders) || 0,
          total_sales_value: Number(summaryRes.value.total_sales_value) || 0.0,
        });
      }
    } catch (err) {
      console.warn('[SalesContext] Failed to fetch sales orders:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, searchQuery, resetSalesData]);

  const refreshOrders = useCallback(async () => {
    if (!authToken) return;
    setIsRefreshing(true);
    try {
      await fetchOrders();
    } finally {
      setIsRefreshing(false);
    }
  }, [authToken, fetchOrders]);

  // Acknowledge an order
  const acknowledgeOrder = async (poId, notes = '') => {
    if (!authToken) throw new Error('Not authenticated');

    const res = await SalesApiService.acknowledgeSalesOrder(poId, notes, authToken);
    const updatedOrder = res?.order || res;

    // Reactively update local state
    setOrders((prev) =>
      prev.map((o) => (o.odoo_po_id === poId ? { ...o, ...updatedOrder, is_acknowledged: true } : o))
    );

    // Refresh summary metrics
    try {
      const summaryData = await SalesApiService.getSalesSummary(authToken);
      if (summaryData) {
        setSummary({
          total_orders: Number(summaryData.total_orders) || 0,
          pending_acknowledgment: Number(summaryData.pending_acknowledgment) || 0,
          acknowledged_orders: Number(summaryData.acknowledged_orders) || 0,
          completed_orders: Number(summaryData.completed_orders) || 0,
          total_sales_value: Number(summaryData.total_sales_value) || 0.0,
        });
      }
    } catch (_e) {
      // Ignore background summary refresh failure
    }

    return updatedOrder;
  };

  // Re-fetch whenever auth token or tenant changes
  useEffect(() => {
    if (!authToken) {
      resetSalesData();
    } else {
      fetchOrders();
    }
  }, [authToken, currentTenant?.id, resetSalesData]);

  const value = {
    orders,
    summary,
    isLoading,
    isRefreshing,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    fetchOrders,
    refreshOrders,
    acknowledgeOrder,
    resetSalesData,
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};

