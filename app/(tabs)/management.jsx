import { Picker } from '@react-native-picker/picker'; // تأكد من تثبيتها
import * as ImagePicker from 'expo-image-picker';
import { Edit2, Image as ImageIcon, Plus, ShoppingBag, Tag, Trash2, Users, X } from 'lucide-react-native';
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

const STORAGE_URL = 'http://192.168.1.11:8000/storage/';

export default function Management() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('categories');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]); // لتخزين قائمة الأصناف للمنتجات
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
        if (activeTab === 'products') {
            loadCategories(); // جلب الأصناف عند فتح تبويب المنتجات
        }
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(currentTab.endpoint);
            let sortedData = response.data;
            if (activeTab === 'categories') {
                sortedData = response.data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            }
            setData(sortedData);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Load Categories Error:", error);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission", "Accès refusé");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled) {
            setFormData({ ...formData, imageUri: result.assets[0].uri });
        }
    };

    const handleSave = async () => {
        const nameValue = activeTab === 'products' ? formData.title : formData.name;
        if (!nameValue) {
            Alert.alert("Erreur", "Le champ obligatoire est vide");
            return;
        }

        try {
            setLoading(true);
            const dataToSend = new FormData();

            if (activeTab === 'products') {
                dataToSend.append('title', formData.title);
                dataToSend.append('price', formData.price || 0);
                dataToSend.append('category_id', formData.category_id || (categories[0]?.id));
            } else if (activeTab === 'categories') {
                dataToSend.append('name', formData.name);
                dataToSend.append('display_order', formData.display_order || 0);
                const generatedId = editingId ? formData.id : `cat_${formData.name.toLowerCase().trim().replace(/\s+/g, '_')}`;
                dataToSend.append('id', generatedId);
            }

            if (formData.imageUri) {
                const filename = formData.imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                dataToSend.append('image', { uri: formData.imageUri, name: filename, type: type });
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (editingId) {
                dataToSend.append('_method', 'PUT');
                await api.post(`${currentTab.endpoint}/${editingId}`, dataToSend, config);
            } else {
                await api.post(currentTab.endpoint, dataToSend, config);
            }

            setModalVisible(false);
            setFormData({});
            setEditingId(null);
            fetchData();
            Alert.alert("Succès", "Enregistré avec succès");
        } catch (error) {
            Alert.alert("Erreur", "Échec de l'enregistrement");
        } finally {
            setLoading(false);
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

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image.startsWith('http') ? item.image : `${STORAGE_URL}${item.image}` }} style={styles.itemImage} />
                ) : (
                    <View style={styles.placeholderIcon}>
                        {activeTab === 'categories' ? <Tag size={22} color="#94a3b8" /> : <ShoppingBag size={22} color="#94a3b8" />}
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                        {activeTab === 'products' ? item.title : (item.name || item.username)}
                    </Text>
                    {activeTab === 'categories' && (
                        <View style={styles.orderBadge}><Text style={styles.orderBadgeText}>#{item.display_order || 0}</Text></View>
                    )}
                </View>

                {activeTab === 'products' && (
                    <View style={styles.productMeta}>
                        <Text style={styles.priceText}>{parseFloat(item.price).toFixed(2)} DH</Text>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{item.category?.name || 'Général'}</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {
                    setEditingId(item.id);
                    setFormData(activeTab === 'products' ? { ...item, category_id: item.category_id } : item);
                    setModalVisible(true);
                }}>
                    <Edit2 size={18} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                    <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <TouchableOpacity key={tab.id} style={[styles.tabItem, activeTab === tab.id && styles.activeTabItem]} onPress={() => setActiveTab(tab.id)}>
                            <Icon size={18} color={activeTab === tab.id ? '#2ecc71' : '#64748b'} />
                            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>{tab.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {loading && !modalVisible ? (
                <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => { setEditingId(null); setFormData({}); setModalVisible(true); }}>
                <Plus color="#fff" size={28} />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingId ? "Modifier" : "Ajouter"} {currentTab.label}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#000" /></TouchableOpacity>
                        </View>

                        <ScrollView style={{ padding: 20 }}>
                            <Text style={styles.inputLabel}>{activeTab === 'products' ? 'Titre du produit' : 'Nom'}</Text>
                            <TextInput
                                style={styles.input}
                                value={activeTab === 'products' ? (formData.title || '') : (formData.name || '')}
                                onChangeText={(val) => activeTab === 'products' ? setFormData({ ...formData, title: val }) : setFormData({ ...formData, name: val })}
                                placeholder="..."
                            />

                            {activeTab === 'products' && (
                                <>
                                    <Text style={styles.inputLabel}>Catégorie</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={formData.category_id}
                                            onValueChange={(itemValue) => setFormData({ ...formData, category_id: itemValue })}
                                        >
                                            {categories.map((cat) => (
                                                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                                            ))}
                                        </Picker>
                                    </View>

                                    <Text style={styles.inputLabel}>Prix (DH)</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={formData.price?.toString() || ''}
                                        onChangeText={(val) => setFormData({ ...formData, price: val })}
                                        placeholder="0.00"
                                    />
                                </>
                            )}

                            {activeTab === 'categories' && (
                                <>
                                    <Text style={styles.inputLabel}>Ordre d'affichage</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={formData.display_order?.toString() || ''}
                                        onChangeText={(val) => setFormData({ ...formData, display_order: val })}
                                    />
                                </>
                            )}

                            {(activeTab === 'categories' || activeTab === 'products') && (
                                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                    {formData.imageUri || formData.image ? (
                                        <Image source={{ uri: formData.imageUri || `${STORAGE_URL}${formData.image}` }} style={styles.pickedImage} />
                                    ) : (
                                        <View style={{ alignItems: 'center' }}>
                                            <ImageIcon size={30} color="#cbd5e1" />
                                            <Text style={{ color: '#94a3b8', marginTop: 5 }}>Image</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Enregistrer</Text>}
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
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
    imageContainer: { width: 55, height: 55, borderRadius: 10, backgroundColor: '#f1f5f9', overflow: 'hidden' },
    itemImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    infoContainer: { flex: 1, marginLeft: 12 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    itemName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    orderBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    orderBadgeText: { fontSize: 10, color: '#64748b', fontWeight: 'bold' },
    priceText: { fontSize: 14, fontWeight: 'bold', color: '#2ecc71', marginRight: 10 },
    productMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    categoryBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#dbeafe' },
    categoryBadgeText: { fontSize: 10, color: '#2563eb', fontWeight: '800' },
    actionContainer: { flexDirection: 'row' },
    actionBtn: { padding: 8, marginLeft: 4 },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2ecc71', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    inputLabel: { fontSize: 14, color: '#475569', marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
    pickerContainer: { backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
    imagePicker: { height: 100, backgroundColor: '#f8fafc', borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    pickedImage: { width: '100%', height: '100%', borderRadius: 15 },
    saveBtn: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 12, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    placeholderIcon: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});