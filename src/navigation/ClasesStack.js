import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/InicioScreen';
import DetalleClaseScreen from '../screens/DetalleClaseScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

// Stack legado mantenido para conservar la estructura original del proyecto.
export default function ClasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={InicioScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetalleClase"
        component={DetalleClaseScreen}
        options={{
          title: 'Detalle de clase',
          headerStyle: { backgroundColor: colors.superficie },
          headerTintColor: colors.texto,
          headerTitleStyle: { color: colors.texto },
        }}
      />
    </Stack.Navigator>
  );
}
