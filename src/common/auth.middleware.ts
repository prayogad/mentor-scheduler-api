import { Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private prismaService: PrismaService) {}

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const token: string = req.signedCookies['auth'] as string;

        if (token) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    token: token
                }
            });

            if (user) {
                req.user = user;
            }
        }
        next();
    }   
}