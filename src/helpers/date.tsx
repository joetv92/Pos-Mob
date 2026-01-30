import { useTranslation } from 'react-i18next';
export const formatTime = (dateString: string) => {
    const { i18n } = useTranslation();
    return new Date(dateString).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
};