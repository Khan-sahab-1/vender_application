import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export const Badge = ({
  label,
  variant = 'primary',
  icon,
  showDot = false,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, styles[variant], style]}>
      {showDot && <View style={[styles.dot, styles[`dot_${variant}`]]} />}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
        {label}
      </Text>
    </View>
  );
};

