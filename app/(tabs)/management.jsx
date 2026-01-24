import { Edit2, Plus, ShoppingBag, Tag, Trash2, Users, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator, Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../../src/api/axios';

export default function Management() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);

    const tabs = [
        { id: 'categories', label: t('categories') || 'Catégories', icon: Tag, endpoint: '/categories' },
        { id: 'products', label: t('products') || 'Produits', icon: ShoppingBag, endpoint: '/products' },
        { id: 'users', label: t('users') || 'Utilisateurs', icon: Users, endpoint: '/users' },
    ];

    const currentTab = tabs.find(tab => tab.id === activeTab);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(currentTab.endpoint);
            setData(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.put(`${currentTab.endpoint}/${editingId}`, formData);
            } else {
                await api.post(currentTab.endpoint, formData);
            }
            setModalVisible(false);
            setFormData({});
            setEditingId(null);
            fetchData();
        } catch (error) {
            Alert.alert("Erreur", "L'enregistrement a échoué");
        }
    };

    const handleDelete = (id) => {
        Alert.alert(t('confirm'), t('delete_message'), [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('delete'), style: 'destructive', onPress: async () => {
                    await api.delete(`${currentTab.endpoint}/${id}`);
                    fetchData();
                }
            }
        ]);
    };

    const renderItem = ({ item }) => {
        const isCategory = activeTab === 'categories';
        const isProduct = activeTab === 'products';
        const isUser = activeTab === 'users';

        return (
            <View style={styles.card}>
                {/* 1. الصورة (للأصناف والمنتجات) */}
                {(isCategory || isProduct) && (
                    <View style={styles.imageContainer}>
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                        ) : (
                            <View style={styles.placeholderIcon}>
                                {isCategory ? <Tag size={20} color="#94a3b8" /> : <ShoppingBag size={20} color="#94a3b8" />}
                            </View>
                        )}
                    </View>
                )}

                {/* 2. النصوص (الاسم والتفاصيل) */}
                <View style={styles.infoContainer}>
                    <Text style={styles.itemName} numberOfLines={1}>
                        {item.title || item.username || "Sans Nom"}
                    </Text>

                    {isProduct && (
                        <View style={styles.productMeta}>
                            <Text style={styles.priceText}>{parseFloat(item.price).toFixed(2)} DH</Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>
                                    {item.category?.name || 'Général'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {isUser && (
                        <Text style={styles.itemDetail}>{item.role} • {item.email}</Text>
                    )}
                </View>

                {/* 3. أزرار التحكم (تعديل وحذف) */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => { setEditingId(item.id); setFormData(item); setModalVisible(true); }}
                    >
                        <Edit2 size={18} color="#3b82f6" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tabItem, isActive && styles.activeTabItem]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <Icon size={18} color={isActive ? '#2ecc71' : '#64748b'} />
                            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => { setEditingId(null); setFormData({}); setModalVisible(true); }}
            >
                <Plus color="#fff" size={28} />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingId ? t('edit') : t('add')} {currentTab.label}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#000" /></TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            <Text style={styles.inputLabel}>{t('name')}</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name || ''}
                                onChangeText={(val) => setFormData({ ...formData, name: val })}
                                placeholder="Nom..."
                            />

                            {activeTab === 'products' && (
                                <>
                                    <Text style={styles.inputLabel}>{t('price')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={formData.price?.toString() || ''}
                                        onChangeText={(val) => setFormData({ ...formData, price: val })}
                                        placeholder="0.00 DH"
                                    />
                                </>
                            )}

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>{t('save')}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    tabBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, flexDirection: 'row', justifyContent: 'center' },
    activeTabItem: { backgroundColor: '#dcfce7' },
    tabLabel: { marginLeft: 6, color: '#64748b', fontWeight: 'bold', fontSize: 13 },
    activeTabLabel: { color: '#2ecc71' },

    listContent: { padding: 15, paddingBottom: 100 },

    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12,
        flexDirection: 'row', alignItems: 'center', elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3
    },
    imageContainer: { width: 55, height: 55, borderRadius: 10, backgroundColor: '#f1f5f9', overflow: 'hidden' },
    itemImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    placeholderIcon: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    infoContainer: { flex: 1, marginLeft: 12 },
    itemName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    itemDetail: { color: '#64748b', fontSize: 13, marginTop: 4 },

    productMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    priceText: { fontSize: 14, fontWeight: 'bold', color: '#2ecc71', marginRight: 10 },
    categoryBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#dbeafe' },
    categoryBadgeText: { fontSize: 11, color: '#2563eb', fontWeight: '800' },

    actionContainer: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { padding: 8, marginLeft: 5 },

    fab: {
        position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2ecc71',
        width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    inputLabel: { fontSize: 14, color: '#475569', marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
    saveBtn: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 12, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});