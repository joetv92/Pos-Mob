import { Users } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './home.styles';

interface ServerSale {
    name: string;
    total: number;
}

export const ServerSales = ({ serverSales, t }: { serverSales: ServerSale[], t: any }) => {
    if (serverSales.length === 0) return null;

    return (
        <View style={styles.serverSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Users size={18} color="#3b82f6" />
                <Text style={{ fontWeight: 'bold', color: '#1e293b', marginLeft: 8 }}>
                    {t('sales_by_server') || 'Ventes par Serveur'}
                </Text>
            </View>
            {serverSales.map((srv, index) => (
                <View key={index} style={styles.serverRow}>
                    <Text style={{ color: '#64748b' }}>{srv.name}</Text>
                    <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{srv.total.toFixed(2)} DH</Text>
                </View>
            ))}
        </View>
    );
};