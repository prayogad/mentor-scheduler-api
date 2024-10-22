import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';

@Module({
  providers: [MentorService],
  controllers: [MentorController],
  exports: [MentorService],
})
export class MentorModule {}
