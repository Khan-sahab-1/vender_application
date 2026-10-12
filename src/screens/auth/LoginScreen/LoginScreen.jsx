import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { colors } from '../../../constants/colors';
import { Input, Button, Icon } from '../../../components/common';
import { validateLoginForm } from '../../../utils/validation';
import { useAuth } from '../../../context';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const { isValid, errors: validationErrors } = validateLoginForm(email, password);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      const errorMsg =
        err?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMsg);
      console.log('Login error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBadge}>
              <Icon name="inventory" size={32} color="#FFFFFF" />
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>Vendor</Text>
              <Text style={[styles.brandTitle, styles.brandTitleAccent]}>App</Text>
            </View>

            <Text style={styles.brandSubtitle}>
              Sign in to manage your inventory
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Email Input */}
            <Input
              label="Email"
              required
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              error={errors.email}
              leftIcon={<Icon name="mail" size={18} color={colors.odooPurple} />}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* Password Input */}
            <Input
              label="Password"
              required
              placeholder="Enter password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              error={errors.password}
              isPassword
              leftIcon={<Icon name="lock" size={18} color={colors.odooPurple} />}
            />

            {/* Sign In Button */}
            <View style={styles.buttonWrapper}>
              <Button
                title="Sign In"
                variant="primary"
                size="lg"
                loading={isLoading}
                onPress={handleLogin}
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
