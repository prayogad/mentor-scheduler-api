import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService
    ) { }

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        // const token: string = req.signedCookies['auth'] as string;
        const token: string = req.headers['authorization'] as string;
        // const token: string = authHeader && authHeader.split(' ')[1];


        // const decode: string = jwt.verify(token, this.configService.get<string>('ACCESS_TOKEN_KEY')) as string

        jwt.verify(token, this.configService.get<string>('ACCESS_TOKEN_KEY'), async (err, user) => {
            console.log(user)
            if (!err) {
                const refreshToken: string = req.signedCookies['refreshToken'] as string;
                // if (err) throw new HttpException(error, 401)

                user = await this.prismaService.user.findUnique({
                    where: {
                        id: user.userId,
                        token: refreshToken
                    }
                });

                if (user) {
                    req.user = user;
                }

                // req.user = user;
            }
            next();
        });


        // if (token) {
        //     const user = await this.prismaService.user.findUnique({
        //         where: {
        //             token: refreshToken
        //         }
        //     });

        //     if (user) {
        //         req.user = user;
        //     }
        // }
        // next();
    }
}