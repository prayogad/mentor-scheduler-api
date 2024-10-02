import { LoginUserRequest, RegisterUserRequest, UserResponse } from "src/model/user.model";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { UserValidation } from "./user.validation";
import { HttpException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService
    ) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const userInDatabase = await this.prismaService.user.count({
            where: {
                email: registerRequest.email
            }
        });

        if (userInDatabase) {
            throw new HttpException('email already registered', 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

        const user = await this.prismaService.user.create({
            data: registerRequest
        })

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
        }
    };

    async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest: LoginUserRequest = this.validationService.validate(UserValidation.LOGIN, request);

        let user = await this.prismaService.user.findUnique({
            where: {
                email: loginRequest.email
            }
        });

        if (!user) {
            throw new HttpException('email or password wrong', 401)
        };

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('email or password wrong', 401)
        };

        user = await this.prismaService.user.update({
            data: {
                token: uuid()
            },
            where: {
                email: loginRequest.email
            }
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            token: user.token
        }
    };

    async get(user: User): Promise<UserResponse> {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role
        }
    }
}