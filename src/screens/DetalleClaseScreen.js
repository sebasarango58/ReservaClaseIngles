import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatearPrecio } from '../data/clases';
import { colors, spacing, typography, radius } from '../theme';
import useReserva from '../hooks/useReservas';
import NivelChip from '../components/NivelChip';
import { CLASES } from '../data/clases';

// Pantalla de detalle de una clase y selección de horario.
export default function DetalleClaseScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { clase: claseParam } = route.params || {};
  const { reservas, creditos, agregarReserva, cancelarReserva, estaReservada, cantidadEnHorario } = useReserva();
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // Buscamos la clase original en los datos del proyecto.
  const clase = useMemo(
    () => CLASES.find((item) => item.id === (claseParam?.id ?? claseParam)),
    [claseParam]
  );

  if (!clase) {
    return (
      <View style={styles.container}>
        <Text style={typography.titulo}>Clase no encontrada</Text>
      </View>
    );
  }

  // Cantidad de reservas de esta misma clase.
  const reservasDeClase = reservas.filter((reserva) => reserva.claseId === clase.id).length;
  const cuposDisponibles = Math.max(0, clase.cupos - reservasDeClase);

  function handleReservar() {
    if (!horarioSeleccionado) {
      Alert.alert('Elige un horario', 'Selecciona uno de los horarios disponibles.');
      return;
    }

    if (creditos <= 0) {
      Alert.alert('Sin créditos', 'No tienes créditos disponibles para realizar esta reserva.');
      return;
    }

    if (cuposDisponibles <= 0) {
      Alert.alert('Sin cupos', 'Esta clase ya no tiene cupos disponibles.');
      return;
    }

    const resultado = agregarReserva(clase, horarioSeleccionado);

    if (!resultado.ok) {
      Alert.alert('No se puede reservar', resultado.mensaje);
      return;
    }

    Alert.alert('Reserva confirmada', `Reservaste "${clase.titulo}" para ${horarioSeleccionado}.`);
  }

  function handleCancelarHorario() {
    const reserva = reservas.find(
      (item) => item.claseId === clase.id && item.horario === horarioSeleccionado
    );

    if (!reserva) {
      Alert.alert('Sin reserva', 'No tienes una reserva para ese horario.');
      return;
    }

    cancelarReserva(reserva.id);
    setHorarioSeleccionado(null);
    Alert.alert('Reserva cancelada', 'El crédito fue devuelto.');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <Image source={{ uri: clase.imagen }} style={styles.image} />

        <View style={styles.encabezadoFila}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{clase.titulo}</Text>
            <Text style={styles.subtitle}>{clase.nivel} · {clase.modalidad} · {clase.duracion} min</Text>
          </View>
          <Ionicons name="school-outline" size={28} color={colors.primario} />
        </View>

        <Text style={styles.price}>{formatearPrecio(clase.precio)}</Text>
        <Text style={styles.description}>{clase.descripcion}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Profesor: {clase.profesor.nombre}</Text>
          <Text style={styles.infoText}>Cupos disponibles: {cuposDisponibles}</Text>
          <Text style={styles.infoText}>Tu saldo: {creditos} créditos</Text>
        </View>

        <Text style={styles.sectionTitle}>Horarios disponibles</Text>
        <Text style={styles.helper}>No se crean horarios nuevos. Solo puedes elegir los horarios existentes.</Text>

        <View style={styles.horarios}>
          {clase.horarios?.map((horario) => {
            const reservada = estaReservada(clase.id, horario);
            const limiteHorario = cantidadEnHorario(horario) >= 2 && !reservada;

            return (
              <NivelChip
                key={horario}
                etiqueta={reservada ? `${horario} · Reservada` : horario}
                activo={horarioSeleccionado === horario}
                onPress={() => !limiteHorario && setHorarioSeleccionado(horario)}
              />
            );
          })}
        </View>

        {horarioSeleccionado && estaReservada(clase.id, horarioSeleccionado) ? (
          <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancelarHorario}>
            <Ionicons name="close-circle-outline" size={19} color="#FFFFFF" />
            <Text style={styles.buttonText}>Cancelar reserva</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.button, (creditos <= 0 || cuposDisponibles <= 0) && styles.buttonDisabled]} onPress={handleReservar}>
            <Ionicons name="calendar-outline" size={19} color="#FFFFFF" />
            <Text style={styles.buttonText}>Reservar clase · 1 crédito</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.lg },
  image: { width: '100%', height: 210, borderRadius: radius.lg, marginBottom: spacing.md },
  encabezadoFila: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: colors.texto, marginBottom: spacing.xs },
  subtitle: { color: colors.textoSuave },
  price: { color: colors.primario, fontWeight: '800', fontSize: 16, marginVertical: spacing.md },
  description: { color: colors.texto, lineHeight: 21, marginBottom: spacing.md },
  infoBox: { backgroundColor: colors.superficie, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs, marginBottom: spacing.lg },
  infoText: { color: colors.textoSuave },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.texto, marginBottom: spacing.xs },
  helper: { fontSize: 12, color: colors.textoSuave, marginBottom: spacing.md },
  horarios: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  button: { minHeight: 48, borderRadius: radius.md, backgroundColor: colors.primario, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md },
  cancelButton: { backgroundColor: colors.peligro },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
});
