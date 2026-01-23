import { Tabs } from 'expo-router';
import { History, Home, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import './../../src/i18n/config'; // استيراد إعدادات اللغة

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#2ecc71' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center', // جعل العنوان في المنتصف دائماً
        tabBarActiveTintColor: '#2ecc71',
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'), // تترجم لـ "لوحة التحكم" أو "Tableau de Bord"
          tabBarLabel: t('dashboard'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: t('sessions'),
          tabBarLabel: t('sessions'),
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
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