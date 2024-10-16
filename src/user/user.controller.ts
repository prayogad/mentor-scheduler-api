import { Body, Controller, Get, HttpCode, Post, Put, Req, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { DashboardResponse, LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { WebResponse } from "../model/web.model";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { Response, Request } from "express";
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken';

@Controller('/user')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) { }

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

        res.cookie('refreshToken', result.refresh_token, {
            path: '/',
            signed: true, 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: `successfully login user`,
            data: result
        });
    }
    
    // ToDo
    @Post('/refresh-token')
    @HttpCode(200)
    async refreshToken(
        @Auth() user: User,
        @Res() res: Response,
        @Req() req: Request
    ) {
        // const result = await this.userService.login(request);
        const refreshToken: string = req.signedCookies['refreshToken'] as string;
        // res.cookie('refreshToken', result.refresh_token, {
        //     path: '/',
        //     signed: true, 
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });

        // res.status(200).json({
        //     success: true,
        //     message: `successfully login user`,
        //     data: result
        // });
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

    @Get('/api/dashboard')
    @HttpCode(200)
    async dashboard(
        @Auth() user: User
    ): Promise<WebResponse<DashboardResponse[]>> {
        const result = await this.userService.getDashboard(user);

        return {
            success: true,
            message: "successfully get user dashboard",
            data: result
        }
    }

    @Post('/api/logout')
    @HttpCode(200)
    async logout(
        @Auth() user: User,
        @Res() res: Response
    ) {
        await this.userService.logout(user);
        res.clearCookie('auth', { path: '/' });

        res.status(200).json({
            success: true,
            message: 'successfully logout user'
        });
    }
}