import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../../api/axios';
import { InputLabel } from '../ManagementUI';
import { ImagePickerField } from '../common/ImagePickerField';

export const CategoryForm = ({ item, onSuccess }) => {
    const [name, setName] = useState(item?.name || '');
    const [localUri, setLocalUri] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Erreur", "Le nom est obligatoire");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('name', name);

        if (localUri) {
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;
            data.append('image', { uri: localUri, name: filename, type });
        }

        try {
            if (item?.id) {
                // استخدام POST مع _method PUT للتوافق مع Laravel و FormData
                data.append('_method', 'PUT');
                await api.post(`/categories/${item.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // إضافة فئة جديدة
                await api.post('/categories', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSuccess();
        } catch (e) {
            console.error("Save Error:", e.response?.data);
            const serverError = e.response?.data?.message || "Impossible d'enregistrer.";
            Alert.alert("Erreur", serverError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <InputLabel label="Nom de la catégorie" />
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Boissons Chaudes"
            />

            <ImagePickerField
                label="Image (Format original)"
                currentImage={item?.image}
                localUri={localUri}
                onImagePicked={setLocalUri}
            />

            <TouchableOpacity
                style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveBtnText}>
                        {item?.id ? "Modifier" : "Enregistrer"}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingVertical: 10 },
    input: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        color: '#1e293b'
    },
    saveBtn: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});