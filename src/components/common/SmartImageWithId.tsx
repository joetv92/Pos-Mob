import { Package } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors, Config } from '../../constants/Config';

export const SmartImageWithId = ({ productId, style }: any) => {
    const [extIdx, setExtIdx] = useState(0);
    const [error, setError] = useState(false);

    const exts = ['jpeg', 'jpg', 'png'];

    // إعادة ضبط الحالة عند تغيير productId (مهم جداً عند إعادة استخدام المكون)
    useEffect(() => {
        setExtIdx(0);
        setError(false);
    }, [productId]);

    const handleImageError = () => {
        if (extIdx < exts.length - 1) {
            setExtIdx(prev => prev + 1);
        } else {
            setError(true);
        }
    };
    // إذا حدث خطأ نهائي في كل الامتدادات، نعرض أيقونة "Package"
    if (error || !productId) {
        return (
            <View style={[style, styles.fail]}>
                <Package size={20} color={Colors.subText || '#94a3b8'} />
            </View>
        );
    }
    return (
        <Image
            key={`${productId}-${extIdx}`} // إجبار المكون على إعادة التحميل عند تغيير الامتداد
            source={{
                uri: `${Config.IMAGE_URL}${productId}.${exts[extIdx]}`,
                // إضافة cache اختياري لتحسين الأداء
            }}
            style={style}
            onError={handleImageError}
            resizeMode="cover"
        />
    );
};
const styles = StyleSheet.create({ fail: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' } });