import { useState } from 'react';
import { FormResult } from './FormResult';

export function useDriverViewModel() {
  const [incident, setIncident] = useState('');
  const [incidents, setIncidents] = useState<string[]>([]);
  const [assisted, setAssisted] = useState(false);

  const submitIncident = (): FormResult => {
    const text = incident.trim();
    if (!text) {
      return { ok: false, title: 'Falta información', message: 'Escribe una descripción del incidente.' };
    }
    setIncidents(prev => [text, ...prev]);
    setIncident('');
    return { ok: true, title: 'Reporte guardado', message: 'Se guardó localmente en esta sesión de demostración.' };
  };

  return { incident, setIncident, incidents, assisted, setAssisted, submitIncident };
}
