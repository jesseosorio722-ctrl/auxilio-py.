import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { colors } from './src/theme';

const PROVIDERS = [
  { id: '1', name: 'Gruas Norte PY', km: 7, eta: 12, rating: 4.9, capacity: '30 t', online: true },
  { id: '2', name: 'Auxilio Canindeyu', km: 14, eta: 22, rating: 4.8, capacity: '25 t', online: true },
  { id: '3', name: 'Gruas San Jorge', km: 23, eta: 35, rating: 4.7, capacity: '25 t', online: true },
];

function Button({ title, onPress, secondary = false, danger = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.buttonSecondary,
        danger && styles.buttonDanger,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default' }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

function AppHeader({ role, onBack }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.brand}>🚛 Auxilio PY</Text>
        <Text style={styles.subtitle}>Assistência rodoviária conectada</Text>
      </View>
      {role ? (
        <Pressable onPress={onBack} style={styles.smallChip}>
          <Text style={styles.chipText}>Trocar perfil</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function RoleChooser({ onChoose }) {
  return (
    <View style={styles.roleGrid}>
      <Pressable style={styles.roleCard} onPress={() => onChoose('client')}>
        <Text style={styles.roleEmoji}>🆘</Text>
        <Text style={styles.roleTitle}>Cliente</Text>
        <Text style={styles.roleText}>Preciso de ajuda na estrada</Text>
      </Pressable>
      <Pressable style={styles.roleCard} onPress={() => onChoose('provider')}>
        <Text style={styles.roleEmoji}>🚛</Text>
        <Text style={styles.roleTitle}>Prestador</Text>
        <Text style={styles.roleText}>Tenho grua ou assistência</Text>
      </Pressable>
      <Pressable style={styles.roleCard} onPress={() => onChoose('admin')}>
        <Text style={styles.roleEmoji}>🛡️</Text>
        <Text style={styles.roleTitle}>Admin</Text>
        <Text style={styles.roleText}>Gerenciar a plataforma</Text>
      </Pressable>
    </View>
  );
}

function ClientScreen() {
  const [vehicle, setVehicle] = useState('Caminhão');
  const [problem, setProblem] = useState('Grua / Guincho pesado');
  const [reference, setReference] = useState('');
  const [coords, setCoords] = useState(null);
  const [stage, setStage] = useState('form');
  const [selected, setSelected] = useState(null);

  async function useLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Localização', 'Permissão de localização não concedida. Você ainda pode informar uma referência manualmente.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setReference(`Localização GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
    } catch (e) {
      Alert.alert('Localização', 'Não foi possível obter a localização agora.');
    }
  }

  function search() {
    if (!reference.trim()) {
      Alert.alert('Informe sua localização', 'Use o GPS ou escreva uma referência da estrada.');
      return;
    }
    setStage('providers');
  }

  function requestProvider(p) {
    setSelected(p);
    setStage('calling');
  }

  function simulateAccept() {
    setStage('tracking');
  }

  if (stage === 'tracking' && selected) {
    return (
      <View style={styles.screenGap}>
        <Card>
          <Text style={styles.successTitle}>✅ Atendimento confirmado</Text>
          <Text style={styles.title}>{selected.name}</Text>
          <Text style={styles.muted}>Prestador verificado • {selected.rating} ★</Text>
          <View style={styles.statsRow}>
            <Stat value={`${selected.km} km`} label="Distância" />
            <Stat value={`${selected.eta} min`} label="Chegada" />
            <Stat value={selected.capacity} label="Capacidade" />
          </View>
          <Text style={styles.infoLine}>Veículo: {vehicle}</Text>
          <Text style={styles.infoLine}>Problema: {problem}</Text>
          <Text style={styles.infoLine}>Local: {reference}</Text>
        </Card>
        <Button title="📞 Contatar prestador" onPress={() => Alert.alert('Contato', 'Aqui será integrado telefone/WhatsApp do prestador.')} />
        <Button title="Finalizar atendimento" secondary onPress={() => { setStage('form'); setSelected(null); }} />
      </View>
    );
  }

  if (stage === 'calling' && selected) {
    return (
      <View style={styles.screenGap}>
        <Card>
          <Text style={styles.title}>🔔 Chamando {selected.name}</Text>
          <Text style={styles.muted}>Sua localização e dados do veículo foram enviados.</Text>
          <View style={styles.statusBox}><Text style={styles.statusText}>Aguardando o prestador aceitar...</Text></View>
        </Card>
        <Button title="Simular aceite do prestador" onPress={simulateAccept} />
        <Button title="Cancelar" danger onPress={() => setStage('providers')} />
      </View>
    );
  }

  if (stage === 'providers') {
    return (
      <View style={styles.screenGap}>
        <Text style={styles.sectionTitle}>Prestadores próximos</Text>
        {PROVIDERS.map((p) => (
          <Card key={p.id}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{p.name}</Text>
                <Text style={styles.muted}>Grua pesada • capacidade {p.capacity}</Text>
              </View>
              <Text style={styles.rating}>{p.rating} ★</Text>
            </View>
            <Text style={styles.infoLine}>{p.km} km • chegada aproximada {p.eta} min</Text>
            <Button title="Solicitar" onPress={() => requestProvider(p)} />
          </Card>
        ))}
        <Button title="Voltar" secondary onPress={() => setStage('form')} />
      </View>
    );
  }

  return (
    <View style={styles.screenGap}>
      <Card>
        <Text style={styles.emergency}>🆘 PRECISO DE AJUDA AGORA</Text>
        <Text style={styles.muted}>Informe o veículo, problema e sua localização.</Text>
        <Field label="Veículo" value={vehicle} onChangeText={setVehicle} placeholder="Caminhão" />
        <Field label="Serviço" value={problem} onChangeText={setProblem} placeholder="Grua / Guincho" />
        <Field label="Localização / referência" value={reference} onChangeText={setReference} placeholder="Ex.: Ruta PY03, km 250" />
        <Button title="📍 Usar minha localização" secondary onPress={useLocation} />
        {coords ? <Text style={styles.muted}>GPS confirmado.</Text> : null}
        <Button title="Buscar prestadores próximos" onPress={search} />
      </Card>
    </View>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProviderScreen() {
  const [online, setOnline] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [basePrice, setBasePrice] = useState('250000');
  const [priceKm, setPriceKm] = useState('15000');
  const total = useMemo(() => (Number(basePrice || 0) + Number(priceKm || 0) * 32), [basePrice, priceKm]);

  return (
    <View style={styles.screenGap}>
      <Card>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.title}>Gruas Norte PY</Text>
            <Text style={styles.muted}>Prestador verificado</Text>
          </View>
          <View style={styles.switchWrap}>
            <Switch value={online} onValueChange={setOnline} />
            <Text style={styles.muted}>{online ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Nova solicitação</Text>
        <Text style={styles.infoLine}>Cliente: Transportadora Silva</Text>
        <Text style={styles.infoLine}>Veículo: Scania R420</Text>
        <Text style={styles.infoLine}>Local: Ruta PY03 — Katueté</Text>
        <Text style={styles.infoLine}>Distância: 7 km</Text>
        <Field label="Taxa de saída (Gs.)" value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" />
        <Field label="Valor por km (Gs.)" value={priceKm} onChangeText={setPriceKm} keyboardType="numeric" />
        <Text style={styles.total}>Total estimado: Gs. {total.toLocaleString('es-PY')}</Text>
        {!accepted ? (
          <>
            <Button title="Aceitar e enviar proposta" onPress={() => setAccepted(true)} />
            <Button title="Recusar" danger onPress={() => Alert.alert('Solicitação', 'Solicitação recusada.')} />
          </>
        ) : (
          <View style={styles.statusBox}><Text style={styles.statusText}>✅ Proposta enviada. Aguardando confirmação do cliente.</Text></View>
        )}
      </Card>
    </View>
  );
}

function AdminScreen() {
  const [approved, setApproved] = useState(false);
  const [suspended, setSuspended] = useState(false);

  return (
    <View style={styles.screenGap}>
      <View style={styles.statsRow}>
        <Stat value="126" label="Prestadores" />
        <Stat value="43" label="Online" />
        <Stat value="28" label="Hoje" />
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Cadastro pendente</Text>
        <Text style={styles.title}>Gruas Paraguay Express</Text>
        <Text style={styles.infoLine}>Região: Central</Text>
        <Text style={styles.infoLine}>Serviço: Grua pesada</Text>
        <Text style={styles.infoLine}>Capacidade: 30 toneladas</Text>
        <Text style={styles.infoLine}>✅ Documento enviado</Text>
        <Text style={styles.infoLine}>✅ Foto da grua enviada</Text>
        {!approved ? (
          <Button title="Aprovar prestador" onPress={() => setApproved(true)} />
        ) : (
          <View style={styles.statusBox}><Text style={styles.statusText}>✅ Prestador aprovado</Text></View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Gruas Norte PY</Text>
        <Text style={styles.muted}>4.9 ★ • 94 atendimentos • Plano Profissional</Text>
        <Button
          title={suspended ? 'Reativar prestador' : 'Suspender prestador'}
          danger={!suspended}
          onPress={() => setSuspended((v) => !v)}
        />
      </Card>
    </View>
  );
}

export default function App() {
  const [role, setRole] = useState(null);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppHeader role={role} onBack={() => setRole(null)} />
        {!role ? <RoleChooser onChoose={setRole} /> : null}
        {role === 'client' ? <ClientScreen /> : null}
        {role === 'provider' ? <ProviderScreen /> : null}
        {role === 'admin' ? <AdminScreen /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 18, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  brand: { color: colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: 3 },
  smallChip: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  chipText: { color: colors.text, fontSize: 12 },
  roleGrid: { gap: 12 },
  roleCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18 },
  roleEmoji: { fontSize: 30 },
  roleTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 8 },
  roleText: { color: colors.muted, marginTop: 4 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16, gap: 10 },
  screenGap: { gap: 14 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  emergency: { color: colors.text, fontSize: 20, fontWeight: '900' },
  muted: { color: colors.muted, lineHeight: 20 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  fieldWrap: { marginTop: 4 },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 12, color: colors.text, backgroundColor: colors.card2 },
  button: { minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, backgroundColor: colors.primary, marginTop: 4 },
  buttonSecondary: { backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.border },
  buttonDanger: { backgroundColor: colors.danger },
  buttonText: { color: colors.white, fontWeight: '800', textAlign: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  rating: { color: colors.text, fontWeight: '800' },
  infoLine: { color: colors.text, lineHeight: 22 },
  statusBox: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card2, borderRadius: 14, padding: 13 },
  statusText: { color: colors.text, fontWeight: '700' },
  successTitle: { color: '#4ade80', fontSize: 18, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 3, textAlign: 'center' },
  switchWrap: { alignItems: 'center' },
  total: { color: colors.text, fontSize: 17, fontWeight: '900', paddingVertical: 4 },
});
