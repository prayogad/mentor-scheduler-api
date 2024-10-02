import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../model/user.model";
import { WebResponse } from "../model/web.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    @HttpCode(200)
    async register(
        @Body() request: RegisterUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request);

        return {
            success: true,
            message: "successfully create user",
            data: result
        }
    }

    @Post('/login')
    @HttpCode(200)
    async login(
        @Body() request: LoginUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);

        return {
            success: true,
            message: "successfully login user",
            data: result
        }
    }

    @Get('/api/current')
    @HttpCode(200)
    async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.get(user);
        
        return {
            success: true,
            message: "successfully get user",
            data: result
        }
    }
}