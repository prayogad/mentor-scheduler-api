import { Body, Controller, Get, HttpCode, Post, Put, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { WebResponse } from "../model/web.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { Response } from "express";
import { v4 as uuid } from 'uuid';

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
        @Res() res: Response
    ) {
        const result = await this.userService.login(request);
        res.cookie('auth', result.token, { path: '/', signed: true, expires: new Date(Date.now() + 90000) });

        res.status(200).json({
            success: true,
            message: `successfully login user`,
            data: result
        });
    }

    @Get('/api/current')
    @HttpCode(200)
    async get(
        @Auth() user: User
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.get(user);
        
        return {
            success: true,
            message: "successfully get user",
            data: result
        }
    }

    @Put('/api/update')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Body() request: UpdateUserRequest
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.update(user, request);

        return {
            success: true,
            message: "successfully update user",
            data: result
        }
    }

    @Post('/api/logout')
    @HttpCode(200)
    async logout(
        @Auth() user: User
    ): Promise<WebResponse<boolean>> {
        await this.userService.logout(user);

        return {
            success: true,
            message: "successfully logout user"
        }
    }
}