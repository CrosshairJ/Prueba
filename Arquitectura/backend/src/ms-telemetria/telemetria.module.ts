import { Module } from '@nestjs/common';
import { TelemetriaService } from './telemetria.service';
import { TransporteGateway } from './transporte.gateway';

@Module({
  providers: [TelemetriaService, TransporteGateway],
  exports: [TelemetriaService],
})
export class TelemetriaModule {}