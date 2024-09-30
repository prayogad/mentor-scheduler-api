import { RegisterUserRequest, UserResponse } from "src/model/user.model";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { UserValidation } from "./user.validation";
import { HttpException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

export class UserService {
    constructor (
        private validationService: ValidationService,
        private prismaService: PrismaService
    ) {}

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const userInDatabase = await this.prismaService.user.count({
            where: {
                email: registerRequest.email
            }
        });

        if(userInDatabase) {
            throw new HttpException('email already registered', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

        const user = await this.prismaService.user.create({
            data: registerRequest
        })

        return user
    }
}