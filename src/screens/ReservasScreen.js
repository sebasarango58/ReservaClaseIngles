import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useReserva from '../hooks/useReservas';
import { colors, radius, spacing, typography } from '../theme';

// Pantalla que muestra todas las reservas del estudiante.
export default function ReservasScreen() {
  const insets = useSafeAreaInsets();
  const { reservas, creditos, cancelarReserva, cargando } = useReserva();

  function confirmarCancelacion(reserva) {
    Alert.alert(
      'Cancelar reserva',
      `¿Quieres cancelar "${reserva.titulo}"? El crédito será devuelto.`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => cancelarReserva(reserva.id),
        },
      ]
    );
  }

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.encabezado}>
        <View>
          <Text style={typography.titulo}>Mis reservas</Text>
          <Text style={typography.secundario}>Clases que tienes agendadas.</Text>
        </View>
        <View style={styles.creditos}>
          <Ionicons name="wallet-outline" size={18} color={colors.acento} />
          <Text style={styles.creditosTexto}>{creditos}</Text>
        </View>
      </View>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={reservas.length === 0 ? styles.listaVacia : styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <View style={styles.vacio}>
            <Ionicons name="calendar-outline" size={56} color={colors.textoSuave} />
            <Text style={styles.vacioTitulo}>
              {cargando ? 'Cargando reservas...' : 'Todavía no tienes reservas'}
            </Text>
            <Text style={styles.vacioTexto}>
              Cuando reserves una clase aparecerá aquí.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <View style={styles.icono}>
              <Ionicons name="school-outline" size={22} color={colors.primario} />
            </View>

            <View style={styles.info}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.detalle}>{item.nivel} · {item.modalidad}</Text>
              <Text style={styles.detalle}>Profesor: {item.profesor}</Text>
              <Text style={styles.horario}>{item.horario}</Text>
            </View>

            <Ionicons
              name="close-circle-outline"
              size={26}
              color={colors.peligro}
              onPress={() => confirmarCancelacion(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.lg },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  creditos: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.acentoSuave, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  creditosTexto: { color: colors.acento, fontWeight: '800' },
  lista: { paddingBottom: spacing.xxl },
  listaVacia: { flexGrow: 1, justifyContent: 'center' },
  vacio: { alignItems: 'center', padding: spacing.xl },
  vacioTitulo: { ...typography.subtitulo, marginTop: spacing.md, textAlign: 'center' },
  vacioTexto: { ...typography.secundario, textAlign: 'center', marginTop: spacing.sm },
  tarjeta: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.superficie, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.md },
  icono: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primarioSuave, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  titulo: { color: colors.texto, fontWeight: '800', fontSize: 15 },
  detalle: { color: colors.textoSuave, fontSize: 12, marginTop: 3 },
  horario: { color: colors.acento, fontWeight: '700', marginTop: spacing.sm },
});
