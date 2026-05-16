import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/layout/AppHeader';
import { MOCK_ADDRESS } from '../../api/mockData';

const ADDRESSES = [MOCK_ADDRESS, { ...MOCK_ADDRESS, id: 'a2', line1: 'Work Office, Floor 3', isDefault: false }];

export function AddressListScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader showBack title="Saved Addresses" />
      <FlatList
        data={ADDRESSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardTop}>
              <Text style={[styles.label, { color: colors.primary }]}>{item.label}</Text>
              {item.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>Default</Text>
                </View>
              )}
            </View>
            <Text style={[styles.line1, { color: colors.text }]}>{item.line1}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.line2}</Text>
          </View>
        )}
        ListFooterComponent={
          <Pressable style={[styles.addBtn, { borderColor: colors.primary }]}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={[styles.addText, { color: colors.primary }]}>Add New Address</Text>
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { padding: Spacing.lg },
  card: { padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  label: { fontSize: 13, fontWeight: '700' },
  defaultBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  line1: { fontSize: 15, fontWeight: '600' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: Spacing.md,
  },
  addText: { fontSize: 15, fontWeight: '600' },
});
