import { Plus, ShoppingBag, Tag, Users } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../api/axios';

import { ManagementItem } from './common/ManagementItem';
import { ManagementModal } from './ManagementModal';

export default function PageManagement() {
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]); // للمنتجات فقط
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const tabs = [
        { id: 'categories', label: 'Catégories', icon: Tag, endpoint: '/categories' },
        { id: 'products', label: 'Produits', icon: ShoppingBag, endpoint: '/products' },
        { id: 'users', label: 'Utilisateurs', icon: Users, endpoint: '/users' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    // جلب البيانات
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(currentTab.endpoint);
            setData(res.data);

            // إذا كنا في تاب المنتجات، نحتاج الكاتيجوريز للفورم
            if (activeTab === 'products') {
                const catRes = await api.get('/categories');
                setCategories(catRes.data);
            }
        } catch (e) {
            Alert.alert("Erreur", "Impossible de charger les données");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = (id) => {
        Alert.alert("Suppression", "Voulez-vous vraiment supprimer cet élément ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer", style: "destructive", onPress: async () => {
                    try {
                        await api.delete(`${currentTab.endpoint}/${id}`);
                        fetchData();
                    } catch (e) { Alert.alert("Erreur", "Suppression échouée"); }
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* التابات */}
            <View style={styles.tabBar}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} color={activeTab === tab.id ? '#2ecc71' : '#64748b'} />
                        <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* القائمة */}
            {loading ? (
                <View style={styles.loader}><ActivityIndicator size="large" color="#2ecc71" /></View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ManagementItem
                            item={item}
                            activeTab={activeTab}
                            onEdit={(it) => { setEditingItem(it); setModalVisible(true); }}
                            onDelete={() => handleDelete(item.id)}
                        />
                    )}
                    contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.empty}>Aucun élément trouvé</Text>}
                />
            )}

            {/* زر الإضافة العائم */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => { setEditingItem(null); setModalVisible(true); }}
            >
                <Plus color="#fff" size={30} />
            </TouchableOpacity>

            {/* المودال */}
            <ManagementModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                activeTab={activeTab}
                editingItem={editingItem}
                categories={categories}
                onRefresh={fetchData}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    tabBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, flexDirection: 'row', justifyContent: 'center' },
    activeTab: { backgroundColor: '#dcfce7' },
    tabText: { marginLeft: 6, color: '#64748b', fontWeight: '700', fontSize: 13 },
    activeTabText: { color: '#2ecc71' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fab: { position: 'absolute', right: 20, bottom: 25, backgroundColor: '#2ecc71', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#2ecc71', shadowOpacity: 0.3, shadowRadius: 10 },
    empty: { textAlign: 'center', marginTop: 50, color: '#94a3b8' }
});