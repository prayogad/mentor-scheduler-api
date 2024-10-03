import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { MentorSession, User } from "@prisma/client";
import { AddSessionRequest, SessionResponse } from "src/model/session.model";
import { SessionValidation } from "./session.validation";

@Injectable()
export class SessionService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService
    ) { }

    toSessionResponse(session: MentorSession): SessionResponse {
        return {
            id: session.id,
            scheduledAt: session.scheduledAt,
            quota: session.quota
        }
    }

    async checkMentorMustExist(userId: number) {
        const mentor = await this.prismaService.user.findFirst({
            where: {
                AND: [
                    {
                        id: userId
                    },
                    {
                        role: "mentor"
                    }
                ]
            }
        });

        if (!mentor) {
            throw new HttpException("mentor not found", 404)
        }
    }

    async add(user: User, request: AddSessionRequest): Promise<SessionResponse> {
        const sessionRequest: AddSessionRequest = this.validationService.validate(SessionValidation.CREATE, request);
        await this.checkMentorMustExist(user.id);

        const record = {
            ...sessionRequest,
            ...{ mentor_id: user.id }
        }

        const session = await this.prismaService.mentorSession.create({
            data: record
        });

        return this.toSessionResponse(session)
    }
}