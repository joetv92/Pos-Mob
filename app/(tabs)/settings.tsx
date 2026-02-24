import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { CheckCircle2, Languages } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { changeLanguage } from '../../src/i18n/config';
export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const handleLangChange = async (lang: 'ar' | 'fr') => {
        if (currentLanguage !== lang) {
            await changeLanguage(lang);
        }
    };
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('posId'); // إذا كنت تخزنه

        router.replace('/login');
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Languages size={40} color="#2ecc71" />
                <Text style={styles.title}>{t('change_lang')}</Text>
            </View>

            <View style={styles.optionsContainer}>
                {/* خيار اللغة العربية */}
                <TouchableOpacity
                    style={[styles.langCard, currentLanguage === 'ar' && styles.activeCard]}
                    onPress={() => handleLangChange('ar')}
                >
                    <Text style={styles.langText}>العربية (Arabic)</Text>
                    {currentLanguage === 'ar' && <CheckCircle2 size={24} color="#2ecc71" />}
                </TouchableOpacity>

                {/* خيار اللغة الفرنسية */}
                <TouchableOpacity
                    style={[styles.langCard, currentLanguage === 'fr' && styles.activeCard]}
                    onPress={() => handleLangChange('fr')}
                >
                    <Text style={styles.langText}>Français (French)</Text>
                    {currentLanguage === 'fr' && <CheckCircle2 size={24} color="#2ecc71" />}
                </TouchableOpacity>
            </View>

            <Text style={styles.footerNote}>
                {currentLanguage === 'ar'
                    ? "سيتم إعادة تشغيل التطبيق لتغيير الاتجاه"
                    : "L'application va redémarrer pour appliquer les changements"}
            </Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>
                    {currentLanguage === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    header: { alignItems: 'center', marginVertical: 30 },
    title: { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#2c3e50' },
    optionsContainer: { marginTop: 20 },
    langCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    activeCard: { borderColor: '#2ecc71', borderWidth: 2 },
    langText: { fontSize: 18, fontWeight: '600', color: '#34495e' },
    footerNote: { textAlign: 'center', color: '#95a5a6', marginTop: 20, fontSize: 14 },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});