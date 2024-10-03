import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { MentorModule } from './mentor/mentor.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [CommonModule, UserModule, MentorModule, SessionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
