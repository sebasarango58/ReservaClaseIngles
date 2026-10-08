import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, coloresPorNivel, radius } from '../theme';

// Etiqueta visual que identifica el nivel de la clase.
export default function EtiquetaNivel({ nivel }) {
  const color = coloresPorNivel[nivel] || colors.primario;

  return (
    <View style={[styles.contenedor, { borderColor: color }]}>
      <Text style={[styles.texto, { color }]}>{nivel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    backgroundColor: colors.primarioSuave,
  },
  texto: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});


