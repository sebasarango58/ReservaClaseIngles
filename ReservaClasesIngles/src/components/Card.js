import react from 'react';
import { View, Text, Image, Pressable, StyleSheet} from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';
import {colors, radius, spacing, typography} from '../theme';
import {formatearPrecio} from '../data/clases';



export default function Card ({urlImagen, OnPress, ancho}){
    return(
        <Pressable
            OnPress={OnPress}
            
        >
            <Image source={{uri: clase.image}}/>
            <view>
                <EtiquetaNivel nivel={clase.nivel}/>
            </view>
        
        
        </Pressable>

    ) 
   
}

