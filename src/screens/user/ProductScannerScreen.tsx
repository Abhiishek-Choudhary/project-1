import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../contexts/ToastContext';
import { MOCK_SCANNER_PRODUCT } from '../../api/mockData';
import { formatCurrency } from '../../utils/format';
import type { UserStackParamList } from '../../types/navigation';

const CAMERA_BG =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=1200&fit=crop';

export function ProductScannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const scanLine = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    const timer = setTimeout(() => setScanned(true), 2500);
    return () => {
      anim.stop();
      clearTimeout(timer);
    };
  }, [scanLine]);

  const lineTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  const product = MOCK_SCANNER_PRODUCT;

  return (
    <View style={styles.container}>
      <Image source={{ uri: CAMERA_BG }} style={StyleSheet.absoluteFillObject} blurRadius={flashOn ? 0 : 1} />
      <View style={styles.dimOverlay} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.titlePill}>
            <Text style={styles.titleText}>Product Scanner</Text>
          </View>
          <Pressable style={styles.roundBtn} onPress={() => setFlashOn((v) => !v)}>
            <Ionicons name={flashOn ? 'flash' : 'flash-outline'} size={22} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: lineTranslate }] },
              ]}
            />
          </View>
          <View style={styles.statusPill}>
            <Ionicons name="scan" size={16} color={colors.primary} />
            <Text style={styles.statusText}>
              {scanned ? 'Product found!' : 'Scanning for products...'}
            </Text>
          </View>
        </View>

        {scanned && (
          <View style={[styles.resultCard, Shadows.floating, { backgroundColor: colors.surface }]}>
            <View style={styles.productRow}>
              <Image source={{ uri: product.imageUrl }} style={styles.productImg} />
              <View style={styles.productInfo}>
                <View style={styles.productTitleRow}>
                  <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={[styles.productPrice, { color: colors.primary }]}>
                    {formatCurrency(product.price)}
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{product.description}</Text>
              </View>
            </View>
            <View style={styles.resultActions}>
              <Pressable
                style={styles.addCartBtn}
                onPress={() => {
                  addToCart(product);
                  showToast('Added to cart', 'success');
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.addCartGradient}
                >
                  <Ionicons name="cart" size={20} color="#FFF" />
                  <Text style={styles.addCartText}>Add to Cart</Text>
                </LinearGradient>
              </Pressable>
              <Pressable
                style={[styles.infoBtn, { backgroundColor: colors.infoLight }]}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <Ionicons name="information" size={22} color={colors.infoText} />
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.hint}>Align barcode or product label within the frame</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  dimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  safe: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  titleText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  scanArea: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  scanFrame: {
    width: 280,
    height: 240,
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
    borderColor: '#4ADE80',
    overflow: 'hidden',
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  statusText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  resultCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  productRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  productImg: { width: 72, height: 72, borderRadius: BorderRadius.md },
  productInfo: { flex: 1 },
  productTitleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  productName: { fontSize: 16, fontWeight: '700', flex: 1 },
  productPrice: { fontSize: 17, fontWeight: '700' },
  resultActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  addCartBtn: { flex: 1 },
  addCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  addCartText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  infoBtn: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
});
