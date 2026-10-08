import { useContext } from 'react';
import { ReservaContext } from '../context/ReservasContext';

// Hook personalizado para acceder al contexto de reservas.
export default function useReserva() {
  const contexto = useContext(ReservaContext);

  // Si no existe el Provider, mostramos un mensaje claro para detectar el error.
  if (!contexto) {
    throw new Error('useReserva debe usarse dentro de <ReservaProvider>.');
  }

  return contexto;
}
