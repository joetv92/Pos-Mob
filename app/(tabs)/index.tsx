import api from '@/src/api/axios';
import { DashboardResponse } from '@/src/types';
import { calculateTotalSales } from '@/src/utils/calculations';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get<DashboardResponse>('/dashboard/current-session');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#2ecc71" style={{ flex: 1 }} />;

  const orders = data?.orders || [];
  const totalSales = calculateTotalSales(orders);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>مرحباً أيها الباترون 👋</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>مبيعات الجلسة الحالية</Text>
        <Text style={styles.cardValue}>{totalSales.toLocaleString()} DH</Text>
      </View>

      {/* هنا سنضع المكونات القادمة للـ Top 5 */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'right' },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1
  },
  cardLabel: { color: '#6c757d', fontSize: 16, textAlign: 'right' },
  cardValue: { fontSize: 35, fontWeight: 'bold', color: '#2ecc71', textAlign: 'right', marginTop: 10 }
});