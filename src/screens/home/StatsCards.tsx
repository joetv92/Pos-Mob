import { CreditCard, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../../constants/Config';
import { styles } from './home.styles';

export const StatsCards = ({ sales, charges, t }: any) => (
    <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: Colors.primary }]}>
            <TrendingUp color="#fff" size={20} />
            <Text style={styles.statLabel}>{t('total_sales')}</Text>
            <Text style={styles.statValue}>{sales.toFixed(2)} DH</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: Colors.danger }]}>
            <CreditCard color="#fff" size={20} />
            <Text style={styles.statLabel}>{t('charges')}</Text>
            <Text style={styles.statValue}>{charges.toFixed(2)} DH</Text>
        </View>
    </View>
);