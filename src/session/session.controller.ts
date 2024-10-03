import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { SessionService } from "./session.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { AddSessionRequest, SessionResponse } from "../model/session.model";
import { WebResponse } from "../model/web.model";

@Controller('/session')
export class SessionController {
    constructor(private sessionService: SessionService) {}

    @Post('/api/addSession')
    @HttpCode(200)
    async session(
        @Auth() user: User,
        @Body() request: AddSessionRequest
    ): Promise<WebResponse<SessionResponse>> {
        const result = await this.sessionService.add(user, request);

        return {
            success: true,
            message: "successfully add mentor session",
            data: result
        }
    }
}