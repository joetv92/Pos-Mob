import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon } from 'lucide-react-native';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Config } from '../../../constants/Config';

export const ImagePickerField = ({ label, currentImage, localUri, onImagePicked }) => {

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission', 'Accès à la galerie refusé');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // استخدام المصفوفة لتجنب تحذير Deprecated
            mediaTypes: ['images'],
            allowsEditing: false, // ❌ تم التعطيل لمنع الـ Resize أو الـ Crop
            quality: 1, // جودة كاملة
        });

        if (!result.canceled) {
            onImagePicked(result.assets[0].uri);
        }
    };

    // منطق عرض الصورة: المحلية أولاً ثم صورة السيرفر
    const finalUri = localUri ? localUri : (currentImage ? `${Config.STORAGE_URL}${currentImage}?v=${Date.now()}` : null);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.pickerContainer}
                onPress={pickImage}
                activeOpacity={0.8}
            >
                {finalUri ? (
                    <Image source={{ uri: finalUri }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.placeholder}>
                        <ImageIcon color="#94a3b8" size={32} />
                        <Text style={styles.placeholderText}>Sélectionner une image</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    label: { fontSize: 14, color: '#475569', marginBottom: 8, fontWeight: '600' },
    pickerContainer: {
        height: 180,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    imagePreview: { width: '100%', height: '100%', resizeMode: 'contain' }, // استخدام contain للحفاظ على أبعاد الصورة الأصلية في العرض
    placeholder: { alignItems: 'center' },
    placeholderText: { color: '#94a3b8', fontSize: 13, marginTop: 10 },
});