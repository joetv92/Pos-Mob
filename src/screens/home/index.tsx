import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import api from '../../api/axios';
import { styles } from './home.styles';

// استيراد المكونات التي أنشأناها
import { HomeHeader } from './HomeHeader';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderItem } from './OrderItem';
import { ServerSales } from './ServerSales';
import { StatsCards } from './StatsCards';

export default function HomeContainer() {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [fetchingItems, setFetchingItems] = useState(false);
    const [barmanName, setBarmanName] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/dashboard/current-session');
            setData(response.data);
            setBarmanName(response.data?.session?.user?.name || "Admin");
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderPress = async (order: any) => {
        setModalVisible(true);
        setFetchingItems(true);
        setSelectedOrder(order);
        try {
            const res = await api.get(`/orders/${order.id}/items`);
            setSelectedOrder({ ...order, items: res.data });
        } catch (e) {
            console.error(e);
        } finally {
            setFetchingItems(false);
        }
    };

    // العمليات الحسابية
    const stats = {
        sales: data?.orders?.filter((o: any) => o.type === 'sale' && !o.cancelled)
            .reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0) || 0,
        charges: data?.orders?.filter((o: any) => o.type === 'expense' && !o.cancelled)
            .reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0) || 0
    };

    const calculateServerSales = () => {
        const serverMap: any = {};
        const barmanName = data?.session?.user?.name || "Admin";
        data?.orders?.filter((o: any) => o.type === 'sale' && !o.cancelled).forEach((order: any) => {
            const name = order.server?.name || barmanName;
            serverMap[name] = (serverMap[name] || 0) + parseFloat(order.total_amount);
        });
        return Object.entries(serverMap).map(([name, total]) => ({ name, total: total as number }));
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <ActivityIndicator size="large" color="#2ecc71" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={data?.orders}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <HomeHeader
                            name={barmanName}
                        />
                        <StatsCards
                            sales={stats.sales}
                            charges={stats.charges}
                            t={t}
                        />
                        <ServerSales
                            serverSales={calculateServerSales()}
                            t={t}
                        />
                        <Text style={styles.sectionTitle}>{t('orders')}</Text>
                    </>
                }
                renderItem={({ item }) => (
                    <OrderItem
                        item={item}
                        onPress={handleOrderPress}
                        t={t}
                        formatTime={formatTime}
                        barmanName={barmanName}
                    />
                )}
            />

            <OrderDetailsModal
                visible={modalVisible}
                order={selectedOrder}
                loading={fetchingItems}
                onClose={() => setModalVisible(false)}
                t={t}
            />
        </View>
    );
}