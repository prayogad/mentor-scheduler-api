import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "../model/user.model";
import { WebResponse } from "../model/web.model";

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
}