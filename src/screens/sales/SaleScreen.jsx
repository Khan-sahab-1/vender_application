import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, spacing } from '../../constants/spacing';
import { fontSize, fontWeight } from '../../constants/typography';
import { shadows } from '../../constants/shadows';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { useSales } from '../../context/SalesContext';
import { useAuth } from '../../context/AuthContext';

const STATUS_CHIPS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending_ack', label: 'Needs Ack' },
  { id: 'acknowledged', label: 'Acknowledged' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Done' },
];

export const SaleScreen = () => {
  const { currentTenant } = useAuth();
  const {
    orders,
    summary,
    isLoading,
    isRefreshing,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    refreshOrders,
    acknowledgeOrder,
  } = useSales();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [ackModalVisible, setAckModalVisible] = useState(false);
  const [orderToAck, setOrderToAck] = useState(null);
  const [ackNotes, setAckNotes] = useState('');
  const [isSubmittingAck, setIsSubmittingAck] = useState(false);

  // Client-side quick filter & search
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (filterStatus === 'pending_ack' && o.is_acknowledged) return false;
      if (filterStatus === 'acknowledged' && !o.is_acknowledged) return false;
      if (filterStatus === 'confirmed' && o.state !== 'purchase') return false;
      if (filterStatus === 'completed' && o.state !== 'done') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNumber =
          (o.so_number || '').toLowerCase().includes(q) ||
          (o.po_reference || '').toLowerCase().includes(q);
        const matchBuyer = (o.buyer_company || '').toLowerCase().includes(q);
        const matchItem = (o.lines || []).some(
          (l) =>
            (l.product_name || '').toLowerCase().includes(q) ||
            (l.name || '').toLowerCase().includes(q)
        );
        return matchNumber || matchBuyer || matchItem;
      }

      return true;
    });
  }, [orders, filterStatus, searchQuery]);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleOpenAckModal = (order) => {
    setOrderToAck(order);
    setAckNotes('');
    setAckModalVisible(true);
  };

  const handleConfirmAcknowledge = async () => {
    if (!orderToAck) return;

    setIsSubmittingAck(true);
    try {
      const updated = await acknowledgeOrder(orderToAck.odoo_po_id, ackNotes);
      setAckModalVisible(false);

      // If detail modal is open for this order, update it too
      if (selectedOrder?.odoo_po_id === orderToAck.odoo_po_id) {
        setSelectedOrder((prev) => ({ ...prev, ...updated, is_acknowledged: true }));
      }

      Alert.alert(
        'Order Acknowledged! (Odoo Updated)',
        `Sales Order "${orderToAck.so_number}" has been successfully acknowledged.\nThe buyer company has received real-time confirmation in Odoo 11 chatter.`
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to acknowledge order.');
    } finally {
      setIsSubmittingAck(false);
      setOrderToAck(null);
    }
  };

  const formatCurrency = (val) => {
    return `₹${Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return dateStr.split(' ')[0] || dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (_e) {
      return dateStr;
    }
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'purchase':
        return { bg: '#E0E7FF', text: '#3730A3', label: 'Confirmed' };
      case 'done':
        return { bg: '#D1FAE5', text: '#065F46', label: 'Completed' };
      case 'sent':
        return { bg: '#FEF3C7', text: '#92400E', label: 'RFQ Received' };
      case 'to approve':
        return { bg: '#FEE2E2', text: '#991B1B', label: 'Pending Approval' };
      case 'cancel':
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Cancelled' };
      default:
        return { bg: '#F1F5F9', text: '#475569', label: state || 'Draft' };
    }
  };

  return (
    <View style={styles.screenContainer}>
      {/* Top Header Banner */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>Sales Orders</Text>
            <Text style={styles.headerSubtitle}>
              Customer POs from Odoo 11 • {currentTenant?.name || 'My Company'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={refreshOrders}
            disabled={isRefreshing}
            activeOpacity={0.7}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="repeat" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* 4 Summary KPI Metric Badges */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiScroll}
        >
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Sales Value</Text>
            <Text style={styles.kpiValueMain}>
              {formatCurrency(summary.total_sales_value)}
            </Text>
            <Text style={styles.kpiSub}>{summary.total_orders} total orders</Text>
          </View>

          <View style={[styles.kpiCard, styles.kpiCardWarning]}>
            <View style={styles.kpiBadgeHeader}>
              <Text style={styles.kpiBadgeCount}>{summary.pending_acknowledgment}</Text>
              <View style={styles.kpiDotOrange} />
            </View>
            <Text style={styles.kpiLabelWarning}>Action Needed</Text>
            <Text style={styles.kpiSub}>Pending Acknowledgment</Text>
          </View>

          <View style={[styles.kpiCard, styles.kpiCardSuccess]}>
            <View style={styles.kpiBadgeHeader}>
              <Text style={styles.kpiBadgeCountSuccess}>{summary.acknowledged_orders}</Text>
              <Icon name="check" size={14} color={colors.success} />
            </View>
            <Text style={styles.kpiLabelSuccess}>Acknowledged</Text>
            <Text style={styles.kpiSub}>Confirmed to Buyer</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiBadgeCount}>{summary.completed_orders}</Text>
            <Text style={styles.kpiLabel}>Fulfilled Orders</Text>
            <Text style={styles.kpiSub}>Completed in Odoo</Text>
          </View>
        </ScrollView>
      </View>

      {/* Search Bar & Status Chips */}
      <View style={styles.controlsSection}>
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by SO No, PO Ref, or Product..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="minus" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {STATUS_CHIPS.map((chip) => {
            const isSelected = filterStatus === chip.id;
            let count = null;
            if (chip.id === 'all') count = summary.total_orders;
            if (chip.id === 'pending_ack') count = summary.pending_acknowledgment;
            if (chip.id === 'acknowledged') count = summary.acknowledged_orders;
            if (chip.id === 'completed') count = summary.completed_orders;

            return (
              <TouchableOpacity
                key={chip.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setFilterStatus(chip.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {chip.label}
                  {count !== null ? ` (${count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Order List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshOrders}
            colors={[colors.odooPurple]}
          />
        }
      >
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.odooPurple} />
            <Text style={styles.loadingText}>Fetching Sales Orders from Odoo 11...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Icon name="sale" size={32} color={colors.odooPurple} />
            </View>
            <Text style={styles.emptyTitle}>No Sales Orders Found</Text>
            <Text style={styles.emptyDesc}>
              {searchQuery.trim()
                ? `No orders matching "${searchQuery}". Try a different keyword.`
                : filterStatus !== 'all'
                ? `No orders found in this filter category.`
                : 'When customers place Purchase Orders for your company in Odoo 11, they will automatically appear here as Sales Orders with full line items.'}
            </Text>
            <TouchableOpacity style={styles.emptyRefreshBtn} onPress={refreshOrders}>
              <Text style={styles.emptyRefreshBtnText}>Refresh from Odoo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const stColor = getStatusColor(order.state);
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Header: SO Number, PO Ref, State */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.soNumber}>{order.so_number}</Text>
                    <Text style={styles.poRefBadge}>[{order.po_reference}]</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: stColor.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: stColor.text }]}>
                      {order.status_label || stColor.label}
                    </Text>
                  </View>
                </View>

                {/* Buyer / Customer Info */}
                <View style={styles.buyerRow}>
                  <Icon name="building" size={14} color={colors.odooPurple} />
                  <Text style={styles.buyerName} numberOfLines={1}>
                    {order.buyer_company}
                  </Text>
                </View>

                {/* Dates & Line count */}
                <View style={styles.metaRow}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Order Date</Text>
                    <Text style={styles.metaValue}>{formatDate(order.date_order)}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Scheduled Date</Text>
                    <Text style={styles.metaValue}>
                      {formatDate(order.date_planned) || 'Standard'}
                    </Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Line Items</Text>
                    <Text style={styles.metaValue}>
                      {order.item_count} {order.item_count === 1 ? 'item' : 'items'}
                    </Text>
                  </View>
                </View>

                {/* Items Preview */}
                {order.lines && order.lines.length > 0 && (
                  <View style={styles.itemsPreviewBox}>
                    {order.lines.slice(0, 2).map((l, idx) => (
                      <View key={l.id || idx} style={styles.itemPreviewLine}>
                        <Text style={styles.itemPreviewName} numberOfLines={1}>
                          • {l.product_name}
                        </Text>
                        <Text style={styles.itemPreviewQty}>
                          {l.product_qty} {l.product_uom}
                        </Text>
                      </View>
                    ))}
                    {order.lines.length > 2 && (
                      <Text style={styles.moreItemsText}>
                        +{order.lines.length - 2} more item(s)...
                      </Text>
                    )}
                  </View>
                )}

                {/* Price & Amount Row */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Order Value:</Text>
                  <Text style={styles.totalAmount}>{formatCurrency(order.amount_total)}</Text>
                </View>

                {/* Footer: Acknowledgment Status & Action Buttons */}
                <View style={styles.cardFooter}>
                  {order.is_acknowledged ? (
                    <View style={styles.ackSuccessBadge}>
                      <Icon name="check" size={14} color={colors.success} />
                      <Text style={styles.ackSuccessText}>
                        Acknowledged • {formatDate(order.acknowledged_at)}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.ackActionBtn}
                      onPress={() => handleOpenAckModal(order)}
                      activeOpacity={0.8}
                    >
                      <Icon name="check" size={14} color="#FFFFFF" />
                      <Text style={styles.ackActionBtnText}>Acknowledge Order</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.viewDetailBtn}
                    onPress={() => handleOpenDetail(order)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewDetailText}>View Details</Text>
                    <Icon name="arrow-right" size={12} color={colors.odooPurple} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ========================================================= */}
      {/* MODAL 1: FULL ORDER DETAILS VIEW                          */}
      {/* ========================================================= */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalFullContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackBtn}
              onPress={() => setDetailModalVisible(false)}
            >
              <Icon name="back" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalHeaderTitle}>
                {selectedOrder?.so_number || 'Sales Order'}
              </Text>
              <Text style={styles.modalHeaderSub}>
                PO Ref: {selectedOrder?.po_reference}
              </Text>
            </View>
            <View style={styles.modalStateBadge}>
              <Text style={styles.modalStateText}>
                {selectedOrder?.status_label || selectedOrder?.state}
              </Text>
            </View>
          </View>

          {selectedOrder && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBody}
            >
              {/* Buyer Information Card */}
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>Customer / Buyer Information</Text>
                <View style={styles.buyerDetailRow}>
                  <View style={styles.detailIconWrap}>
                    <Icon name="building" size={20} color={colors.odooPurple} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.buyerDetailName}>{selectedOrder.buyer_company}</Text>
                    <Text style={styles.buyerDetailSub}>
                      Issued via Odoo 11 Purchase Management
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoGrid}>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.infoGridLabel}>Order Date</Text>
                    <Text style={styles.infoGridVal}>
                      {formatDate(selectedOrder.date_order)}
                    </Text>
                  </View>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.infoGridLabel}>Scheduled Date</Text>
                    <Text style={styles.infoGridVal}>
                      {formatDate(selectedOrder.date_planned) || 'Immediate'}
                    </Text>
                  </View>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.infoGridLabel}>Payment Status</Text>
                    <Text style={styles.infoGridVal}>Standard Terms</Text>
                  </View>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.infoGridLabel}>Currency</Text>
                    <Text style={styles.infoGridVal}>{selectedOrder.currency || 'INR'}</Text>
                  </View>
                </View>
              </View>

              {/* Line Items Table */}
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>
                  Ordered Line Items ({selectedOrder.lines?.length || 0})
                </Text>

                {selectedOrder.lines && selectedOrder.lines.length > 0 ? (
                  selectedOrder.lines.map((line, idx) => (
                    <View
                      key={line.id || idx}
                      style={[
                        styles.lineItemRow,
                        idx === selectedOrder.lines.length - 1 && styles.lineItemRowLast,
                      ]}
                    >
                      <View style={styles.lineItemMain}>
                        <Text style={styles.lineProductName}>{line.product_name}</Text>
                        {line.name && line.name !== line.product_name ? (
                          <Text style={styles.lineProductDesc}>{line.name}</Text>
                        ) : null}
                        <Text style={styles.linePricingCalc}>
                          {line.product_qty} {line.product_uom} × {formatCurrency(line.price_unit)}
                        </Text>
                      </View>
                      <View style={styles.lineItemRight}>
                        <Text style={styles.lineSubtotal}>
                          {formatCurrency(line.price_subtotal)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noLinesText}>No line item details found.</Text>
                )}

                <View style={styles.divider} />

                {/* Financial Summary */}
                <View style={styles.financeSummary}>
                  <View style={styles.financeRow}>
                    <Text style={styles.financeLabel}>Untaxed Subtotal:</Text>
                    <Text style={styles.financeVal}>
                      {formatCurrency(selectedOrder.amount_untaxed)}
                    </Text>
                  </View>
                  <View style={styles.financeRow}>
                    <Text style={styles.financeLabel}>Taxes:</Text>
                    <Text style={styles.financeVal}>
                      {formatCurrency(selectedOrder.amount_tax)}
                    </Text>
                  </View>
                  <View style={[styles.financeRow, styles.financeRowTotal]}>
                    <Text style={styles.financeTotalLabel}>Total Order Amount:</Text>
                    <Text style={styles.financeTotalVal}>
                      {formatCurrency(selectedOrder.amount_total)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Acknowledgment Status Section */}
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>Acknowledgment Status</Text>

                {selectedOrder.is_acknowledged ? (
                  <View style={styles.ackBoxDone}>
                    <View style={styles.ackDoneIcon}>
                      <Icon name="check" size={20} color={colors.success} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ackDoneTitle}>Order Successfully Acknowledged</Text>
                      <Text style={styles.ackDoneDate}>
                        Date: {formatDate(selectedOrder.acknowledged_at)}
                      </Text>
                      {selectedOrder.acknowledged_by_name ? (
                        <Text style={styles.ackDoneBy}>
                          Acknowledged by: {selectedOrder.acknowledged_by_name}
                        </Text>
                      ) : null}
                      {selectedOrder.acknowledgment_notes ? (
                        <Text style={styles.ackDoneNotes}>
                          Notes: "{selectedOrder.acknowledgment_notes}"
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View style={styles.ackBoxPending}>
                    <Text style={styles.ackPendingTitle}>Order Pending Acknowledgment</Text>
                    <Text style={styles.ackPendingDesc}>
                      Confirm to the buyer that you have received this purchase order and are
                      preparing the items for dispatch.
                    </Text>
                    <TouchableOpacity
                      style={styles.ackBigBtn}
                      onPress={() => {
                        setDetailModalVisible(false);
                        handleOpenAckModal(selectedOrder);
                      }}
                      activeOpacity={0.8}
                    >
                      <Icon name="check" size={16} color="#FFFFFF" />
                      <Text style={styles.ackBigBtnText}>Acknowledge This Order Now</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: ACKNOWLEDGE PROMPT WITH OPTIONAL REMARKS        */}
      {/* ========================================================= */}
      <Modal
        visible={ackModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setAckModalVisible(false)}
      >
        <View style={styles.ackModalOverlay}>
          <View style={styles.ackModalBox}>
            <View style={styles.ackModalHeader}>
              <View style={styles.ackModalIconCircle}>
                <Icon name="check" size={22} color={colors.odooPurple} />
              </View>
              <Text style={styles.ackModalTitle}>Acknowledge Sales Order</Text>
              <Text style={styles.ackModalSub}>
                {orderToAck?.so_number} • {orderToAck?.po_reference}
              </Text>
            </View>

            <View style={styles.ackModalBody}>
              <Text style={styles.ackModalPrompt}>
                Buyer:{' '}
                <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                  {orderToAck?.buyer_company}
                </Text>
              </Text>
              <Text style={styles.ackModalPrompt}>
                Order Value:{' '}
                <Text style={{ fontWeight: '700', color: colors.odooPurple }}>
                  {formatCurrency(orderToAck?.amount_total)}
                </Text>
              </Text>

              <Text style={styles.inputLabel}>Remarks / Dispatch Promise (Optional):</Text>
              <TextInput
                style={styles.ackInput}
                placeholder="e.g. Ready for dispatch by Thursday, batch QA verified"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                value={ackNotes}
                onChangeText={setAckNotes}
              />

              <Text style={styles.ackInfoNote}>
                ✔ This action will log a verified confirmation message in Odoo 11 chatter for the
                buyer company in real-time.
              </Text>
            </View>

            <View style={styles.ackModalActions}>
              <TouchableOpacity
                style={styles.ackCancelBtn}
                onPress={() => setAckModalVisible(false)}
                disabled={isSubmittingAck}
              >
                <Text style={styles.ackCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ackConfirmBtn, isSubmittingAck && styles.ackConfirmBtnDisabled]}
                onPress={handleConfirmAcknowledge}
                disabled={isSubmittingAck}
                activeOpacity={0.8}
              >
                {isSubmittingAck ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="check" size={14} color="#FFFFFF" />
                    <Text style={styles.ackConfirmText}>Confirm & Send</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    backgroundColor: colors.odooPurple,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.base,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    ...shadows.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    color: '#E0E7FF',
    marginTop: 2,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiScroll: {
    paddingRight: spacing.sm,
    gap: spacing.sm,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    minWidth: 140,
    ...shadows.sm,
  },
  kpiCardWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
  },
  kpiCardSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  kpiLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  kpiLabelWarning: {
    fontSize: fontSize.xs,
    color: '#B45309',
    fontWeight: fontWeight.semibold,
  },
  kpiLabelSuccess: {
    fontSize: fontSize.xs,
    color: '#065F46',
    fontWeight: fontWeight.semibold,
  },
  kpiValueMain: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
    marginVertical: 2,
  },
  kpiBadgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiBadgeCount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  kpiBadgeCountSuccess: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: '#059669',
  },
  kpiDotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  kpiSub: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 2,
  },
  controlsSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    backgroundColor: '#F8FAFC',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },
  chipsScroll: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.odooPurple,
    borderColor: colors.odooPurple,
  },
  filterChipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  listContainer: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.md,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.odooPurpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  emptyRefreshBtn: {
    backgroundColor: colors.odooPurple,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
  },
  emptyRefreshBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  soNumber: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
  poRefBadge: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  buyerName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  metaValue: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemsPreviewBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginVertical: 4,
  },
  itemPreviewLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemPreviewName: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
    paddingRight: 8,
  },
  itemPreviewQty: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  moreItemsText: {
    fontSize: 10,
    color: colors.odooPurple,
    fontStyle: 'italic',
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  totalAmount: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  ackSuccessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  ackSuccessText: {
    fontSize: fontSize.xs,
    color: '#065F46',
    fontWeight: fontWeight.semibold,
  },
  ackActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.odooPurple,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    gap: 6,
    ...shadows.xs,
  },
  ackActionBtnText: {
    fontSize: fontSize.xs,
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
  },
  viewDetailText: {
    fontSize: fontSize.xs,
    color: colors.odooPurple,
    fontWeight: fontWeight.semibold,
  },
  /* MODAL FULL STYLES */
  modalFullContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.odooPurple,
    paddingTop: spacing.xl,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  modalBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  modalHeaderSub: {
    fontSize: fontSize.xs,
    color: '#E0E7FF',
  },
  modalStateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  modalStateText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  modalBody: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  detailCardTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  buyerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.odooPurpleLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerDetailName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  buyerDetailSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  infoGridItem: {
    width: '45%',
  },
  infoGridLabel: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  infoGridVal: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  lineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  lineItemRowLast: {
    borderBottomWidth: 0,
  },
  lineItemMain: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  lineProductName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  lineProductDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  linePricingCalc: {
    fontSize: fontSize.xs,
    color: colors.odooPurple,
    marginTop: 4,
  },
  lineItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  lineSubtotal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  noLinesText: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
  financeSummary: {
    gap: 6,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  financeLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  financeVal: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  financeRowTotal: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  financeTotalLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  financeTotalVal: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
  ackBoxDone: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
  },
  ackDoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ackDoneTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#065F46',
  },
  ackDoneDate: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  ackDoneBy: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  ackDoneNotes: {
    fontSize: 11,
    color: '#065F46',
    fontStyle: 'italic',
    marginTop: 4,
  },
  ackBoxPending: {
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ackPendingTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#92400E',
    marginBottom: 4,
  },
  ackPendingDesc: {
    fontSize: fontSize.xs,
    color: '#78350F',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  ackBigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.odooPurple,
    borderRadius: borderRadius.lg,
    paddingVertical: 12,
    gap: 8,
  },
  ackBigBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  /* MODAL ACK PROMPT STYLES */
  ackModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.base,
  },
  ackModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    ...shadows.lg,
  },
  ackModalHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ackModalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.odooPurpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  ackModalTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  ackModalSub: {
    fontSize: fontSize.xs,
    color: colors.odooPurple,
    fontWeight: fontWeight.semibold,
    marginTop: 2,
  },
  ackModalBody: {
    gap: spacing.sm,
  },
  ackModalPrompt: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  inputLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  ackInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    height: 70,
  },
  ackInfoNote: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
    marginTop: 2,
  },
  ackModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  ackCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ackCancelText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  ackConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.odooPurple,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  ackConfirmBtnDisabled: {
    opacity: 0.6,
  },
  ackConfirmText: {
    fontSize: fontSize.xs,
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
});

