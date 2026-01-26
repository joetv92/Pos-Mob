import { CreditCard, Hash, Package, TrendingUp, Users, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../src/api/axios';
import { styles } from '../../src/styles/dashboardStyles';

// الرابط الأساسي للصور - تأكد من مطابقة IP السيرفر الخاص بك
const IMAGE_BASE_URL = 'http://192.168.1.170:8000/storage/products/';

// --- مكون فرعي ذكي لعرض الصورة وتجربة الامتدادات (jpeg, jpg, png) ---
const SmartImage = ({ productId }: { productId: any }) => {
  const [extension, setExtension] = useState<'jpeg' | 'jpg' | 'png'>('jpeg');
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={[localStyles.productImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }]}>
        <Package size={20} color="#cbd5e1" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: `${IMAGE_BASE_URL}${productId}.${extension}` }}
      style={localStyles.productImage}
      resizeMode="cover"
      onError={() => {
        if (extension === 'jpeg') setExtension('jpg');
        else if (extension === 'jpg') setExtension('png');
        else setFailed(true);
      }}
    />
  );
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [fetchingItems, setFetchingItems] = useState(false);
  const [barmanName, setBarmanName] = useState<string>("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/current-session');
      setData(response.data);
      setBarmanName(response.data?.session?.user?.name || "Admin");
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = async (item: any) => {
    setFetchingItems(true);
    setModalVisible(true);
    setSelectedOrder(item);
    try {
      const res = await api.get(`/orders/${item.id}/items`);
      setSelectedOrder({ ...item, items: res.data });
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setFetchingItems(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short',
    }).format(date);
  };

  // الحسابات
  const totalSales = data?.orders
    ?.filter((o: any) => o.type === 'sale' && !o.cancelled)
    ?.reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0) || 0;

  const totalCharges = data?.orders
    ?.filter((o: any) => o.type === 'expense' && !o.cancelled)
    ?.reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0) || 0;

  const calculateServerSales = () => {
    const serverMap: any = {};
    data?.orders
      ?.filter((o: any) => o.type === 'sale' && !o.cancelled)
      ?.forEach((order: any) => {
        const serverName = order.server?.name || barmanName;
        if (!serverMap[serverName]) serverMap[serverName] = 0;
        serverMap[serverName] += parseFloat(order.total_amount);
      });
    return Object.entries(serverMap).map(([name, total]) => ({ name, total: total as number }));
  };

  const serverSales = calculateServerSales();

  if (loading) return <ActivityIndicator size="large" color="#2ecc71" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerInfo}>
        <Text style={styles.barmanName}>{barmanName}</Text>
        <Text style={{ color: '#64748b', fontSize: 12 }}>{t('current_session') || 'Session Actuelle'}</Text>
      </View>

      {/* Stats */}
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

      {/* Server Sales Summary */}
      <View style={localStyles.serverSection}>
        <View style={localStyles.sectionHeader}>
          <Users size={18} color="#3b82f6" />
          <Text style={localStyles.sectionTitleText}>{t('sales_by_server') || 'Ventes par Serveur'}</Text>
        </View>
        {serverSales.map((srv, index) => (
          <View key={index} style={localStyles.serverRow}>
            <Text style={localStyles.serverName}>{srv.name}</Text>
            <Text style={localStyles.serverTotal}>{srv.total.toFixed(2)} DH</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('orders')}</Text>

      <FlatList
        data={data?.orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.orderCard, { borderLeftColor: item.type === 'sale' ? '#2ecc71' : '#e74c3c' }, item.cancelled && styles.cancelledCard]}
            onPress={() => handleOrderPress(item)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.idSection}>
                <Hash size={16} color="#64748b" />
                <Text style={styles.orderNumber}>{item.order_number}</Text>
              </View>
              <Text style={styles.dateText}>{formatDateTime(item.created_at)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
              <Text style={{ fontSize: 12, color: '#64748b' }}>👤 {item.server?.name || barmanName}</Text>
              <Text style={styles.amountText}>{parseFloat(item.total_amount).toFixed(2)} DH</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal Details */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContainer}>
            <View style={localStyles.modalHeader}>
              <View>
                <Text style={localStyles.modalTitleText}>{t('order_details')}</Text>
                <Text style={localStyles.modalSubtitle}>#{selectedOrder?.order_number}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={localStyles.closeIcon}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {fetchingItems ? (
                <View style={{ padding: 50 }}><ActivityIndicator size="large" color="#2ecc71" /></View>
              ) : (
                <>
                  {selectedOrder?.items?.map((prod: any, i: number) => (
                    <View key={i} style={localStyles.itemRow}>
                      <View style={localStyles.itemInfoLeft}>
                        {/* استخدام المكون الذكي هنا لعرض الصور */}
                        <SmartImage productId={prod.product_id} />
                        <View>
                          <Text style={localStyles.productNameText}>{prod.product_name || prod.name}</Text>
                          <Text style={localStyles.productQtyText}>{prod.quantity} x {parseFloat(prod.price).toFixed(2)} DH</Text>
                        </View>
                      </View>
                      <Text style={localStyles.itemSubtotal}>{(prod.price * prod.quantity).toFixed(2)} DH</Text>
                    </View>
                  ))}
                  <View style={localStyles.totalContainer}>
                    <Text style={localStyles.totalLabel}>Total</Text>
                    <Text style={localStyles.totalAmount}>{parseFloat(selectedOrder?.total_amount || 0).toFixed(2)} DH</Text>
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={localStyles.closeButton}>
              <Text style={localStyles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  serverSection: { margin: 15, padding: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitleText: { fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  serverRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
  serverName: { color: '#64748b' },
  serverTotal: { fontWeight: 'bold', color: '#1e293b' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitleText: { fontSize: 20, fontWeight: 'bold' },
  modalSubtitle: { color: '#64748b' },
  closeIcon: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 50 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  itemInfoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  productImage: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#f8fafc', marginRight: 12 },
  productNameText: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  productQtyText: { fontSize: 13, color: '#64748b' },
  itemSubtotal: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  totalContainer: { marginTop: 20, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#64748b' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#2ecc71' },
  closeButton: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});