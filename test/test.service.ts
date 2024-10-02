import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}

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
    }
}