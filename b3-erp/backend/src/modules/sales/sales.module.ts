import { Module } from '@nestjs/common';
import { RFPController } from './rfp.controller';
import { RFPService } from './rfp.service';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [RFPController],
  providers: [RFPService],
  exports: [RFPService],
})
export class SalesModule {}
