import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../../api/axios';
import { InputLabel } from '../ManagementUI';
import { ImagePickerField } from '../common/ImagePickerField';

export const ProductForm = ({ item, categories, onSuccess }) => {
    const [title, setTitle] = useState(item?.title || '');
    const [price, setPrice] = useState(item?.price?.toString() || '');
    const [categoryId, setCategoryId] = useState(item?.category_id || (categories.length > 0 ? categories[0].id : null));
    const [localUri, setLocalUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const data = new FormData();
        data.append('title', title);
        data.append('price', price);
        data.append('category_id', categoryId);
        if (localUri) {
            data.append('image', { uri: localUri, name: 'prod.jpg', type: 'image/jpeg' });
        }

        try {
            if (item?.id) {
                data.append('_method', 'PUT');
                await api.post(`/products/${item.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSuccess();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <InputLabel label="Titre" />
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <InputLabel label="Catégorie" />
            <View style={styles.pickerBox}>
                <Picker selectedValue={categoryId} onValueChange={(v) => setCategoryId(v)}>
                    {categories.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
                </Picker>
            </View>

            <InputLabel label="Prix" />
            <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />

            <ImagePickerField
                label="Image du produit"
                currentImage={item?.image}
                localUri={localUri}
                onImagePicked={setLocalUri}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Enregistrer</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { paddingVertical: 10 },
    input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
    pickerBox: { backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15, overflow: 'hidden' },
    saveBtn: { backgroundColor: '#3498db', padding: 15, borderRadius: 12, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontWeight: 'bold' }
});