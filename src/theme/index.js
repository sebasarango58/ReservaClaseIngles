import { Platform } from 'react-native';
 
export const colors = {
  fondo: '#111827',
  superficie: '#1A2334',
  primario: '#7AA2F7',
  primarioOscuro: '#5C7CFA',
  primarioSuave: '#1E2A3B',
  acento: '#E0AF68',
  acentoSuave: '#3B2F1F',
  exito: '#9ECE6A',
  peligro: '#F7768E',
  texto: '#C0CAF5',
  textoSuave: '#9AA5CE',
  borde: '#2A3551',
};
 
// Escala de espaciado basada en múltiplos de 4
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
 
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
};
 
export const typography = {
  titulo: { fontSize: 26, fontWeight: '800', color: colors.texto },
  subtitulo: { fontSize: 18, fontWeight: '700', color: colors.texto },
  cuerpo: { fontSize: 15, color: colors.texto },
  secundario: { fontSize: 13, color: colors.textoSuave },
  etiqueta: { fontSize: 12, fontWeight: '600' },
};
 
 
export const sombra = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
});
 
export const coloresPorNivel = {
  Basico: colors.exito,
  Intermedio: colors.primario,
  Avanzado: colors.acento,
  Conversacional: '#7C3AED',
};
 
export default { colors, spacing, radius, typography, sombra, coloresPorNivel };