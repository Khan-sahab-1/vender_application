import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { fontSize, fontWeight } from '../../../../constants/typography';
import { shadows } from '../../../../constants/shadows';
import { Icon } from '../../../../components/common/Icon';
import { Button } from '../../../../components/common/Button';
import { useInventory } from '../../../../context/InventoryContext';

export const BarcodeScanView = ({ onSelectProduct, embedded = false }) => {
  const { products } = useInventory();

  // Currently scanned item (default to first product)
  const [scannedProduct, setScannedProduct] = useState(products[0] || null);
  const [manualCode, setManualCode] = useState('');
  const [torchActive, setTorchActive] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState('Align barcode within the target frame');

  const handleSimulateScan = (product) => {
    setScannedProduct(product);
    setScanStatusMessage(`Scanned: ${product.name} (${product.barcode})`);
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) return;
    const found = products.find(
      (p) =>
        p.barcode.toLowerCase() === manualCode.trim().toLowerCase() ||
        p.sku.toLowerCase() === manualCode.trim().toLowerCase()
    );
    if (found) {
      setScannedProduct(found);
      setScanStatusMessage(`Found: ${found.name}`);
    } else {
      setScanStatusMessage(`No product found for "${manualCode}"`);
    }
  };

  const ContainerWrapper = embedded ? View : ScrollView;
  const containerProps = embedded
    ? { style: styles.embeddedContainer }
    : { showsVerticalScrollIndicator: false, contentContainerStyle: styles.container };

  return (
    <ContainerWrapper {...containerProps}>
      {/* Viewfinder Camera Simulation */}
      <View style={styles.viewfinderCard}>
        {/* Camera Simulation Background */}
        <View style={styles.cameraBackground}>
          {/* Target Reticle Frame */}
          <View style={styles.targetFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Laser Scanning Line */}
            <View style={styles.laserLine} />
          </View>

          {/* Torch and Frame Overlay Controls */}
          <View style={styles.overlayControls}>
            <TouchableOpacity
              style={[styles.torchBtn, torchActive && styles.torchBtnActive]}
              onPress={() => setTorchActive(!torchActive)}
              activeOpacity={0.7}
            >
              <Icon
                name="barcode"
                size={18}
                color={torchActive ? colors.odooPurple : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.torchText,
                  torchActive && styles.torchTextActive,
                ]}
              >
                {torchActive ? 'Torch ON' : 'Torch OFF'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.viewfinderHint}>{scanStatusMessage}</Text>
        </View>
      </View>

      {/* Manual Input Barcode Fallback */}
      <View style={styles.manualSearchCard}>
        <TextInput
          style={styles.manualInput}
          placeholder="Enter Barcode / SKU manually..."
          placeholderTextColor={colors.textTertiary}
          value={manualCode}
          onChangeText={setManualCode}
          onSubmitEditing={handleManualSearch}
        />
        <TouchableOpacity
          style={styles.manualSearchBtn}
          onPress={handleManualSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.manualSearchBtnText}>Look Up</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Barcode Simulator Chips */}
      <View style={styles.simulatorSection}>
        <Text style={styles.simulatorTitle}>Test Barcodes in Database:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.simulatorChips}
        >
          {products.map((p) => {
            const isSelected = scannedProduct?.id === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.simChip,
                  isSelected && styles.simChipActive,
                ]}
                onPress={() => handleSimulateScan(p)}
              >
                <Icon
                  name="barcode"
                  size={12}
                  color={isSelected ? '#FFFFFF' : colors.odooPurple}
                />
                <Text
                  style={[
                    styles.simChipText,
                    isSelected && styles.simChipTextActive,
                  ]}
                >
                  {p.barcode} ({p.name})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scanned Result Card */}
      {scannedProduct && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTag}>
              <Icon name="check" size={12} color="#16A34A" />
              <Text style={styles.resultTagText}>MATCH FOUND</Text>
            </View>
            <Text style={styles.barcodeNum}>{scannedProduct.barcode}</Text>
          </View>

          <Text style={styles.productName}>{scannedProduct.name}</Text>
          <Text style={styles.productSku}>
            SKU: {scannedProduct.sku} • {scannedProduct.category}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>On Hand</Text>
              <Text style={styles.statValue}>
                {scannedProduct.stock} {scannedProduct.uom}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Available</Text>
              <Text style={styles.statValue}>
                {scannedProduct.available} {scannedProduct.uom}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Location</Text>
              <Text style={styles.statValueLocation} numberOfLines={1}>
                {scannedProduct.shelfLocation || 'Aisle 1'}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <Button
              title="View Product Details"
              variant="primary"
              onPress={() => onSelectProduct && onSelectProduct(scannedProduct)}
              fullWidth
            />
          </View>
        </View>
      )}
    </ContainerWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    gap: spacing.base,
    paddingBottom: spacing.xl * 2,
  },
  embeddedContainer: {
    gap: spacing.base,
    paddingVertical: spacing.xs,
  },
  viewfinderCard: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cameraBackground: {
    height: 220,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  targetFrame: {
    width: 200,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#38BDF8',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserLine: {
    width: '90%',
    height: 2,
    backgroundColor: '#EF4444',
    ...shadows.sm,
  },
  overlayControls: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  torchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  torchBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  torchText: {
    fontSize: fontSize.xs - 1,
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  torchTextActive: {
    color: colors.odooPurple,
  },
  viewfinderHint: {
    position: 'absolute',
    bottom: 12,
    fontSize: fontSize.xs,
    color: '#94A3B8',
  },
  manualSearchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    ...shadows.sm,
  },
  manualInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  manualSearchBtn: {
    backgroundColor: colors.odooPurple,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  manualSearchBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  simulatorSection: {
    gap: spacing.xs,
  },
  simulatorTitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  simulatorChips: {
    gap: spacing.xs,
  },
  simChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  simChipActive: {
    backgroundColor: colors.odooPurple,
    borderColor: colors.odooPurple,
  },
  simChipText: {
    fontSize: fontSize.xs - 1,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  simChipTextActive: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  resultTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.round,
  },
  resultTagText: {
    fontSize: fontSize.xs - 2,
    fontWeight: fontWeight.bold,
    color: '#16A34A',
  },
  barcodeNum: {
    fontSize: fontSize.xs,
    fontFamily: 'monospace',
    color: colors.textSecondary,
  },
  productName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  productSku: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: fontSize.xs - 2,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statValueLocation: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.odooPurple,
  },
  resultActions: {
    marginTop: spacing.xs,
  },
});

