import { ChevronRight, Clock, User, Users } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

export default function SessionCard({ item, onPress }: any) {
    const sTotal =
        item.orders?.filter((o: any) => o.type === 'sale' && !o.cancelled)
            .reduce((a: number, b: any) => a + parseFloat(b.total_amount), 0) || 0;

    const sExp =
        item.orders?.filter((o: any) => o.type === 'expense' && !o.cancelled)
            .reduce((a: number, b: any) => a + parseFloat(b.total_amount), 0) || 0;

    const serverList = item.servers?.map((s: any) => s.name).join(', ') || '---';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardHeader}>
                <View style={styles.rowAlign}>
                    <User size={18} color="#2ecc71" />
                    <Text style={styles.barmanName}>{item.user?.name}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <Users size={14} color="#94a3b8" />
                <Text style={styles.infoText}>Serveurs: {serverList}</Text>
            </View>

            <View style={styles.infoRow}>
                <Clock size={14} color="#94a3b8" />
                <Text style={styles.infoText}>
                    {item.start_time?.split(' ')[1]} - {item.end_time?.split(' ')[1] || 'En cours'}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View>
                    <Text style={styles.footerLabel}>Ventes</Text>
                    <Text style={styles.footerValueSales}>{sTotal.toFixed(2)} DH</Text>
                </View>
                <View>
                    <Text style={styles.footerLabel}>Charges</Text>
                    <Text style={styles.footerValueExp}>{sExp.toFixed(2)} DH</Text>
                </View>
                <ChevronRight size={20} color="#cbd5e1" />
            </View>
        </TouchableOpacity>
    );
}
