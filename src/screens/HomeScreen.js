import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import api from '../api/axios';
import { calculateTotalSales } from '../utils/calculations';

const HomeScreen = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ session: null, orders: [] });

    useEffect(() => {
        loadCurrentSession();
    }, []);

    const loadCurrentSession = async () => {
        try {
            const response = await api.get('/dashboard/current-session');
            setData(response.data);
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>مرحباً أيها الباترون 👋</Text>

            {/* بطاقة إجمالي المبيعات */}
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 15, marginTop: 20 }}>
                <Text style={{ color: '#888' }}>مبيعات الجلسة الحالية</Text>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#2ecc71' }}>
                    {calculateTotalSales(data.orders)} $
                </Text>
            </View>

            {/* قائمة أفضل المنتجات ستكون هنا */}
        </ScrollView>
    );
};

export default HomeScreen;