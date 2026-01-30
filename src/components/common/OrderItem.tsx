import { Clock, Hash } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Config';
import { styles } from '../../screens/home/home.styles';

export const OrderItem = ({ item, onPress, t, formatTime, barmanName }: any) => {
    const isSale = item.type === 'sale';
    return (
        <TouchableOpacity
            style={[styles.orderCard, { borderLeftColor: isSale ? Colors.primary : Colors.danger }, item.cancelled && styles.cancelledCard]}
            onPress={() => onPress(item)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.idSection}>
                    <Hash size={16} color={Colors.subText} />
                    <Text style={styles.orderNumber}>{item.order_number}</Text>
                </View>
                <View style={styles.idSection}>
                    <Text style={styles.typeText}>{item.server?.name || barmanName}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: isSale ? '#dcfce7' : '#fee2e2' }]}>
                    <Text style={[styles.typeText, { color: isSale ? '#166534' : '#991b1b' }]}>
                        {isSale ? t('sale') : t('expense')}
                    </Text>
                </View>
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.timeSection}>
                    <Clock size={14} color={Colors.subText} />
                    <Text style={styles.dateText}>{formatTime(item.created_at)}</Text>
                </View>
                <Text style={[styles.amountText, item.cancelled && styles.strikeThrough]}>
                    {parseFloat(item.total_amount).toFixed(2)} DH
                </Text>
            </View>
        </TouchableOpacity>
    );
};