import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radius, spacing, typography } from '../theme';
import { NIVELES } from '../data/clases';
import NivelChip from '../components/NivelChip';

const CLAVE_PERFIL = '@perfil_estudiante';

// Pantalla de registro y consulta del perfil del estudiante.
export default function PerfilScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    nivel: '',
    cedula: '',
  });

  // Cargamos el perfil guardado, si existe.
  useEffect(() => {
    async function cargarPerfil() {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_PERFIL);
        if (guardado) {
          setPerfil(JSON.parse(guardado));
          setEditando(false);
        } else {
          setEditando(true);
        }
      } catch (error) {
        console.log('Error leyendo perfil:', error);
        setEditando(true);
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, []);

  // Guarda el formulario como perfil del estudiante.
  async function guardarPerfil() {
    if (!perfil.nombre.trim() || !perfil.apellido.trim() || !perfil.nivel || !perfil.cedula.trim()) {
      Alert.alert('Datos incompletos', 'Completa nombre, apellido, nivel y cédula.');
      return;
    }

    try {
      await AsyncStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
      setEditando(false);
      Alert.alert('Perfil guardado', 'Los datos del estudiante fueron guardados correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No fue posible guardar el perfil.');
    }
  }

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <Text style={typography.cuerpo}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.encabezado}>
        <View>
          <Text style={typography.titulo}>Mi perfil</Text>
          <Text style={typography.secundario}>Datos del estudiante.</Text>
        </View>
        <View style={styles.avatarGrande}>
          <Ionicons name="person" size={30} color={colors.primario} />
        </View>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.tituloSeccion}>Información personal</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={perfil.nombre}
          editable={editando}
          placeholder="Ej. Kevin"
          placeholderTextColor={colors.textoSuave}
          onChangeText={(texto) => setPerfil((actual) => ({ ...actual, nombre: texto }))}
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={perfil.apellido}
          editable={editando}
          placeholder="Ej. Pérez"
          placeholderTextColor={colors.textoSuave}
          onChangeText={(texto) => setPerfil((actual) => ({ ...actual, apellido: texto }))}
        />

        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          value={perfil.cedula}
          editable={editando}
          placeholder="Número de documento"
          placeholderTextColor={colors.textoSuave}
          keyboardType="numeric"
          onChangeText={(texto) => setPerfil((actual) => ({ ...actual, cedula: texto }))}
        />

        <Text style={styles.label}>Nivel de inglés</Text>
        <View style={styles.niveles}>
          {NIVELES.filter((nivel) => nivel !== 'Todos').map((nivel) => (
            <NivelChip
              key={nivel}
              etiqueta={nivel}
              activo={perfil.nivel === nivel}
              onPress={() => editando && setPerfil((actual) => ({ ...actual, nivel }))}
            />
          ))}
        </View>

        {editando ? (
          <Pressable style={styles.boton} onPress={guardarPerfil}>
            <Ionicons name="save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.botonTexto}>Guardar perfil</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.botonSecundario} onPress={() => setEditando(true)}>
            <Ionicons name="create-outline" size={18} color={colors.primario} />
            <Text style={styles.botonSecundarioTexto}>Editar perfil</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.tituloSeccion}>Accesos rápidos</Text>

      <Pressable style={styles.acceso} onPress={() => navigation.navigate('ReservasTab')}>
        <View style={styles.accesoIcono}>
          <Ionicons name="calendar-outline" size={22} color={colors.primario} />
        </View>
        <View style={styles.accesoInfo}>
          <Text style={styles.accesoTitulo}>Mis reservas</Text>
          <Text style={styles.accesoTexto}>Consulta y administra tus clases.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textoSuave} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.lg },
  cargando: { flex: 1, backgroundColor: colors.fondo, alignItems: 'center', justifyContent: 'center' },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  avatarGrande: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarioSuave, alignItems: 'center', justifyContent: 'center' },
  tarjeta: { backgroundColor: colors.superficie, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  tituloSeccion: { ...typography.subtitulo, marginBottom: spacing.md },
  label: { color: colors.textoSuave, fontSize: 13, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { height: 46, borderWidth: 1, borderColor: colors.borde, borderRadius: radius.md, color: colors.texto, paddingHorizontal: spacing.md, backgroundColor: colors.fondo },
  niveles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  boton: { height: 46, borderRadius: radius.md, backgroundColor: colors.primario, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
  botonTexto: { color: '#FFFFFF', fontWeight: '800' },
  botonSecundario: { height: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primario, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
  botonSecundarioTexto: { color: colors.primario, fontWeight: '800' },
  acceso: { backgroundColor: colors.superficie, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  accesoIcono: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarioSuave, alignItems: 'center', justifyContent: 'center' },
  accesoInfo: { flex: 1 },
  accesoTitulo: { color: colors.texto, fontWeight: '800', fontSize: 15 },
  accesoTexto: { color: colors.textoSuave, fontSize: 12, marginTop: 3 },
});
