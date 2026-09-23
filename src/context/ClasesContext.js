import React, { createContext, useContext, useState } from 'react';
import { CLASES as CLASES_INICIALES } from '../data/clases';

const ClasesContext = createContext(null);

export function ClasesProvider({ children }) {
  const [clases, setClases] = useState(CLASES_INICIALES);
  const [reservadas, setReservadas] = useState(new Set());

  function reservarClase(id) {
    const idx = clases.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    if (clases[idx].cupos <= 0) return false;
    setClases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, cupos: c.cupos - 1 } : c))
    );
    setReservadas((prev) => new Set(prev).add(id));
    return true;
  }

  function cancelarClase(id) {
    const idx = clases.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    setClases((prev) => prev.map((c) => (c.id === id ? { ...c, cupos: c.cupos + 1 } : c)));
    setReservadas((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    return true;
  }

  return (
    <ClasesContext.Provider value={{ clases, reservarClase, cancelarClase, reservadas }}>
      {children}
    </ClasesContext.Provider>
  );
}

export function useClases() {
  const ctx = useContext(ClasesContext);
  if (!ctx) throw new Error('useClases must be used within ClasesProvider');
  return ctx;
}

export default ClasesContext;