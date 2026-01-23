import { AlertCircle, Clock, CreditCard, Hash, TrendingUp, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import api from '../../src/api/axios';
import { styles } from '../../src/styles/dashboardStyles';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/current-session');
      setData(response.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتنسيق التاريخ والوقت حسب اللغة
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  // حساب المجموع الصافي للمبيعات (باستثناء الملغاة)
  const totalSales = data?.orders
    ?.filter((o: any) => o.type === 'sale' && !o.cancelled)
    ?.reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0) || 0;

  // حساب مجموع المصاريف
  const totalCharges = data?.orders
    ?.filter((o: any) => o.type === 'expense' && !o.cancelled)
    ?.reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0) || 0;

  const renderOrderItem = ({ item }: any) => {
    const isSale = item.type === 'sale';
    return (
      <TouchableOpacity
        style={[styles.orderCard, { borderLeftColor: isSale ? '#2ecc71' : '#e74c3c' }, item.cancelled && styles.cancelledCard]}
        onPress={async () => {
          const res = await api.get(`/orders/${item.id}/items`);
          setSelectedOrder(res.data);
          setModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.idSection}>
            <Hash size={16} color="#64748b" />
            <Text style={styles.orderNumber}>{item.order_number}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: isSale ? '#dcfce7' : '#fee2e2' }]}>
            <Text style={[styles.typeText, { color: isSale ? '#166534' : '#991b1b' }]}>
              {isSale ? t('sale') : t('expense')}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.timeSection}>
            <Clock size={14} color="#94a3b8" />
            <Text style={styles.dateText}>{formatDateTime(item.created_at)}</Text>
          </View>
          <View style={styles.priceSection}>
            {item.cancelled && (
              <View style={styles.cancelledBadge}>
                <AlertCircle size={12} color="#fff" />
                <Text style={styles.cancelledText}>{t('cancelled')}</Text>
              </View>
            )}
            <Text style={[styles.amountText, item.cancelled && styles.strikeThrough]}>
              {parseFloat(item.total_amount).toFixed(2)} DH
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#2ecc71" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {/* اسم البارمان */}
      <View style={styles.headerInfo}>
        <Text style={styles.welcomeText}>{t('welcome')},</Text>
        <Text style={styles.barmanName}>{data?.barman_name || "Admin"}</Text>
      </View>

      {/* إحصائيات المبالغ المحسوبة برمجياً */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#2ecc71' }]}>
          <TrendingUp color="#fff" size={20} />
          <Text style={styles.statLabel}>{t('total_sales')}</Text>
          <Text style={styles.statValue}>{totalSales.toFixed(2)} DH</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#e74c3c' }]}>
          <CreditCard color="#fff" size={20} />
          <Text style={styles.statLabel}>{t('charges')}</Text>
          <Text style={styles.statValue}>{totalCharges.toFixed(2)} DH</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t('orders')}</Text>

      <FlatList
        data={data?.orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal تفاصيل الطلب */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{t('order_details')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={28} color="#000" /></TouchableOpacity>
            </View>
            <ScrollView>
              {selectedOrder?.items?.map((prod: any, i: number) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                  <Text style={{ fontSize: 16 }}>{prod.quantity}x {prod.name}</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{(prod.price * prod.quantity).toFixed(2)} DH</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}