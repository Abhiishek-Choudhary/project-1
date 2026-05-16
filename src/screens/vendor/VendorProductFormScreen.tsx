import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { MOCK_VENDOR_PRODUCTS } from '../../api/mockData';
import type { VendorStackParamList } from '../../types/navigation';

export function VendorProductFormScreen() {
  const route = useRoute<RouteProp<VendorStackParamList, 'VendorProductForm'>>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const existing = MOCK_VENDOR_PRODUCTS.find((p) => p.id === route.params?.productId);

  const [name, setName] = useState(existing?.name ?? '');
  const [price, setPrice] = useState(String(existing?.price ?? ''));
  const [stock, setStock] = useState(String(existing?.stockCount ?? ''));

  const handleSave = () => {
    showToast(existing ? 'Product updated' : 'Product created', 'success');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader showBack title={existing ? 'Edit Product' : 'Add Product'} />
      <ScrollView contentContainerStyle={styles.form}>
        <Input label="Product Name" value={name} onChangeText={setName} />
        <Input label="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
        <Input label="Stock Count" value={stock} onChangeText={setStock} keyboardType="number-pad" />
        <Button title="Save Product" onPress={handleSave} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  form: { padding: Spacing.lg },
});
