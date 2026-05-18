import type { AppLocale } from '../store/languageStore';

export const translations = {
  en: {
    tabs: { home: 'Home', search: 'Search', orders: 'Orders', profile: 'Profile' },
    nav: { browseHistory: 'Browse history', home: 'Home' },
    search: {
      title: 'Search',
      subtitle: 'Find groceries near you',
      placeholder: 'Search products, brands...',
      trending: 'Trending now',
      shopByCategory: 'Shop by category',
      scanTitle: 'Scan a product',
      scanBody: 'Use the barcode scanner from Home for quick add-to-cart.',
      results: '{{count}} result(s) for "{{query}}"',
      noMatches: 'No matches',
      noMatchesBody: 'Try another keyword or browse a category below.',
      homePlaceholder: 'Search groceries, shops...',
    },
    categories: {
      fruits: 'Fruits',
      veggies: 'Veggies',
      dairy: 'Dairy',
      staples: 'Staples',
    },
    home: {
      locationLabel: 'Home',
      locationSub: '123 Street',
      promoTitle: '50% Off\nFirst Order',
      claimNow: 'Claim Now',
      nearbyShops: 'Nearby Shops',
      popularCategories: 'Popular Categories',
      dailyEssentials: 'Daily Essentials',
      viewMore: 'View More',
    },
    notifications: {
      title: 'Notifications',
      unread: 'New',
      earlier: 'Earlier',
      unreadCount: '{{count}} unread',
      allCaughtUp: "You're all caught up",
      markAllRead: 'Mark all read',
      emptyTitle: 'No notifications',
      emptyBody: 'Updates about orders and offers will appear here.',
    },
    orders: {
      title: 'Your Orders',
      subtitle: 'Track deliveries and reorder favourites',
      active: 'Active',
      past: 'Past',
      all: 'All',
      track: 'Track order',
      reorder: 'Reorder',
      items: 'items',
      emptyTitle: 'No orders yet',
      emptyBody: 'When you place an order, it will show up here.',
      shopNow: 'Start shopping',
      noFilterTitle: 'Nothing here',
      noFilterBody: 'No orders in this tab right now.',
      viewAll: 'View all orders',
    },
    profile: {
      goldMember: 'Gold Member',
      myOrders: 'My Orders',
      myOrdersSub: 'Track, view or reorder items',
      savedAddresses: 'Saved Addresses',
      savedAddressesSub: 'Home, Work and other spots',
      paymentMethods: 'Payment Methods',
      paymentMethodsSub: 'Manage your cards and wallet',
      notifications: 'Notifications',
      helpSupport: 'Help & Support',
      preferences: 'App Preferences',
      darkMode: 'Dark Mode',
      darkModeSub: 'Easier on the eyes at night',
      language: 'Language',
      languageSub: 'English or Hindi',
      english: 'English',
      hindi: 'हिंदी',
      logout: 'Logout',
    },
  },
  hi: {
    tabs: { home: 'होम', search: 'खोज', orders: 'ऑर्डर', profile: 'प्रोफ़ाइल' },
    nav: { browseHistory: 'इतिहास देखें', home: 'होम' },
    search: {
      title: 'खोज',
      subtitle: 'पास की किराना दुकानें खोजें',
      placeholder: 'उत्पाद, ब्रांड खोजें...',
      trending: 'अभी ट्रेंडिंग',
      shopByCategory: 'श्रेणी के अनुसार खरीदें',
      scanTitle: 'उत्पाद स्कैन करें',
      scanBody: 'जल्दी कार्ट में जोड़ने के लिए होम से बारकोड स्कैनर का उपयोग करें।',
      results: '"{{query}}" के लिए {{count}} परिणाम',
      noMatches: 'कोई परिणाम नहीं',
      noMatchesBody: 'दूसरा कीवर्ड आज़माएं या नीचे श्रेणी ब्राउज़ करें।',
      homePlaceholder: 'किराना, दुकानें खोजें...',
    },
    categories: {
      fruits: 'फल',
      veggies: 'सब्ज़ियाँ',
      dairy: 'डेयरी',
      staples: 'स्टेपल्स',
    },
    home: {
      locationLabel: 'घर',
      locationSub: '123 स्ट्रीट',
      promoTitle: '50% छूट\nपहले ऑर्डर पर',
      claimNow: 'अभी लें',
      nearbyShops: 'पास की दुकानें',
      popularCategories: 'लोकप्रिय श्रेणियाँ',
      dailyEssentials: 'दैनिक ज़रूरतें',
      viewMore: 'और देखें',
    },
    notifications: {
      title: 'सूचनाएँ',
      unread: 'नई',
      earlier: 'पुरानी',
      unreadCount: '{{count}} अनपढ़ी',
      allCaughtUp: 'सब देख लिया',
      markAllRead: 'सभी पढ़ी हुई',
      emptyTitle: 'कोई सूचना नहीं',
      emptyBody: 'ऑर्डर और ऑफ़र की जानकारी यहाँ दिखेगी।',
    },
    orders: {
      title: 'आपके ऑर्डर',
      subtitle: 'डिलीवरी ट्रैक करें और दोबारा ऑर्डर करें',
      active: 'चल रहे',
      past: 'पिछले',
      all: 'सभी',
      track: 'ऑर्डर ट्रैक करें',
      reorder: 'दोबारा ऑर्डर',
      items: 'आइटम',
      emptyTitle: 'अभी कोई ऑर्डर नहीं',
      emptyBody: 'जब आप ऑर्डर करेंगे, वे यहाँ दिखेंगे।',
      shopNow: 'खरीदारी शुरू करें',
      noFilterTitle: 'यहाँ कुछ नहीं',
      noFilterBody: 'इस टैब में अभी कोई ऑर्डर नहीं है।',
      viewAll: 'सभी ऑर्डर देखें',
    },
    profile: {
      goldMember: 'गोल्ड मेंबर',
      myOrders: 'मेरे ऑर्डर',
      myOrdersSub: 'ट्रैक करें, देखें या दोबारा ऑर्डर करें',
      savedAddresses: 'सहेजे पते',
      savedAddressesSub: 'घर, ऑफिस और अन्य स्थान',
      paymentMethods: 'भुगतान के तरीके',
      paymentMethodsSub: 'कार्ड और वॉलेट प्रबंधित करें',
      notifications: 'सूचनाएँ',
      helpSupport: 'सहायता और समर्थन',
      preferences: 'ऐप प्राथमिकताएँ',
      darkMode: 'डार्क मोड',
      darkModeSub: 'रात में आँखों के लिए आरामदायक',
      language: 'भाषा',
      languageSub: 'अंग्रेज़ी या हिंदी',
      english: 'English',
      hindi: 'हिंदी',
      logout: 'लॉग आउट',
    },
  },
} as const;

export type TranslationTree = typeof translations.en;

function getPath(obj: Record<string, unknown>, path: string): string | undefined {
  const val = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof val === 'string' ? val : undefined;
}

export function translate(
  locale: AppLocale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const raw = getPath(translations[locale] as Record<string, unknown>, key)
    ?? getPath(translations.en as Record<string, unknown>, key)
    ?? key;

  if (!params) return raw;
  return Object.entries(params).reduce(
    (text, [k, v]) => text.replace(new RegExp(`{{${k}}}`, 'g'), String(v)),
    raw,
  );
}
