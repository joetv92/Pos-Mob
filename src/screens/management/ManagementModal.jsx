import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryForm } from './categories/CategoryForm';
import { ProductForm } from './products/ProductForm';
import { UserForm } from './users/UserForm';

export const ManagementModal = ({ visible, onClose, activeTab, editingItem, categories, onRefresh }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <View style={styles.content}>
                    {/* الرأس */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {editingItem ? 'Modifier' : 'Ajouter'} {activeTab === 'categories' ? 'Catégorie' : activeTab === 'products' ? 'Produit' : 'Utilisateur'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X color="#1e293b" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* النماذج */}
                    <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                        {activeTab === 'categories' && (
                            <CategoryForm item={editingItem} onSuccess={() => { onRefresh(); onClose(); }} />
                        )}
                        {activeTab === 'products' && (
                            <ProductForm item={editingItem} categories={categories} onSuccess={() => { onRefresh(); onClose(); }} />
                        )}
                        {activeTab === 'users' && (
                            <UserForm item={editingItem} onSuccess={() => { onRefresh(); onClose(); }} />
                        )}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '85%',
        width: '100%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    title: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
    closeBtn: { padding: 5 },
    body: { paddingHorizontal: 20, paddingTop: 10 }
});