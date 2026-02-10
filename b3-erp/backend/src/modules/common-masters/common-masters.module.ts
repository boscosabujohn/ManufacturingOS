import { Module } from '@nestjs/common';
import { CommonMastersService } from './common-masters.service';
import { CommonMastersController } from './common-masters.controller';

@Module({
  providers: [CommonMastersService],
  controllers: [CommonMastersController]
})
export class CommonMastersModule {}
