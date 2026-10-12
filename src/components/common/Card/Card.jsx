import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export const Card = ({
  children,
  style,
  variant = 'elevated',
  padding = 'lg',
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`padding_${padding}`],
        style,
      ]}
    >
      {children}
    </View>
  );
};

