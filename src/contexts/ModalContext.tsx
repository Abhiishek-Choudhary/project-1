import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BorderRadius, Spacing } from '../constants/theme';
import { useTheme } from './ThemeContext';
import { Button } from '../components/ui/Button';

interface ModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const { colors } = useTheme();

  const showModal = useCallback((c: ModalConfig) => setConfig(c), []);
  const hideModal = useCallback(() => setConfig(null), []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal visible={!!config} transparent animationType="fade" onRequestClose={hideModal}>
        <Pressable style={styles.overlay} onPress={hideModal}>
          <Pressable
            style={[styles.content, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            {config && (
              <>
                <Text style={[styles.title, { color: colors.text }]}>{config.title}</Text>
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  {config.message}
                </Text>
                <View style={styles.actions}>
                  {config.cancelText && (
                    <Button
                      title={config.cancelText}
                      variant="outline"
                      onPress={hideModal}
                      style={styles.btn}
                    />
                  )}
                  <Button
                    title={config.confirmText ?? 'OK'}
                    onPress={() => {
                      config.onConfirm?.();
                      hideModal();
                    }}
                    style={styles.btn}
                  />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  content: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.sm },
  message: { fontSize: 15, lineHeight: 22, marginBottom: Spacing.xl },
  actions: { flexDirection: 'row', gap: Spacing.md },
  btn: { flex: 1 },
});
