import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import api from '../../../api/axios';
import { OrderDetailsModal } from '../../../components/common/OrderDetailsModal';
import { OrderItem } from '../../../components/common/OrderItem';
import { styles } from '../styles';

import { formatTime } from '../../../helpers/date';

export default function SessionDetailsModal({ visible, session, onClose }: any) {
    if (!session) return null;
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [fetchingItems, setFetchingItems] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
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
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Statistiques de Session</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} />
                        </TouchableOpacity>
                    </View>
                    <OrderItem
                        item={session.orders}
                        onPress={handleOrderPress}
                        t={t}
                        formatTime={formatTime}
                        barmanName={session.user.name}
                    />
                </View>
                <OrderDetailsModal
                    visible={modalVisible}
                    order={selectedOrder}
                    loading={fetchingItems}
                    onClose={() => setModalVisible(false)}
                    t={t}
                />
            </View>
        </Modal>
    );
}
