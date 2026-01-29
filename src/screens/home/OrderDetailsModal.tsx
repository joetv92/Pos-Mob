import { X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SmartImageWithId } from '../../components/common/SmartImageWithId';
import { styles } from './home.styles';

export const OrderDetailsModal = ({ visible, order, onClose, loading, t }: any) => (
    <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{t('order_details')}</Text>
                        <Text style={{ color: '#64748b' }}>#{order?.order_number}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose}><X size={24} /></TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2ecc71" style={{ padding: 50 }} />
                    ) : (
                        order?.items?.map((item: any, i: number) => (
                            <View key={i} style={styles.itemRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <SmartImageWithId productId={item.product_id} style={styles.productImage} />
                                    <View>
                                        <Text style={{ fontWeight: '600' }}>{item.product_name || item.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#64748b' }}>{item.quantity} x {item.price} DH</Text>
                                    </View>
                                </View>
                                <Text style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toFixed(2)} DH</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
                <TouchableOpacity style={{ backgroundColor: '#2ecc71', padding: 16, borderRadius: 15, marginTop: 10 }} onPress={onClose}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);