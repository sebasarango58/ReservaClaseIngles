import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import NivelChip from '../components/NivelChip';
import EstadoVacio from '../components/EstadoVacio';
import useResponsive from '../hooks/useResponsive';
import { CLASES, NIVELES } from '../data/clases';
import { colors, radius, spacing, typography } from '../theme';
import useReserva from '../hooks/useReservas';

// Pantalla principal: muestra el menú de clases disponibles.
export default function InicioScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { columnas, paddingHorizontal } = useResponsive();
  const { creditos } = useReserva();
  const [nivel, setNivel] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtra las clases por nivel y texto buscado.
  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return CLASES.filter((clase) => {
      const coincideNivel = nivel === 'Todos' || clase.nivel === nivel;
      const coincideTexto = !texto ||
        clase.titulo.toLowerCase().includes(texto) ||
        clase.profesor.nombre.toLowerCase().includes(texto);

      return coincideNivel && coincideTexto;
    });
  }, [nivel, busqueda]);

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top + spacing.sm }]}>
      <View style={{ paddingHorizontal, gap: spacing.sm }}>
        <View style={styles.encabezado}>
          <View style={styles.encabezadoTexto}>
            <Text style={typography.titulo}>Clases de inglés</Text>
            <Text style={typography.secundario}>Elige una clase y reserva tu horario.</Text>
          </View>
          <View style={styles.creditos}>
            <Ionicons name="wallet-outline" size={18} color={colors.acento} />
            <Text style={styles.creditosTexto}>{creditos}</Text>
          </View>
        </View>

        <View style={styles.buscador}>
          <Ionicons name="search" size={18} color={colors.textoSuave} />
          <TextInput
            style={styles.input}
            placeholder="Buscar clase o profesor"
            placeholderTextColor={colors.textoSuave}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textoSuave}
              onPress={() => setBusqueda('')}
            />
          )}
        </View>
      </View>

      <FlatList
        ListHeaderComponent={(
          <FlatList
            horizontal
            data={NIVELES}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal, paddingVertical: spacing.md }}
            renderItem={({ item }) => (
              <NivelChip
                etiqueta={item}
                activo={nivel === item}
                onPress={() => setNivel(item)}
              />
            )}
          />
        )}
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            clase={item}
            onPress={() => navigation.navigate('DetalleClase', { clase: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal, flexGrow: 1 }}
        numColumns={columnas}
        columnWrapperStyle={columnas > 1 ? { gap: spacing.md } : undefined}
        ListEmptyComponent={(
          <EstadoVacio
            icono="search-outline"
            titulo="No encontramos resultados"
            mensaje="Prueba con otro nivel, clase o profesor."
            onAction={() => {
              setNivel('Todos');
              setBusqueda('');
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  encabezadoTexto: { flex: 1, paddingRight: spacing.sm },
  creditos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.acentoSuave,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  creditosTexto: { color: colors.acento, fontWeight: '800' },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});