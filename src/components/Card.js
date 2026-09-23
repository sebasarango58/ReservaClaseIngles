import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, sombra } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function Card({ clase, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.tarjeta}>
            <Image source={{ uri: clase.imagen }} style={styles.imagen} />
            <View style={styles.cuerpo}>
                <View style={styles.etiquetaContenedor}>
                    <EtiquetaNivel nivel={clase.nivel} />
                </View>

                <Text style={styles.titulo}>{clase.titulo}</Text>

                <View style={styles.filaProfesor}>
                    <Image source={{ uri: clase.profesor?.foto }} style={styles.avatar} />
                    <Text style={styles.profesor}>{clase.profesor?.nombre}</Text>
                </View>

                <View style={styles.pie}>
                    <View style={styles.filaCentro}>
                        <Text style={styles.meta}>{clase.duracion}'</Text>
                        <Text style={styles.punto}>·</Text>
                        <Text style={styles.meta}>{clase.modalidad}</Text>
                        <Text style={styles.punto}>·</Text>
                        <Text style={styles.meta}>{clase.cupos} cupos</Text>
                    </View>
                    <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    tarjeta: {
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        ...sombra,
    },
    imagen: {
        width: '100%',
        height: 160,
        backgroundColor: colors.primarioSuave,
    },
    cuerpo: {
        padding: spacing.lg,
        gap: spacing.sm,
    },
    etiquetaContenedor: {
        alignSelf: 'flex-start',
    },
    titulo: { fontSize: 16, fontWeight: '700', color: colors.texto },
    filaProfesor: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.borde },
    profesor: { fontSize: 13, color: colors.textoSuave, flexShrink: 1 },
    pie: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    filaCentro: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    meta: { fontSize: 12, color: colors.textoSuave },
    punto: { color: colors.borde, marginHorizontal: 2 },
    precio: { fontSize: 14, fontWeight: '800', color: colors.primario },
});