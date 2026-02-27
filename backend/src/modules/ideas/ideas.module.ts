import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Idea])],
  providers: [IdeasService],
  controllers: [IdeasController],
  exports: [IdeasService],
})
export class IdeasModule {}
