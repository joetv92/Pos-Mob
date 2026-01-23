import { Tabs } from 'expo-router';
import { History, Home, ShoppingBag } from 'lucide-react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2ecc71', // أخضر بريميوم للباترون
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        }
      }}
    >
      {/* الشاشة الرئيسية: الجلسة الحالية */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* شاشة الجلسات والتواريخ */}
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'الأرشيف',
          tabBarLabel: 'الجلسات',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />

      {/* شاشة المنتجات (لمراقبة الأسعار مثلاً) */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'المنتجات',
          tabBarLabel: 'المنتجات',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}