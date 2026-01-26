import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock,
  Package,
  Receipt, ShoppingCart,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../../src/api/axios';

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = 'http://192.168.1.170:8000/storage/products/';

export default function SessionArchivePage() {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const SmartImage = ({ productId }: { productId: any }) => {
    const [extension, setExtension] = useState<'jpeg' | 'jpg' | 'png'>('jpeg');
    const [failed, setFailed] = useState(false);

    if (failed) {
      return (
        <View style={[styles.productImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }]}>
          <Package size={20} color="#cbd5e1" />
        </View>
      );
    }

    return (
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${productId}.${extension}` }}
        style={styles.productImage}
        resizeMode="cover"
        onError={() => {
          if (extension === 'jpeg') setExtension('jpg');
          else if (extension === 'jpg') setExtension('png');
          else setFailed(true);
        }}
      />
    );
  };
  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await api.get(`/sessions/archive?date=${formattedDate}`);
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // إحصائيات عامة لليوم
  const globalStats = useMemo(() => {
    let sales = 0;
    let expenses = 0;
    sessions.forEach(s => {
      s.orders?.forEach((o: any) => {
        const amount = parseFloat(o.total_amount);
        if (!o.cancelled) {
          if (o.type === 'sale') sales += amount;
          else if (o.type === 'expense') expenses += amount;
        }
      });
    });
    return { totalSales: sales, totalExpenses: expenses };
  }, [sessions]);

  // حساب إحصائيات كل نادل داخل الجلسة المختارة
  const getServerStats = (session: any) => {
    if (!session || !session.servers) return [];

    return session.servers.map((srv: any) => {
      const serverOrders = session.orders?.filter((o: any) => o.server_id === srv.id && !o.cancelled && o.type === 'sale') || [];
      const total = serverOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0);
      return {
        name: srv.name,
        count: serverOrders.length,
        total: total
      };
    });
  };

  const SessionCard = ({ item }: { item: any }) => {
    const sTotal = item.orders?.filter((o: any) => o.type === 'sale' && !o.cancelled).reduce((a: number, b: any) => a + parseFloat(b.total_amount), 0) || 0;
    const sExp = item.orders?.filter((o: any) => o.type === 'expense' && !o.cancelled).reduce((a: number, b: any) => a + parseFloat(b.total_amount), 0) || 0;
    const serverList = item.servers?.map((s: any) => s.name).join(', ') || '---';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => { setSelectedSession(item); setSessionModalVisible(true); }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.rowAlign}>
            <User size={18} color="#2ecc71" />
            <Text style={styles.barmanName}>{item.user?.name}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: item.status === 'closed' ? '#f1f5f9' : '#dcfce7' }]}>
            <Text style={[styles.badgeText, { color: item.status === 'closed' ? '#64748b' : '#166534' }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.infoRow}><Users size={14} color="#94a3b8" /><Text style={styles.infoText} numberOfLines={1}>Serveurs: {serverList}</Text></View>
        <View style={styles.infoRow}><Clock size={14} color="#94a3b8" /><Text style={styles.infoText}>{item.start_time.split(' ')[1]} - {item.end_time?.split(' ')[1] || 'En cours'}</Text></View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View><Text style={styles.footerLabel}>Ventes</Text><Text style={styles.footerValueSales}>{sTotal.toFixed(2)} DH</Text></View>
          <View><Text style={styles.footerLabel}>Charges</Text><Text style={styles.footerValueExp}>{sExp.toFixed(2)} DH</Text></View>
          <View><Text style={styles.footerLabel}>Orders</Text><Text style={styles.footerValueOrd}>{item.orders?.length || 0}</Text></View>
          <ChevronRight size={20} color="#cbd5e1" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Archives Sessions</Text>
        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
          <Calendar size={18} color="#fff" /><Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && <DateTimePicker value={date} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />}

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#2ecc71" /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Summary Box */}
          <View style={styles.summaryBox}>
            <View style={styles.mainStat}>
              <TrendingUp color="#2ecc71" size={24} />
              <Text style={styles.statLabel}>Total Revenu</Text>
              <Text style={styles.statValue}>{globalStats.totalSales.toFixed(2)} DH</Text>
            </View>
            <View style={styles.subStats}>
              <View style={styles.subItem}><Text style={styles.subLabel}>Charges</Text><Text style={[styles.subValue, { color: '#e74c3c' }]}>{globalStats.totalExpenses.toFixed(2)} DH</Text></View>
              <View style={styles.subItem}><Text style={styles.subLabel}>Net</Text><Text style={[styles.subValue, { color: '#3b82f6' }]}>{(globalStats.totalSales - globalStats.totalExpenses).toFixed(2)} DH</Text></View>
            </View>
          </View>

          <Text style={styles.sectionTitle}><Receipt size={18} color="#475569" />  Liste des Sessions</Text>
          {sessions.length === 0 ? (
            <View style={styles.emptyBox}><AlertCircle size={40} color="#cbd5e1" /><Text style={styles.emptyText}>Aucune donnée</Text></View>
          ) : (
            sessions.map(s => <SessionCard key={s.id} item={s} />)
          )}
        </ScrollView>
      )}

      {/* --- Modal 1: Details de la Session --- */}
      <Modal visible={sessionModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Statistiques de Session</Text>
              <TouchableOpacity onPress={() => setSessionModalVisible(false)}><X size={24} color="#000" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* قسم إحصائيات النادلين */}
              <View style={styles.statsGrid}>
                {getServerStats(selectedSession).map((srv, idx) => (
                  <View key={idx} style={styles.statCard}>
                    <Text style={styles.statCardName}>{srv.name}</Text>
                    <Text style={styles.statCardTotal}>{srv.total.toFixed(2)} DH</Text>
                    <View style={styles.statCardFooter}>
                      <ShoppingCart size={12} color="#94a3b8" />
                      <Text style={styles.statCardCount}>{srv.count} Cmds</Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={styles.modalSubTitle}>Historique des commandes</Text>
              {selectedSession?.orders?.map((o: any, i: number) => {
                // العثور على اسم النادل من مصفوفة النادلين في الجلسة
                const serverName = selectedSession.servers?.find((s: any) => s.id === o.server_id)?.name || selectedSession.user?.name;
                return (
                  <TouchableOpacity key={i} style={styles.orderListItem} onPress={() => { setSelectedOrder(o); setOrderModalVisible(true); }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orderNumText}>#{o.order_number} - {serverName}</Text>
                      <Text style={styles.orderTimeText}>{o.created_at_local?.split(' ')[1]}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.orderAmountText, { color: o.type === 'expense' ? '#e74c3c' : '#2ecc71' }]}>
                        {parseFloat(o.total_amount).toFixed(2)} DH
                      </Text>
                      <Text style={styles.orderTypeText}>{o.type === 'expense' ? 'Charge' : 'Vente'}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- Modal 2: Order Items (Dashboard Style) --- */}
      <Modal visible={orderModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlayDark}>
          <View style={styles.orderItemsBox}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Détails de Commande</Text>
              </View>
              <TouchableOpacity onPress={() => setOrderModalVisible(false)}><X size={24} color="#000" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedOrder?.order_items?.map((item: any, i: number) => (
                <View key={i} style={styles.dashboardItemRow}>
                  <SmartImage productId={item.product_id} />
                  <View style={{ flex: 1, paddingLeft: 12 }}>
                    <Text style={styles.dashProdName}>{item.product_name}</Text>
                    <Text style={styles.dashProdInfo}>{item.quantity} units x {parseFloat(item.price).toFixed(2)} DH</Text>
                  </View>
                  <View style={styles.dashPriceBadge}>
                    <Text style={styles.dashPriceText}>{(item.quantity * parseFloat(item.price)).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.dashTotalRow}>
                <Text style={styles.dashTotalLabel}>TOTAL COMMANDE</Text>
                <Text style={styles.dashTotalValue}>{parseFloat(selectedOrder?.total_amount || 0).toFixed(2)} DH</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageHeader: { backgroundColor: '#2ecc71', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50 },
  pageTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 10 },
  dateText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  summaryBox: { margin: 15, padding: 20, backgroundColor: '#fff', borderRadius: 20, elevation: 3 },
  mainStat: { alignItems: 'center', marginBottom: 15 },
  statLabel: { color: '#94a3b8', fontSize: 12 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  subStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
  subItem: { flex: 1, alignItems: 'center' },
  subLabel: { fontSize: 11, color: '#94a3b8' },
  subValue: { fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 15, color: '#475569' },
  card: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, padding: 16, borderRadius: 18, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  barmanName: { marginLeft: 8, fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { marginLeft: 8, fontSize: 12, color: '#64748b' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 10, color: '#94a3b8' },
  footerValueSales: { fontSize: 14, fontWeight: 'bold', color: '#2ecc71' },
  footerValueExp: { fontSize: 14, fontWeight: 'bold', color: '#e74c3c' },
  footerValueOrd: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6' },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#94a3b8', marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalOverlayDark: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, height: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  modalSubTitle: { fontSize: 15, fontWeight: 'bold', color: '#64748b', marginTop: 20, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#f8fafc', padding: 12, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  statCardName: { fontSize: 12, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  statCardTotal: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71', marginVertical: 4 },
  statCardFooter: { flexDirection: 'row', alignItems: 'center' },
  statCardCount: { fontSize: 11, color: '#94a3b8', marginLeft: 4 },
  orderListItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#cbd5e1', elevation: 1 },
  orderNumText: { fontWeight: 'bold', color: '#1e293b', fontSize: 14 },
  orderTimeText: { fontSize: 11, color: '#94a3b8' },
  orderAmountText: { fontWeight: 'bold', fontSize: 15 },
  orderTypeText: { fontSize: 10, color: '#94a3b8' },
  orderItemsBox: { backgroundColor: '#fff', borderRadius: 25, width: width * 0.92, maxHeight: '80%', padding: 20 },
  dashboardItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 15, padding: 10, marginBottom: 10 },
  dashProdImg: { width: 55, height: 55, borderRadius: 12 },
  dashProdName: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  dashProdInfo: { fontSize: 12, color: '#64748b' },
  dashPriceBadge: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  dashPriceText: { fontWeight: 'bold', color: '#2ecc71', fontSize: 13 },
  dashTotalRow: { marginTop: 15, padding: 15, backgroundColor: '#2ecc71', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dashTotalLabel: { color: 'rgba(255,255,255)', fontWeight: 'bold', fontSize: 12 },
  dashTotalValue: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  smallLabel: { fontSize: 11, color: '#94a3b8' },
  productImage: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#f8fafc', marginRight: 12 },
});