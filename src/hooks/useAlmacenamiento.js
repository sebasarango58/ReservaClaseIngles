import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook reutilizable para guardar un valor en AsyncStorage.
export default function useAlmacenamiento(clave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let activo = true;

    AsyncStorage.getItem(clave)
      .then((guardado) => {
        if (activo && guardado !== null) {
          setValor(JSON.parse(guardado));
        }
      })
      .catch((error) => console.log('Error leyendo ' + clave, error))
      .finally(() => activo && setListo(true));

    return () => {
      activo = false;
    };
  }, [clave]);

  const actualizar = useCallback(async (nuevoValor) => {
    setValor(nuevoValor);

    try {
      await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
    } catch (error) {
      console.log('Error guardando ' + clave, error);
    }
  }, [clave]);

  return { valor, actualizar, listo };
}
