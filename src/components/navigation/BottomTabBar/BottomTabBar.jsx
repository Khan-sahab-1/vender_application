import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { colors } from '../../../constants/colors';
import { Icon } from '../../common/Icon';

export const TAB_KEYS = {
  INVENTORY: 'inventory',
  SALE: 'sale',
  PURCHASE: 'purchase',
  ACCOUNTING: 'accounting',
};

const TABS = [
  {
    key: TAB_KEYS.INVENTORY,
    label: 'Inventory',
    icon: 'inventory',
    isLive: true,
  },
  {
    key: TAB_KEYS.SALE,
    label: 'Sale',
    icon: 'sale',
    isLive: false,
  },
  {
    key: TAB_KEYS.PURCHASE,
    label: 'Purchase',
    icon: 'purchase',
    isLive: false,
  },
  {
    key: TAB_KEYS.ACCOUNTING,
    label: 'Accounting',
    icon: 'accounting',
    isLive: false,
  },
];

export const BottomTabBar = ({ activeTab, onSelectTab }) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const iconColor = isActive ? colors.primary : colors.textSecondary;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onSelectTab(tab.key)}
          >
            {isActive && <View style={styles.activeIndicator} />}

            <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
              <Icon name={tab.icon} size={20} color={iconColor} />
            </View>

            <Text
              style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>

            {!tab.isLive && (
              <View style={styles.comingSoonPill}>
                <Text style={styles.comingSoonPillText}>Soon</Text>
              </View>
            )}

            {tab.isLive && isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

