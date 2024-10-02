import { User } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { MentorResponse, ProfileRequest } from "src/model/mentor.model";
import { MentorValidation } from "./mentor.validation";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class MentorService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService
    ) { }

    async profile(user: User, request: ProfileRequest): Promise<MentorResponse> {
        const profileRequest: ProfileRequest = this.validationService.validate(MentorValidation.PROFILE, request);

        const profile = await this.prismaService.mentorProfile.update({
            where: {
                mentor_id: user.id
            },
            data: {
                field: profileRequest.field,
                bio: profileRequest.bio
            },
            include: {
                mentor: true
            }
        })

        return {
            id: profile.mentor_id,
            email: profile.mentor.email,
            name: profile.mentor.name,
            phone: profile.mentor.phone,
            field: profile.field,
            bio: profile.bio
        }
    };

    async getById(id: number): Promise<MentorResponse> {
        const mentor = await this.prismaService.user.findUnique({
            where: {
                id: id
            },
            include: {
                mentor_profile: true
            }
        });

        if (!mentor) {
            throw new HttpException('mentor not found', 404)
        }

        return {
            id: mentor.id,
            email: mentor.email,
            name: mentor.name,
            phone: mentor.phone,
            field: mentor.mentor_profile.field,
            bio: mentor.mentor_profile.bio
        }
    }
}