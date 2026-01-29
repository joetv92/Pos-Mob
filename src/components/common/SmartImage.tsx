import { Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors, Config } from '../../constants/Config';

export const SmartImage = ({ productId, uri, style }: any) => {
    const [extIdx, setExtIdx] = useState(0);
    const exts = ['jpeg', 'jpg', 'png'];
    const [error, setError] = useState(false);

    const source = uri ? { uri: uri.startsWith('http') ? uri : `${Config.STORAGE_URL}${uri}` }
        : { uri: `${Config.IMAGE_URL}${productId}.${exts[extIdx]}` };

    if (error) return <View style={[style, styles.fail]}><Package size={20} color={Colors.subText} /></View>;

    return (
        <Image source={source} style={style} onError={() => {
            if (!uri && extIdx < 2) setExtIdx(extIdx + 1);
            else setError(true);
        }} />
    );
};
const styles = StyleSheet.create({ fail: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' } });