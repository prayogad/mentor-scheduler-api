import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token: string = req.headers['authorization'] as string;

    jwt.verify(
      token,
      this.configService.get<string>('ACCESS_TOKEN_KEY'),
      async (err, user) => {
        if (!err) {
          const refreshToken: string = req.signedCookies[
            'refreshToken'
          ] as string;

          if (refreshToken) {
            user = await this.prismaService.user.findUnique({
              where: {
                id: user.userId,
                token: refreshToken,
              },
            });

            if (user) {
              req.user = user;
            }
          }
        }
        next();
      },
    );
  }
}
