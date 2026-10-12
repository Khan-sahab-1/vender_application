import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Icon } from '../../../components/common/Icon';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './styles';
import { DashboardView } from './components/DashboardView';
import { ProductListView } from './components/ProductListView';
import { ProductDetailsView } from './components/ProductDetailsView';
import { StockOnHandView } from './components/StockOnHandView';
import { ReceiveStockView } from './components/ReceiveStockView';
import { DeliveryOrderView } from './components/DeliveryOrderView';
import { InternalTransferView } from './components/InternalTransferView';
import { StockMovementsView } from './components/StockMovementsView';
import { BarcodeScanView } from './components/BarcodeScanView';
import { MasterDataView } from './components/MasterDataView';

export const OdooInventoryScreen = () => {
  const { currentTenant, tenants, switchTenant, user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tenantModalVisible, setTenantModalVisible] = useState(false);

  const isRootScreen = currentScreen === 'dashboard';

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Inventory';
      case 'products':
        return 'Product Catalog';
      case 'product_details':
        return selectedProduct?.name || 'Product Details';
      case 'stock_on_hand':
        return 'Stock On Hand';
      case 'receive':
        return 'Receive Stock (PO)';
      case 'deliver':
        return 'Delivery Order (SO)';
      case 'transfer':
        return 'Internal Transfer';
      case 'movements':
        return 'Stock Movements';
      case 'scan':
        return 'Barcode Scanner';
      case 'uom_cat':
        return 'UoM Categories';
      case 'uom':
        return 'Units of Measure (UoM)';
      case 'prod_cat':
        return 'Product Categories';
      case 'warehouses':
        return 'Warehouses';
      case 'master_data':
        return 'Master Data';
      default:
        return 'Inventory';
    }
  };

  const handleBack = () => {
    if (currentScreen === 'stock_on_hand') {
      setCurrentScreen('product_details');
    } else if (currentScreen === 'product_details') {
      setCurrentScreen('products');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Account / User Info',
      `Signed in as ${user?.name || user?.email || 'User'}${currentTenant ? `\nTenant: ${currentTenant.name}` : ''}`,
      [
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getUserInitials = () => {
    if (!user) return 'OD';
    const displayName = user.name || user.email || user.username || '';
    if (!displayName) return 'OD';
    const parts = displayName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.safeContainer}>
      {/* Flagship Odoo Plum Header */}
      <View style={styles.odooHeader}>
        <View style={styles.headerLeft}>
          {!isRootScreen ? (
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.headerIconBtn}
              activeOpacity={0.7}
              onPress={() => tenants.length > 0 && setTenantModalVisible(true)}
            >
              <Icon name="menu" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.headerTitleCol}
            onPress={() => tenants.length > 0 && setTenantModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {getScreenTitle()}
            </Text>
            <Text style={styles.headerSubtitleText} numberOfLines={1}>
              {currentTenant ? `${currentTenant.name} (${currentTenant.code}) ▾` : `${user?.name || user?.email || 'Odoo 11'}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {/* Quick Barcode Scan Button */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setCurrentScreen('scan')}
            activeOpacity={0.7}
          >
            <Icon name="barcode" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* User Profile Avatar */}
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={handleLogoutPress}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Router View */}
      <View style={styles.contentContainer}>
        {currentScreen === 'dashboard' && (
          <DashboardView onNavigate={(dest) => setCurrentScreen(dest)} />
        )}

        {currentScreen === 'products' && (
          <ProductListView
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('product_details');
            }}
            onCreateProduct={() => setCurrentScreen('uom_cat')}
          />
        )}

        {currentScreen === 'product_details' && selectedProduct && (
          <ProductDetailsView
            product={selectedProduct}
            onViewStockOnHand={() => setCurrentScreen('stock_on_hand')}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'stock_on_hand' && selectedProduct && (
          <StockOnHandView
            product={selectedProduct}
            onAdjustStock={() => setCurrentScreen('receive')}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'receive' && (
          <ReceiveStockView onComplete={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'deliver' && (
          <DeliveryOrderView onComplete={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'transfer' && (
          <InternalTransferView onComplete={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'movements' && <StockMovementsView />}

        {currentScreen === 'scan' && (
          <BarcodeScanView
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('product_details');
            }}
          />
        )}

        {(currentScreen === 'uom_cat' ||
          currentScreen === 'uom' ||
          currentScreen === 'prod_cat' ||
          currentScreen === 'warehouses' ||
          currentScreen === 'master_data') && (
          <MasterDataView
            initialTab={
              currentScreen === 'master_data' ? 'uom_cat' : currentScreen
            }
            onProductCreated={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('product_details');
            }}
          />
        )}
      </View>

      {/* Multi-Tenant Switcher Modal */}
      <Modal visible={tenantModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Tenant Organization</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setTenantModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tenantList}>
              {tenants.map((t) => {
                const isSelected = currentTenant.id === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.tenantItem,
                      isSelected && styles.tenantItemActive,
                    ]}
                    onPress={() => {
                      switchTenant(t.id);
                      setTenantModalVisible(false);
                    }}
                  >
                    <View style={styles.tenantItemLeft}>
                      <Text style={styles.tenantItemName}>{t.name}</Text>
                      <Text style={styles.tenantItemBranch}>{t.branch}</Text>
                    </View>
                    <View style={styles.tenantItemCodeBadge}>
                      <Text style={styles.tenantItemCodeText}>{t.code}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

