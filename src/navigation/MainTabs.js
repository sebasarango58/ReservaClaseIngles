import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import InicioScreen from '../screens/InicioScreen';
import ReservasScreen from '../screens/ReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import DetalleClaseScreen from '../screens/DetalleClaseScreen';
import { colors } from '../theme';

// Stack interno de Inicio para poder abrir el detalle de una clase sin perder las tabs.
const InicioStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function InicioStackScreen() {
  return (
    <InicioStack.Navigator>
      <InicioStack.Screen name="Inicio" component={InicioScreen} options={{ headerShown: false }} />
      <InicioStack.Screen name="DetalleClase" component={DetalleClaseScreen} options={{ title: 'Detalle de clase', headerTintColor: colors.texto, headerStyle: { backgroundColor: colors.superficie }, headerTitleStyle: { color: colors.texto } }} />
    </InicioStack.Navigator>
  );
}

// Navegación tipo tab solicitada para Inicio, Reservas y Perfil.
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.superficie, borderTopColor: colors.borde },
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.textoSuave,
        tabBarIcon: ({ color, size }) => {
          const nombres = {
            InicioTab: 'home-outline',
            ReservasTab: 'calendar-outline',
            PerfilTab: 'person-outline',
          };
          return <Ionicons name={nombres[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="InicioTab" component={InicioStackScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="ReservasTab" component={ReservasScreen} options={{ title: 'Reservas' }} />
      <Tab.Screen name="PerfilTab" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
