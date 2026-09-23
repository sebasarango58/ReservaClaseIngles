import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAlmacenamiento(clave,valorInicial){
    const [valor, setValor] = useState(valorInicial);
    const [listo, setlisto] = useState(false);

    useEffect(()=> {
        let activo = true; //esto es una bandera para saber si estoy guardando el componente o subiendo el componente

        AsyncStorage.getItem(clave)
        .then(()=>{
            if(activo && guardando !== null) setValor(JSON.parse(guardando));

        })
        .catch((error) => console.log ('Error leyendo'+ clave,error))
        .finally(()=> activo && setlisto(true));

        return () => {
            activo = false;
        }
    },[clave]);   

    const actualizar = useCallback( 
        async(nuevoValor) => {
            setValor( nuevoValor);
            try {
                await AsyncStorage.setItem (clave, JSON.stringify(nuevoValor));
                
            } catch (error) {
                console.log('error guardado' + clave, error )
                
            }
        }, [clave]
     );
};