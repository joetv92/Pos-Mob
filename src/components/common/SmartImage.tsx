import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Config } from '../../constants/Config';

export const SmartImage = ({ uri, style }: any) => {

    const source = `${Config.STORAGE_URL}${uri}?v=${Date.now()}`;

    return (
        <Image source={{ uri: source }} style={style} />
    );
};
const styles = StyleSheet.create({ fail: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' } });