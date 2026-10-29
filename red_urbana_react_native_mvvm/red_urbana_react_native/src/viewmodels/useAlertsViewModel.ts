import { useMemo } from 'react';
import { AlertsService } from '../services';

export function useAlertsViewModel() {
  const alerts = useMemo(() => AlertsService.getAlerts(), []);
  return { alerts };
}
