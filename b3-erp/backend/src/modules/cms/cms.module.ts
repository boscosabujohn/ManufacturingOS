import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentCategory } from './entities/content-category.entity';
import { ContentService } from './services/content.service';
import { ContentController } from './controllers/content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentCategory])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class CmsModule {}
