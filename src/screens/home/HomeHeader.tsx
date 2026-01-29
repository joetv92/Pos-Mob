import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './home.styles';

export const HomeHeader = ({ name }: { name: string }) => (
    <View style={styles.headerInfo}>
        <View>
            <Text style={styles.barmanName}>{name}</Text>
        </View>
    </View>
);