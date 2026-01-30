import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    pageHeader: {
        backgroundColor: '#2ecc71',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
    },
    pageTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    datePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 10,
    },
    dateText: { color: '#fff', marginLeft: 8, fontWeight: '600' },

    summaryBox: {
        margin: 15,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 3,
    },
    mainStat: { alignItems: 'center', marginBottom: 15 },
    statLabel: { color: '#94a3b8', fontSize: 12 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },

    subStats: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 15,
    },
    subItem: { flex: 1, alignItems: 'center' },
    subLabel: { fontSize: 11, color: '#94a3b8' },
    subValue: { fontSize: 16, fontWeight: 'bold' },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 15,
        color: '#475569',
    },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 16,
        borderRadius: 18,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    rowAlign: { flexDirection: 'row', alignItems: 'center' },
    barmanName: {
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1e293b',
    },

    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: 'bold' },

    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { marginLeft: 8, fontSize: 12, color: '#64748b' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    footerLabel: { fontSize: 10, color: '#94a3b8' },
    footerValueSales: { fontSize: 14, fontWeight: 'bold', color: '#2ecc71' },
    footerValueExp: { fontSize: 14, fontWeight: 'bold', color: '#e74c3c' },
    footerValueOrd: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6' },

    emptyBox: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#94a3b8', marginTop: 10 },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalOverlayDark: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        height: '85%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
    modalSubTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#64748b',
        marginTop: 20,
        marginBottom: 12,
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    statCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },

    statCardName: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    statCardTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginVertical: 4,
    },

    statCardFooter: { flexDirection: 'row', alignItems: 'center' },
    statCardCount: { fontSize: 11, color: '#94a3b8', marginLeft: 4 },

    orderListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#cbd5e1',
        elevation: 1,
    },

    orderNumText: { fontWeight: 'bold', color: '#1e293b', fontSize: 14 },
    orderTimeText: { fontSize: 11, color: '#94a3b8' },
    orderAmountText: { fontWeight: 'bold', fontSize: 15 },
    orderTypeText: { fontSize: 10, color: '#94a3b8' },

    orderItemsBox: {
        backgroundColor: '#fff',
        borderRadius: 25,
        width: width * 0.92,
        maxHeight: '80%',
        padding: 20,
    },

    dashboardItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
    },

    dashProdName: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
    dashProdInfo: { fontSize: 12, color: '#64748b' },

    dashPriceBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

    dashPriceText: {
        fontWeight: 'bold',
        color: '#2ecc71',
        fontSize: 13,
    },

    dashTotalRow: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#2ecc71',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dashTotalLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },

    dashTotalValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },

    productImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        marginRight: 12,
    },
});
