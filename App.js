import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainTabs from './src/navigation/MainTabs';
import { ReservaProvider } from './src/context/ReservasContext';
import { colors } from './src/theme';

// Tema visual utilizado por React Navigation.
const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

// Componente raíz de la aplicación.
export default function App() {
  return (
    <SafeAreaProvider>
      {/* ReservaProvider envuelve toda la navegación para que useReserva() funcione en cualquier pantalla. */}
      <ReservaProvider>
        <NavigationContainer theme={temaNavegacion}>
          <StatusBar style="light" />
          <MainTabs />
        </NavigationContainer>
      </ReservaProvider>
    </SafeAreaProvider>
  );
}
