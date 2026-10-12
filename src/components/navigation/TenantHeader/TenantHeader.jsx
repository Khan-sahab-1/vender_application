import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { styles } from './styles';
import { colors } from '../../../constants/colors';
import { Icon } from '../../common/Icon';
import { useAuth } from '../../../context/AuthContext';

export const TenantHeader = () => {
  const { currentTenant, tenants, switchTenant, logout } = useAuth();
  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Do you want to switch to the login screen?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.tenantInfoLeft}
          activeOpacity={0.7}
          onPress={() => setIsSwitcherVisible(true)}
        >
          <View style={styles.tenantLogoBox}>
            <Icon name="building" size={22} color={colors.primary} />
          </View>

          <View style={styles.tenantTextContainer}>
            <View style={styles.tenantBadgeRow}>
              <Text style={styles.tenantLabel}>Tenant Org</Text>
              <View style={styles.tenantCodeBadge}>
                <Text style={styles.tenantCodeText}>{currentTenant?.code || 'ORG'}</Text>
              </View>
            </View>

            <View style={styles.tenantSwitcherButton}>
              <Text style={styles.tenantName} numberOfLines={1}>
                {currentTenant?.name || 'My Organization'}
              </Text>
              <Icon name="chevron-down" size={14} color={colors.textSecondary} />
            </View>
            <Text style={styles.branchSubtitle} numberOfLines={1}>
              {currentTenant?.branch || ''}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Right action buttons: Notification and Logout */}
        <View style={styles.actionsRight}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Notifications', 'No unread system alerts.')}
          >
            <Icon name="bell" size={17} color={colors.textPrimary} />
            <View style={styles.activeIndicatorDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Icon name="logout" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tenant Switcher Modal */}
      <Modal
        visible={isSwitcherVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSwitcherVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsSwitcherVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Switch Tenant Branch</Text>
                  <TouchableOpacity onPress={() => setIsSwitcherVisible(false)}>
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>
                  Select which tenant branch you want to operate in:
                </Text>

                {tenants.map((t) => {
                  const isActive = t.id === currentTenant.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.tenantItem, isActive && styles.tenantItemActive]}
                      activeOpacity={0.7}
                      onPress={() => {
                        switchTenant(t.id);
                        setIsSwitcherVisible(false);
                      }}
                    >
                      <View>
                        <Text
                          style={[
                            styles.tenantItemTitle,
                            isActive && { color: colors.primary },
                          ]}
                        >
                          {t.name} [{t.code}]
                        </Text>
                        <Text style={styles.tenantItemBranch}>{t.branch}</Text>
                      </View>
                      {isActive && <Icon name="check" size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
