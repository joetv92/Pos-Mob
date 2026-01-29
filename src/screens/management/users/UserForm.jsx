import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../../api/axios';
import { InputLabel, RoleChip, StatusSwitch } from '../ManagementUI';

export const UserForm = ({ item, onSuccess }) => {
    const [name, setName] = useState(item?.name || '');
    const [pin, setPin] = useState(item?.pin || '');
    const [active, setActive] = useState(item?.active ?? true);
    const [roles, setRoles] = useState(item?.roles?.map(r => r.name || r) || []);
    const [loading, setLoading] = useState(false);

    const toggleRole = (role) => {
        setRoles(roles.includes(role) ? roles.filter(r => r !== role) : [...roles, role]);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = { name, pin, active: active ? 1 : 0, roles };
            if (item?.id) await api.put(`/users/${item.id}`, payload);
            else await api.post('/users', payload);
            onSuccess();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <View>
            <InputLabel label="Nom" />
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <InputLabel label="Rôles" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                {['manager', 'serveur', 'barman'].map(r => (
                    <RoleChip key={r} role={{ id: r, label: r.toUpperCase() }} isSelected={roles.includes(r)} onPress={toggleRole} />
                ))}
            </View>

            <InputLabel label="PIN" />
            <TextInput style={styles.input} keyboardType="numeric" maxLength={4} value={pin} onChangeText={setPin} />

            <StatusSwitch label="Actif" value={active} onValueChange={setActive} />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Enregistrer</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
    saveBtn: { backgroundColor: '#e67e22', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    saveBtnText: { color: '#fff', fontWeight: 'bold' }
});