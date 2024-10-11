import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";
import { MentorModule } from "../mentor/mentor.module";


@Module({
    imports: [MentorModule],
    providers: [SessionService],
    controllers: [SessionController]
})
export class SessionModule {}