import { Check } from 'lucide-react-native';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export const InputLabel = ({ label }) => (
    <Text style={styles.label}>{label}</Text>
);

export const RoleChip = ({ role, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.chip, isSelected && styles.chipActive]}
        onPress={() => onPress(role.id)}
    >
        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{role.label}</Text>
        {isSelected && <Check size={14} color="#fff" style={{ marginLeft: 5 }} />}
    </TouchableOpacity>
);

export const StatusSwitch = ({ label, value, onValueChange }) => (
    <View style={styles.switchRow}>
        <InputLabel label={label} />
        <Switch value={!!value} onValueChange={onValueChange} trackColor={{ true: '#2ecc71' }} />
    </View>
);

const styles = StyleSheet.create({
    label: { fontSize: 13, color: '#475569', marginBottom: 8, fontWeight: '600', marginTop: 10 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    chipActive: { backgroundColor: '#2ecc71', borderColor: '#27ae60' },
    chipText: { fontSize: 12, color: '#64748b' },
    chipTextActive: { color: '#fff', fontWeight: 'bold' },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }
});