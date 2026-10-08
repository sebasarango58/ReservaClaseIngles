import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave que usamos para guardar las reservas en el almacenamiento local.
const CLAVE_RESERVAS = '@reservas_ingles';

// Cantidad de créditos iniciales del estudiante.
const CREDITOS_INICIALES = 5;

// Creamos el contexto que compartirán todas las pantallas relacionadas con reservas.
export const ReservaContext = createContext(null);

// Obtiene una clave sencilla para comparar día y hora de un horario.
function obtenerBloqueHorario(horario) {
  if (!horario) return '';
  const partes = horario.trim().split(/\s+/);
  return `${partes[0] || ''}|${partes.slice(1).join(' ')}`;
}

// Provider: contiene el estado y las funciones de las reservas.
export function ReservaProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [creditos, setCreditos] = useState(CREDITOS_INICIALES);
  const [cargando, setCargando] = useState(true);

  // Cargamos las reservas guardadas cuando inicia la aplicación.
  useEffect(() => {
    async function cargarDatos() {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);

        if (guardado) {
          const datos = JSON.parse(guardado);
          setReservas(Array.isArray(datos.reservas) ? datos.reservas : []);
          setCreditos(
            typeof datos.creditos === 'number' ? datos.creditos : CREDITOS_INICIALES
          );
        }
      } catch (error) {
        console.log('Error leyendo reservas:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // Guardamos reservas y créditos cada vez que cambian.
  useEffect(() => {
    if (cargando) return;

    AsyncStorage.setItem(
      CLAVE_RESERVAS,
      JSON.stringify({ reservas, creditos })
    ).catch((error) => console.log('Error guardando reservas:', error));
  }, [reservas, creditos, cargando]);

  // Registra una nueva reserva si todas las reglas se cumplen.
  const agregarReserva = useCallback((clase, horario) => {
    if (!clase || !horario) {
      return { ok: false, mensaje: 'Debes seleccionar una clase y un horario.' };
    }

    if (creditos <= 0) {
      return { ok: false, mensaje: 'No tienes créditos disponibles.' };
    }

    // No permitimos reservar dos veces la misma clase en el mismo horario.
    const repetida = reservas.some(
      (reserva) => reserva.claseId === clase.id && reserva.horario === horario
    );

    if (repetida) {
      return { ok: false, mensaje: 'Ya tienes reservada esta clase en ese horario.' };
    }

    // Regla solicitada: máximo dos clases para el mismo día y horario.
    const bloque = obtenerBloqueHorario(horario);
    const cantidadEnMismoBloque = reservas.filter(
      (reserva) => obtenerBloqueHorario(reserva.horario) === bloque
    ).length;

    if (cantidadEnMismoBloque >= 2) {
      return {
        ok: false,
        mensaje: 'No puedes reservar más de dos clases el mismo día y en el mismo horario.',
      };
    }

    // Una reserva consume un crédito.
    const nuevaReserva = {
      id: `${clase.id}_${horario.replace(/\s+/g, '_')}`,
      claseId: clase.id,
      titulo: clase.titulo,
      nivel: clase.nivel,
      profesor: clase.profesor?.nombre || 'Profesor',
      precio: clase.precio,
      horario,
      modalidad: clase.modalidad,
      creadoEn: new Date().toISOString(),
    };

    setReservas((previas) => [nuevaReserva, ...previas]);
    setCreditos((actuales) => actuales - 1);

    return { ok: true, reserva: nuevaReserva };
  }, [creditos, reservas]);

  // Cancela una reserva y devuelve el crédito utilizado.
  const cancelarReserva = useCallback((reservaId) => {
    const existe = reservas.some((reserva) => reserva.id === reservaId);

    if (!existe) {
      return { ok: false, mensaje: 'La reserva no existe.' };
    }

    setReservas((previas) => previas.filter((reserva) => reserva.id !== reservaId));
    setCreditos((actuales) => actuales + 1);

    return { ok: true };
  }, [reservas]);

  // Indica si una clase ya está reservada en un horario específico.
  const estaReservada = useCallback((claseId, horario) => {
    return reservas.some(
      (reserva) => reserva.claseId === claseId && reserva.horario === horario
    );
  }, [reservas]);

  // Cuenta cuántas reservas existen en un día y horario.
  const cantidadEnHorario = useCallback((horario) => {
    const bloque = obtenerBloqueHorario(horario);
    return reservas.filter(
      (reserva) => obtenerBloqueHorario(reserva.horario) === bloque
    ).length;
  }, [reservas]);

  // Objeto que exponemos a las pantallas mediante useReserva().
  const valor = useMemo(() => ({
    reservas,
    creditos,
    cargando,
    agregarReserva,
    cancelarReserva,
    estaReservada,
    cantidadEnHorario,
  }), [
    reservas,
    creditos,
    cargando,
    agregarReserva,
    cancelarReserva,
    estaReservada,
    cantidadEnHorario,
  ]);

  return (
    <ReservaContext.Provider value={valor}>
      {children}
    </ReservaContext.Provider>
  );
}
