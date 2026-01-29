import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Config';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bg, padding: 15 },
    headerInfo: { marginTop: 40, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    barmanName: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statBox: { width: '48%', padding: 15, borderRadius: 15, elevation: 4 },
    statLabel: { color: '#fff', fontSize: 12, marginTop: 5 },
    statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15, color: Colors.text },

    // Order Card Styles
    orderCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderLeftWidth: 5, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    idSection: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    orderNumber: { fontWeight: 'bold', color: Colors.text },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    typeText: { fontSize: 10, fontWeight: 'bold' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timeSection: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dateText: { fontSize: 11, color: Colors.subText },
    amountText: { fontWeight: 'bold', fontSize: 15 },
    cancelledCard: { opacity: 0.6, backgroundColor: '#f1f5f9' },
    strikeThrough: { textDecorationLine: 'line-through' },

    // Server Section
    serverSection: { padding: 15, backgroundColor: '#fff', borderRadius: 15, elevation: 2, marginBottom: 10 },
    serverRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    productImage: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#f8fafc', marginRight: 12 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' }
});