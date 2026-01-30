import { TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

export default function SummaryBox({ stats }: any) {
    return (
        <View style={styles.summaryBox}>
            <View style={styles.mainStat}>
                <TrendingUp size={24} color="#2ecc71" />
                <Text style={styles.statLabel}>Total Revenu</Text>
                <Text style={styles.statValue}>{stats.sales.toFixed(2)} DH</Text>
            </View>

            <View style={styles.subStats}>
                <View style={styles.subItem}>
                    <Text style={styles.subLabel}>Charges</Text>
                    <Text style={[styles.subValue, { color: '#e74c3c' }]}>
                        {stats.expenses.toFixed(2)} DH
                    </Text>
                </View>
                <View style={styles.subItem}>
                    <Text style={styles.subLabel}>Net</Text>
                    <Text style={[styles.subValue, { color: '#3b82f6' }]}>
                        {(stats.sales - stats.expenses).toFixed(2)} DH
                    </Text>
                </View>
            </View>
        </View>
    );
}
