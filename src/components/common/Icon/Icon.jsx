/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Icon = ({
  name,
  size = 20,
  color = '#4F46E5',
  style,
}) => {
  const renderIconContent = () => {
    switch (name) {
      case 'inventory':
      case 'box':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            {/* Box Lid */}
            <View
              style={{
                width: size * 0.85,
                height: size * 0.22,
                backgroundColor: color,
                borderRadius: 2,
                marginBottom: 1,
              }}
            />
            {/* Box Body */}
            <View
              style={{
                width: size * 0.78,
                height: size * 0.52,
                borderWidth: 1.8,
                borderColor: color,
                borderTopWidth: 0,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Tape seal */}
              <View
                style={{
                  width: size * 0.22,
                  height: size * 0.28,
                  backgroundColor: color,
                  borderRadius: 1,
                }}
              />
            </View>
          </View>
        );

      case 'layers':
      case 'category':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.7,
                height: 3,
                backgroundColor: color,
                borderRadius: 1.5,
                marginBottom: 3,
              }}
            />
            <View
              style={{
                width: size * 0.85,
                height: 3,
                backgroundColor: color,
                borderRadius: 1.5,
                marginBottom: 3,
              }}
            />
            <View
              style={{
                width: size * 0.6,
                height: 3,
                backgroundColor: color,
                borderRadius: 1.5,
              }}
            />
          </View>
        );

      case 'scale':
      case 'uom':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.8,
                height: 2,
                backgroundColor: color,
                marginBottom: 2,
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: size * 0.8 }}>
              <View
                style={{
                  width: size * 0.3,
                  height: size * 0.25,
                  borderWidth: 1.5,
                  borderColor: color,
                  borderTopWidth: 0,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
              <View
                style={{
                  width: size * 0.3,
                  height: size * 0.25,
                  borderWidth: 1.5,
                  borderColor: color,
                  borderTopWidth: 0,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                }}
              />
            </View>
          </View>
        );

      case 'map-pin':
      case 'warehouse-pin':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.55,
                height: size * 0.55,
                borderRadius: size * 0.28,
                borderWidth: 1.8,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.18,
                  height: size * 0.18,
                  borderRadius: size * 0.09,
                  backgroundColor: color,
                }}
              />
            </View>
            <View
              style={{
                width: 2,
                height: size * 0.25,
                backgroundColor: color,
                marginTop: -1,
              }}
            />
          </View>
        );

      case 'home':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            {/* Roof */}
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderLeftWidth: size * 0.45,
                borderRightWidth: size * 0.45,
                borderBottomWidth: size * 0.38,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: color,
              }}
            />
            {/* Base */}
            <View
              style={{
                width: size * 0.65,
                height: size * 0.42,
                borderWidth: 1.8,
                borderTopWidth: 0,
                borderColor: color,
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 2,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <View
                style={{
                  width: size * 0.22,
                  height: size * 0.24,
                  backgroundColor: color,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              />
            </View>
          </View>
        );

      case 'operations':
      case 'truck-fast':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.8,
                height: size * 0.5,
                borderRadius: 3,
                borderWidth: 1.8,
                borderColor: color,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ width: 2, height: size * 0.3, backgroundColor: color }} />
              <View style={{ width: 2, height: size * 0.3, backgroundColor: color }} />
            </View>
          </View>
        );

      case 'receive':
      case 'inbox-in':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.8,
                height: size * 0.4,
                borderWidth: 1.8,
                borderTopWidth: 0,
                borderColor: color,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                position: 'absolute',
                bottom: 2,
              }}
            />
            <View
              style={{
                width: 2,
                height: size * 0.45,
                backgroundColor: color,
                position: 'absolute',
                top: 2,
              }}
            />
            <View
              style={{
                width: size * 0.3,
                height: size * 0.3,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
                top: size * 0.22,
              }}
            />
          </View>
        );

      case 'deliver':
      case 'inbox-out':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.8,
                height: size * 0.4,
                borderWidth: 1.8,
                borderTopWidth: 0,
                borderColor: color,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                position: 'absolute',
                bottom: 2,
              }}
            />
            <View
              style={{
                width: 2,
                height: size * 0.45,
                backgroundColor: color,
                position: 'absolute',
                top: size * 0.15,
              }}
            />
            <View
              style={{
                width: size * 0.3,
                height: size * 0.3,
                borderTopWidth: 2,
                borderLeftWidth: 2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
                position: 'absolute',
                top: 2,
              }}
            />
          </View>
        );

      case 'transfer':
      case 'repeat':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.75,
                height: 2,
                backgroundColor: color,
                marginBottom: 4,
              }}
            />
            <View
              style={{
                width: size * 0.75,
                height: 2,
                backgroundColor: color,
              }}
            />
          </View>
        );

      case 'barcode':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                height: size * 0.7,
              }}
            >
              <View style={{ width: 2, height: size * 0.7, backgroundColor: color }} />
              <View style={{ width: 1, height: size * 0.7, backgroundColor: color }} />
              <View style={{ width: 3, height: size * 0.7, backgroundColor: color }} />
              <View style={{ width: 1.5, height: size * 0.7, backgroundColor: color }} />
              <View style={{ width: 2, height: size * 0.7, backgroundColor: color }} />
              <View style={{ width: 1, height: size * 0.7, backgroundColor: color }} />
            </View>
          </View>
        );

      case 'arrow-left':
      case 'back':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.35,
                height: size * 0.35,
                borderLeftWidth: 2.2,
                borderBottomWidth: 2.2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
              }}
            />
          </View>
        );

      case 'dots-vertical':
      case 'more':
        return (
          <View style={[styles.center, { width: size, height: size, gap: 3 }]}>
            <View style={{ width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
            <View style={{ width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
            <View style={{ width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
          </View>
        );

      case 'menu':
        return (
          <View style={[styles.center, { width: size, height: size, gap: 3.5 }]}>
            <View style={{ width: size * 0.75, height: 2, borderRadius: 1, backgroundColor: color }} />
            <View style={{ width: size * 0.75, height: 2, borderRadius: 1, backgroundColor: color }} />
            <View style={{ width: size * 0.75, height: 2, borderRadius: 1, backgroundColor: color }} />
          </View>
        );

      case 'sale':
      case 'trending-up':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            {/* Price tag shape with hole */}
            <View
              style={{
                width: size * 0.75,
                height: size * 0.75,
                borderWidth: 1.8,
                borderColor: color,
                borderRadius: 3,
                transform: [{ rotate: '45deg' }],
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: 2,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        );

      case 'purchase':
      case 'truck':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            {/* Truck container */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <View
                style={{
                  width: size * 0.52,
                  height: size * 0.45,
                  backgroundColor: color,
                  borderRadius: 2,
                }}
              />
              <View
                style={{
                  width: size * 0.28,
                  height: size * 0.32,
                  borderWidth: 1.8,
                  borderColor: color,
                  borderLeftWidth: 0,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 2,
                }}
              />
            </View>
            {/* Wheels */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: size * 0.65,
                marginTop: -2,
              }}
            >
              <View
                style={{
                  width: size * 0.2,
                  height: size * 0.2,
                  borderRadius: size * 0.1,
                  backgroundColor: color,
                }}
              />
              <View
                style={{
                  width: size * 0.2,
                  height: size * 0.2,
                  borderRadius: size * 0.1,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        );

      case 'accounting':
      case 'calculator':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            {/* Calculator frame */}
            <View
              style={{
                width: size * 0.75,
                height: size * 0.88,
                borderRadius: 4,
                borderWidth: 1.8,
                borderColor: color,
                padding: 2,
                alignItems: 'center',
              }}
            >
              {/* Screen */}
              <View
                style={{
                  width: '90%',
                  height: size * 0.18,
                  backgroundColor: color,
                  borderRadius: 1,
                  marginBottom: 3,
                }}
              />
              {/* 4 buttons grid */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '90%',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <View style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: color }} />
                <View style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: color }} />
                <View style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: color }} />
                <View style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: color }} />
              </View>
            </View>
          </View>
        );

      case 'building':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.7,
                height: size * 0.82,
                borderWidth: 1.8,
                borderColor: color,
                borderRadius: 2,
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingVertical: 2,
              }}
            >
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <View style={{ width: 3, height: 3, backgroundColor: color }} />
                <View style={{ width: 3, height: 3, backgroundColor: color }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <View style={{ width: 3, height: 3, backgroundColor: color }} />
                <View style={{ width: 3, height: 3, backgroundColor: color }} />
              </View>
              <View style={{ width: 4, height: 5, backgroundColor: color }} />
            </View>
          </View>
        );

      case 'search':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.58,
                height: size * 0.58,
                borderRadius: size * 0.29,
                borderWidth: 1.8,
                borderColor: color,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: 2,
                height: size * 0.35,
                backgroundColor: color,
                transform: [{ rotate: '-45deg' }, { translateY: size * 0.3 }],
                borderRadius: 1,
              }}
            />
          </View>
        );

      case 'filter':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.8,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
                marginBottom: 3,
              }}
            />
            <View
              style={{
                width: size * 0.55,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
                marginBottom: 3,
              }}
            />
            <View
              style={{
                width: size * 0.3,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          </View>
        );

      case 'plus':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                position: 'absolute',
                width: size * 0.7,
                height: 2.2,
                backgroundColor: color,
                borderRadius: 1.5,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: 2.2,
                height: size * 0.7,
                backgroundColor: color,
                borderRadius: 1.5,
              }}
            />
          </View>
        );

      case 'minus':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.7,
                height: 2.2,
                backgroundColor: color,
                borderRadius: 1.5,
              }}
            />
          </View>
        );

      case 'chevron-down':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.4,
                height: size * 0.4,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderColor: color,
                transform: [{ rotate: '45deg' }, { translateY: -2 }],
              }}
            />
          </View>
        );

      case 'logout':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.55,
                height: size * 0.75,
                borderWidth: 1.8,
                borderRightWidth: 0,
                borderColor: color,
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: 3,
                justifyContent: 'center',
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 1,
                width: size * 0.35,
                height: size * 0.35,
                borderTopWidth: 2,
                borderRightWidth: 2,
                borderColor: color,
                transform: [{ rotate: '45deg' }],
              }}
            />
          </View>
        );

      case 'bell':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            {/* Bell dome */}
            <View
              style={{
                width: size * 0.65,
                height: size * 0.65,
                borderWidth: 1.8,
                borderColor: color,
                borderTopLeftRadius: size * 0.35,
                borderTopRightRadius: size * 0.35,
              }}
            />
            {/* Clapper */}
            <View
              style={{
                width: size * 0.2,
                height: 3,
                backgroundColor: color,
                borderRadius: 1.5,
                marginTop: 1,
              }}
            />
          </View>
        );

      case 'mail':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.9,
                height: size * 0.65,
                borderRadius: size * 0.12,
                borderWidth: 1.8,
                borderColor: color,
                overflow: 'hidden',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.65,
                  height: size * 0.65,
                  borderTopWidth: 1.8,
                  borderRightWidth: 1.8,
                  borderColor: color,
                  transform: [{ rotate: '45deg' }, { translateY: -size * 0.2 }],
                }}
              />
            </View>
          </View>
        );

      case 'lock':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.5,
                height: size * 0.45,
                borderWidth: 1.8,
                borderBottomWidth: 0,
                borderColor: color,
                borderTopLeftRadius: size * 0.25,
                borderTopRightRadius: size * 0.25,
                marginBottom: -1,
              }}
            />
            <View
              style={{
                width: size * 0.8,
                height: size * 0.52,
                backgroundColor: color,
                borderRadius: size * 0.12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.16,
                  height: size * 0.16,
                  borderRadius: size * 0.08,
                  backgroundColor: '#FFFFFF',
                }}
              />
              <View
                style={{
                  width: size * 0.08,
                  height: size * 0.12,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 1,
                  marginTop: -1,
                }}
              />
            </View>
          </View>
        );

      case 'eye':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.9,
                height: size * 0.55,
                borderRadius: size * 0.4,
                borderWidth: 1.8,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.26,
                  height: size * 0.26,
                  borderRadius: size * 0.13,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        );

      case 'eye-off':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.9,
                height: size * 0.55,
                borderRadius: size * 0.4,
                borderWidth: 1.8,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  borderRadius: size * 0.11,
                  backgroundColor: color,
                }}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                width: size * 0.95,
                height: 1.8,
                backgroundColor: color,
                transform: [{ rotate: '-45deg' }],
                borderRadius: 1,
              }}
            />
          </View>
        );

      case 'store':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.85,
                height: size * 0.24,
                backgroundColor: color,
                borderTopLeftRadius: size * 0.1,
                borderTopRightRadius: size * 0.1,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
              }}
            />
            <View
              style={{
                width: size * 0.76,
                height: size * 0.46,
                borderWidth: 1.8,
                borderTopWidth: 0,
                borderColor: color,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <View
                style={{
                  width: size * 0.28,
                  height: size * 0.28,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        );

      case 'shield':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.78,
                height: size * 0.82,
                borderWidth: 1.8,
                borderColor: color,
                borderTopLeftRadius: size * 0.38,
                borderTopRightRadius: size * 0.38,
                borderBottomLeftRadius: size * 0.42,
                borderBottomRightRadius: size * 0.42,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.2,
                  height: size * 0.32,
                  borderBottomWidth: 1.8,
                  borderRightWidth: 1.8,
                  borderColor: color,
                  transform: [{ rotate: '45deg' }, { translateY: -1 }],
                }}
              />
            </View>
          </View>
        );

      case 'fingerprint':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.8,
                height: size * 0.85,
                borderRadius: size * 0.4,
                borderWidth: 1.8,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.45,
                  height: size * 0.5,
                  borderRadius: size * 0.25,
                  borderWidth: 1.5,
                  borderColor: color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: size * 0.15,
                    height: size * 0.2,
                    borderRadius: size * 0.1,
                    backgroundColor: color,
                  }}
                />
              </View>
            </View>
          </View>
        );

      case 'google':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.85,
                height: size * 0.85,
                borderRadius: (size * 0.85) / 2,
                borderWidth: 2,
                borderColor: '#EA4335',
                borderRightColor: '#4285F4',
                borderBottomColor: '#FBBC05',
                borderLeftColor: '#34A853',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: size * 0.35,
                  height: 2,
                  backgroundColor: '#4285F4',
                  alignSelf: 'flex-end',
                  marginRight: 2,
                }}
              />
            </View>
          </View>
        );

      case 'apple':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.18,
                height: size * 0.22,
                borderRadius: size * 0.1,
                borderTopRightRadius: 0,
                backgroundColor: color,
                alignSelf: 'center',
                transform: [{ rotate: '25deg' }],
                marginBottom: -1,
              }}
            />
            <View
              style={{
                width: size * 0.65,
                height: size * 0.65,
                borderRadius: size * 0.32,
                backgroundColor: color,
              }}
            />
          </View>
        );

      case 'arrow-right':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.38,
                height: size * 0.38,
                borderTopWidth: 2.2,
                borderRightWidth: 2.2,
                borderColor: color,
                transform: [{ rotate: '45deg' }, { translateX: -1 }],
              }}
            />
          </View>
        );

      case 'check':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.35,
                height: size * 0.65,
                borderBottomWidth: 2.2,
                borderRightWidth: 2.2,
                borderColor: color,
                transform: [{ rotate: '45deg' }, { translateY: -1 }],
              }}
            />
          </View>
        );

      case 'sparkle':
        return (
          <View style={[styles.center, { width: size, height: size }]}>
            <View
              style={{
                width: size * 0.55,
                height: size * 0.55,
                backgroundColor: color,
                transform: [{ rotate: '45deg' }],
                borderRadius: 2,
              }}
            />
          </View>
        );

      default:
        return <View style={{ width: size, height: size }} />;
    }
  };

  return <View style={[styles.container, style]}>{renderIconContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
