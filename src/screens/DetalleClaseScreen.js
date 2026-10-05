import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatearPrecio } from '../data/clases';
import { colors, spacing, typography } from '../theme';
import { useClases } from '../context/ClasesContext';
import NivelChip from '../components/NivelChip';

export default function DetalleClaseScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { clase: claseParam } = route.params || {};
  const { clases, reservarClase, cancelarClase, reservadas } = useClases();
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  const clase = clases.find((c) => c.id === (claseParam?.id ?? claseParam));
  if (!clase) return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={typography.titulo}>Clase no encontrada</Text>
    </View>
  );

  const estaReservada = reservadas.has(clase.id);
  const horarioReservado = reservadas.get(clase.id);

  function handleReservar() {
    if (clase.cupos <= 0) {
      Alert.alert('Sin cupos', 'Lo sentimos, no hay cupos disponibles.');
      return;
    }
    if (!horarioSeleccionado) {
      Alert.alert('Elige un horario', 'Selecciona uno de los horarios disponibles para agendar.');
      return;
    }
    reservarClase(clase.id, horarioSeleccionado);
    Alert.alert('Reserva confirmada', `Has reservado la clase para el horario: ${horarioSeleccionado}.`);
  }

  function handleCancelar() {
    if (!estaReservada) {
      Alert.alert('No reservada', 'No tienes una reserva activa para esta clase.');
      return;
    }
    cancelarClase(clase.id);
    setHorarioSeleccionado(null);
    Alert.alert('Reserva cancelada', 'Se ha liberado el cupo de la clase.');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.lg }}
      >
        <Image source={{ uri: clase.imagen }} style={styles.image} />
        <Text style={styles.title}>{clase.titulo}</Text>
        <Text style={styles.subtitle}>{clase.nivel} • {clase.modalidad} • {clase.duracion} min</Text>
        <Text style={styles.price}>{formatearPrecio(clase.precio)}</Text>
        <Text style={styles.description}>{clase.descripcion}</Text>

        <Text style={styles.cupos}>Cupos disponibles: {clase.cupos}</Text>
        {estaReservada && (
          <Text style={styles.reservaInfo}>Reservada para: {horarioReservado}</Text>
        )}

        <Text style={styles.sectionTitle}>Horarios disponibles</Text>
        <View style={styles.horarios}>
          {clase.horarios?.map((horario) => (
            <NivelChip
              key={horario}
              etiqueta={horario}
              activo={horarioSeleccionado === horario}
              onPress={() => setHorarioSeleccionado(horario)}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.button, { backgroundColor: colors.primario }]} onPress={handleReservar}>
            <Text style={styles.buttonText}>Reservar</Text>
          </Pressable>
          <Pressable style={[styles.button, { backgroundColor: colors.peligro }]} onPress={handleCancelar}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.lg },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.texto, marginBottom: spacing.xs },
  subtitle: { color: colors.textoSuave, marginBottom: spacing.sm },
  price: { color: colors.primario, fontWeight: '700', marginBottom: spacing.sm },
  description: { color: colors.texto, marginBottom: spacing.sm },
  cupos: { fontWeight: '700', marginVertical: spacing.sm },
  reservaInfo: { color: colors.exito, fontWeight: '600', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.texto, marginBottom: spacing.sm },
  horarios: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.sm, marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});