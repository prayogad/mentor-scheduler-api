import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }

    async deleteAll() {
        await this.deleteBookedSession()
        await this.deleteSession()
        await this.deleteUser()
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                email: "test@example.com",
                password: await bcrypt.hash("pass1234", 10),
                name: "test",
                phone: "12345678",
                role: "student",
                token: "test"
            }
        })
    };

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                email: "test@example.com"
            }
        })
    };

    async deleteUpdatedUser() {
        await this.prismaService.user.deleteMany({
            where: {
                email: "newTest@example.com"
            }
        })
    };

    async createMentor() {
        await this.prismaService.user.create({
            data: {
                email: "test@example.com",
                password: await bcrypt.hash("pass1234", 10),
                name: "test",
                phone: "12345678",
                role: "mentor",
                token: "test",
                mentor_profile: {
                    create: {
                        field: "Web Development"
                    }
                }
            }
        })
    };

    async getMentor() {
        return this.prismaService.user.findUnique({
            where: {
                email: "test@example.com"
            },
            include: {
                mentor_profile: true
            }
        });
    }

    async createSesion() {
        const mentor = await this.getMentor()
        return this.prismaService.mentorSession.create({
            data: {
                scheduledAt: "2030-10-03T14:30:00Z",
                quota: 5,
                mentor_id: mentor.id
            }
        });
    }

    async getSesion() {
        const mentor = await this.getMentor()

        if (!mentor) {
            return
        }

        return this.prismaService.mentorSession.findFirst({
            where: {
                mentor_id: mentor.id
            }
        });
    }

    async deleteSession() {
        const mentor = await this.getMentor()

        if (!mentor) {
            return
        }

        await this.prismaService.mentorSession.deleteMany({
            where: {
                mentor_id: mentor.id
            }
        })
    }
    
    async deleteBookedSession() {
        const mentor = await this.getMentor()
        const session = await this.getSesion()

        if (!session) {
            return
        }

        if (!mentor) {
            return
        }

        await this.prismaService.bookedSession.deleteMany({
            where: {
                session_id: session.id
            }
        })
    }

    async createBookedSession() {
        const session = await this.getSesion()

        return this.prismaService.bookedSession.create({
            data: {
                session_id: session.id,
                student_id: 414
            }
        });
    }
}