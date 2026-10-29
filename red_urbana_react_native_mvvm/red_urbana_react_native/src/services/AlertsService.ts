import { ServiceAlert } from '../models';

const ALERTS: ServiceAlert[] = [
  { title: 'Servicio normal', description: 'Línea 1 opera con normalidad.', time: 'Ahora' },
  { title: 'Aviso de demostración', description: 'Revisa los tiempos estimados antes de viajar.', time: 'Información' },
];

export const AlertsService = {
  getAlerts(): ServiceAlert[] {
    return ALERTS;
  },
};
