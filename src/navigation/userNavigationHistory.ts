import type { NavigationState, PartialState } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavHistoryEntry } from '../store/navigationHistoryStore';
import type { Product } from '../types/index';
import type { UserStackParamList } from '../types/navigation';

function entryKey(screen: string, params?: unknown): string {
  if (screen === 'MainTabs' && params && typeof params === 'object' && 'screen' in params) {
    return `MainTabs-${String((params as { screen: string }).screen)}`;
  }
  if (params && typeof params === 'object') {
    if ('product' in params && params.product && typeof params.product === 'object') {
      return `${screen}-${(params.product as Product).id}`;
    }
    if ('store' in params && params.store && typeof params.store === 'object') {
      return `${screen}-${(params.store as { id: string }).id}`;
    }
    if ('orderId' in params) return `${screen}-${String(params.orderId)}`;
    if ('category' in params) return `${screen}-${String(params.category)}`;
  }
  return screen;
}

export function captureUserStackEntry(
  state: NavigationState | PartialState<NavigationState> | undefined,
): NavHistoryEntry | null {
  if (!state?.routes?.length) return null;

  const route = state.routes[state.index ?? 0];
  if (!route) return null;

  if (route.name === 'MainTabs') {
    const tabName =
      route.state?.routes?.[route.state.index ?? 0]?.name ?? 'Home';
    const params = { screen: tabName } as UserStackParamList['MainTabs'];
    return {
      key: entryKey('MainTabs', params),
      screen: 'MainTabs',
      params,
    };
  }

  const screen = route.name as keyof UserStackParamList;
  const params = route.params as UserStackParamList[typeof screen];
  return {
    key: entryKey(screen, params),
    screen,
    params,
  };
}

export function applyNavHistoryEntry(
  navigation: NativeStackNavigationProp<UserStackParamList>,
  entry: NavHistoryEntry,
): void {
  switch (entry.screen) {
    case 'MainTabs':
      navigation.navigate('MainTabs', entry.params as UserStackParamList['MainTabs']);
      break;
    case 'StoreProducts':
      navigation.navigate('StoreProducts', entry.params as UserStackParamList['StoreProducts']);
      break;
    case 'ProductDetail':
      navigation.navigate('ProductDetail', entry.params as UserStackParamList['ProductDetail']);
      break;
    case 'Cart':
      navigation.navigate('Cart');
      break;
    case 'Checkout':
      navigation.navigate('Checkout');
      break;
    case 'AddressList':
      navigation.navigate('AddressList');
      break;
    case 'AddressForm':
      navigation.navigate('AddressForm', entry.params as UserStackParamList['AddressForm']);
      break;
    case 'OrderTracking':
      navigation.navigate('OrderTracking', entry.params as UserStackParamList['OrderTracking']);
      break;
    case 'Notifications':
      navigation.navigate('Notifications');
      break;
    case 'CategoryBrowse':
      navigation.navigate('CategoryBrowse', entry.params as UserStackParamList['CategoryBrowse']);
      break;
    case 'ProductScanner':
      navigation.navigate('ProductScanner');
      break;
    default:
      break;
  }
}
