import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

// استيراد ملفات JSON
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';

const resources = {
    ar: { translation: ar },
    fr: { translation: fr }
};

// تهيئة i18n
i18n.use(initReactI18next).init({
    resources,
    lng: I18nManager.isRTL ? 'ar' : 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false }
});

export const changeLanguage = async (lang: 'ar' | 'fr') => {
    await AsyncStorage.setItem('user-language', lang);

    const isRTL = lang === 'ar';

    await i18n.changeLanguage(lang);

    if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);

        setTimeout(async () => {
            try {
                await Updates.reloadAsync();
            } catch (e) {
                console.error('فشل في إعادة التشغيل:', e);
            }
        }, 800);
    }
};


export default i18n;