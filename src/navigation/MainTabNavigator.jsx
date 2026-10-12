import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { TenantHeader } from '../components/navigation/TenantHeader';
import { BottomTabBar, TAB_KEYS } from '../components/navigation/BottomTabBar';
import { InventoryScreen } from '../screens/inventory';
import { ComingSoonScreen } from '../screens/common/ComingSoonScreen';

export const MainTabNavigator = () => {
  const [activeTab, setActiveTab] = useState(TAB_KEYS.INVENTORY);

  const isInventory = activeTab === TAB_KEYS.INVENTORY;

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case TAB_KEYS.INVENTORY:
        return <InventoryScreen />;
      case TAB_KEYS.SALE:
        return <ComingSoonScreen moduleKey="sale" />;
      case TAB_KEYS.PURCHASE:
        return <ComingSoonScreen moduleKey="purchase" />;
      case TAB_KEYS.ACCOUNTING:
        return <ComingSoonScreen moduleKey="accounting" />;
      default:
        return <InventoryScreen />;
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeContainer, isInventory && styles.safeContainerOdoo]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={isInventory ? 'light-content' : 'dark-content'}
        backgroundColor={isInventory ? colors.odooPurple : '#FFFFFF'}
      />

      {/* Multi-Tenant Top Header for non-inventory tabs */}
      {!isInventory && <TenantHeader />}

      {/* Current Screen Content */}
      <View style={styles.contentContainer}>{renderCurrentScreen()}</View>

      {/* Bottom Tab Bar with 4 Tabs */}
      <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeContainerOdoo: {
    backgroundColor: colors.odooPurple,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
