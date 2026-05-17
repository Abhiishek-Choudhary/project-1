import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { captureUserStackEntry } from './userNavigationHistory';
import { useNavigationHistoryStore } from '../store/navigationHistoryStore';
import type { UserStackParamList } from '../types/navigation';

/** Records customer stack routes for back / forward controls in the tab bar. */
export function NavigationHistoryTracker() {
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const pushEntry = useNavigationHistoryStore((s) => s.pushEntry);

  useEffect(() => {
    const sync = () => {
      const entry = captureUserStackEntry(navigation.getState());
      if (entry) pushEntry(entry);
    };

    sync();
    return navigation.addListener('state', sync);
  }, [navigation, pushEntry]);

  return null;
}
