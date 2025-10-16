import { Module } from '@nestjs/common';
import { RFPController } from './rfp.controller';
import { RFPService } from './rfp.service';

@Module({
  controllers: [RFPController],
  providers: [RFPService],
  exports: [RFPService],
})
export class SalesModule {}
