import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Receipt } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../../api/axios';
import SessionCard from './components/SessionCard';
import SessionDetailsModal from './components/SessionDetailsModal';
import SummaryBox from './components/SummaryBox';
import { styles } from './styles';

export default function SessionPage() {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);

    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [sessionModalVisible, setSessionModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await api.get(`/sessions/archive?date=${formattedDate}`);
            setSessions(response.data.sessions || []);
        } catch (e) {
            console.log('API ERROR', e);
        } finally {
            setLoading(false);
        }
    };

    const globalStats = useMemo(() => {
        let sales = 0;
        let expenses = 0;

        sessions.forEach(s => {
            s.orders?.forEach((o: any) => {
                if (!o.cancelled) {
                    const amount = parseFloat(o.total_amount);
                    if (o.type === 'sale') sales += amount;
                    if (o.type === 'expense') expenses += amount;
                }
            });
        });

        return { sales, expenses };
    }, [sessions]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Archives Sessions</Text>
                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
                    <Calendar size={18} color="#fff" />
                    <Text style={styles.dateText}>{date.toDateString()}</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={(e, d) => {
                        setShowDatePicker(false);
                        if (d) setDate(d);
                    }}
                />
            )}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2ecc71" />
                </View>
            ) : (
                <ScrollView>
                    <SummaryBox stats={globalStats} />

                    <Text style={styles.sectionTitle}>
                        <Receipt size={18} color="#475569" /> Liste des Sessions
                    </Text>

                    {sessions.map(s => (
                        <SessionCard
                            key={s.id}
                            item={s}
                            onPress={() => {
                                setSelectedSession(s);
                                setSessionModalVisible(true);
                            }}
                        />
                    ))}
                </ScrollView>
            )}

            <SessionDetailsModal
                visible={sessionModalVisible}
                session={selectedSession}
                onClose={() => setSessionModalVisible(false)}
            />
        </SafeAreaView>
    );
}
