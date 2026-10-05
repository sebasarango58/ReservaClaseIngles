import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, radius, spacing, typography } from '../theme';

export default function EstadoVacio({ icono, titulo, mensaje, onAction }) {
  return (
    <View style={styles.contenedor}>
      <Ionicons name={icono} size={48} color={colors.textoSuave} />
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {onAction && (
        <Pressable style={styles.boton} onPress={onAction}>
          <Text style={styles.botonTexto}>Limpiar filtros</Text>
        </Pressable>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
   },
  titulo: { ...typography.subtitulo, marginTop: spacing.sm, textAlign: 'center' },
  mensaje: { ...typography.secundario, textAlign: 'center' },
  boton: {
    marginTop: spacing.md,
    backgroundColor: colors.primario,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  botonTexto: { color: '#FFFFFF', fontWeight: '700' },
});