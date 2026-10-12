import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { styles } from './styles';
import { colors } from '../../../constants/colors';
import { Icon } from '../../../components/common/Icon';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';

const MODULE_CONFIG = {
  sale: {
    title: 'Sales & Billing Module',
    subtitle: 'Point of Sale (POS), GST invoicing, and real-time customer billing.',
    icon: 'sale',
    badge: 'Under Active Development',
    features: [
      'Touchscreen Point-of-Sale (POS) terminal',
      'Instant thermal invoice printing & PDF billing',
      'Barcode & QR code scanner integration',
      'Daily register cash-in & cash-out reconciliation',
    ],
  },
  purchase: {
    title: 'Purchase & Vendor Orders',
    subtitle: 'Supplier management, Purchase Orders (PO), and Goods Receipt Notes (GRN).',
    icon: 'purchase',
    badge: 'Phase 2 Pipeline',
    features: [
      'Automated reorder triggers for low stock',
      'Supplier price comparisons & catalog tracking',
      'Goods Receipt Notes (GRN) quality check',
      'Multi-vendor payment milestone tracking',
    ],
  },
  accounting: {
    title: 'Accounting & Ledger',
    subtitle: 'Financial statements, tax compliance, ledger entries & profit analytics.',
    icon: 'accounting',
    badge: 'Phase 3 Pipeline',
    features: [
      'Automated Double-entry general ledger',
      'Real-time Profit & Loss (P&L) statements',
      'Balance Sheet & cash-flow forecast',
      'GST / VAT tax return exports',
    ],
  },
};

export const ComingSoonScreen = ({ moduleKey = 'sale' }) => {
  const { currentTenant } = useAuth();
  const [isNotified, setIsNotified] = useState(false);
  const config = MODULE_CONFIG[moduleKey] || MODULE_CONFIG.sale;

  const handleNotify = () => {
    setIsNotified(true);
    Alert.alert(
      'Notification Saved',
      `You will be notified as soon as ${config.title} is deployed for tenant ${currentTenant.name}.`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconHalo}>
          <Icon name={config.icon} size={38} color={colors.primary} />
        </View>

        <View style={styles.statusBadge}>
          <Badge label={config.badge} variant="warning" showDot />
        </View>

        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.subtitle}</Text>

        <View style={styles.featureListContainer}>
          <Text style={styles.featureListTitle}>Upcoming Capabilities</Text>
          {config.features.map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View style={styles.checkBullet}>
                <Icon name="check" size={10} color="#15803D" />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <Button
          title={isNotified ? '✓ Notification Enabled' : 'Notify Me Upon Launch'}
          variant={isNotified ? 'secondary' : 'primary'}
          size="md"
          onPress={handleNotify}
          disabled={isNotified}
        />

        <Text style={styles.tenantNote}>
          Targeted rollout for Tenant: {currentTenant.name} ({currentTenant.code})
        </Text>
      </View>
    </View>
  );
};

