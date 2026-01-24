import { Tabs } from 'expo-router';
import { History, Home, LayoutGrid, Settings } from 'lucide-react-native'; // أضفنا LayoutGrid كأيقونة للإدارة
import { useTranslation } from 'react-i18next';
import './../../src/i18n/config';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#2ecc71' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#2ecc71',
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      {/* صفحة لوحة التحكم */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarLabel: t('dashboard'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* صفحة الإدارة (التي أضفتها أنت) */}
      <Tabs.Screen
        name="management"
        options={{
          title: t('management') || "Gestion", // تأكد من إضافة الترجمة في ملفات locales
          tabBarLabel: t('management') || "Gestion",
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />

      {/* صفحة الجلسات */}
      <Tabs.Screen
        name="sessions"
        options={{
          title: t('sessions'),
          tabBarLabel: t('sessions'),
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />

      {/* صفحة الإعدادات */}
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarLabel: t('settings'),
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}