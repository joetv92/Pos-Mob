import { Edit2, Trash2 } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SmartImage } from '../../../components/common/SmartImage';

export const ManagementItem = ({ item, activeTab, onEdit, onDelete }) => {

    return (
        <View style={styles.card}>
            <SmartImage
                uri={item.image || item.avatar}
                style={styles.imageContainer}
            />

            <View style={styles.infoContainer}>
                <Text style={styles.itemName} numberOfLines={1}>
                    {activeTab === 'products' ? item.title : item.name}
                </Text>
                {activeTab === 'products' && <Text style={styles.priceText}>{item.price} DH</Text>}
                {activeTab === 'users' && <Text style={styles.subText}>{item.roles?.map(r => r.name || r).join(', ')}</Text>}
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => onEdit(item)} style={styles.btn}><Edit2 size={18} color="#3b82f6" /></TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.btn}><Trash2 size={18} color="#ef4444" /></TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
    imageContainer: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#f1f5f9', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    itemImage: { width: '100%', height: '100%' },
    infoContainer: { flex: 1, marginLeft: 12 },
    itemName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    priceText: { color: '#2ecc71', fontWeight: 'bold', fontSize: 13 },
    subText: { fontSize: 11, color: '#64748b' },
    actionContainer: { flexDirection: 'row' },
    btn: { padding: 8, marginLeft: 4 }
});