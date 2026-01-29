import { X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SmartImage } from '../../components/common/SmartImage';
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
                        order?.items?.map((prod: any, i: number) => (
                            <View key={i} style={styles.itemRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <SmartImage productId={prod.product_id} style={styles.productImage} />
                                    <View>
                                        <Text style={{ fontWeight: '600' }}>{prod.product_name || prod.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#64748b' }}>{prod.quantity} x {prod.price} DH</Text>
                                    </View>
                                </View>
                                <Text style={{ fontWeight: 'bold' }}>{(prod.price * prod.quantity).toFixed(2)} DH</Text>
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