import {
  DashboardResponse,
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { UserValidation } from './user.validation';
import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      this.configService.get<string>('ACCESS_TOKEN_KEY'),
      { expiresIn: '15m' },
    );
  }

  generateRefreshToken(user: User): string {
    const refreshToken = jwt.sign(
      { userId: user.id },
      this.configService.get<string>('REFRESH_TOKEN_KEY'),
      { expiresIn: '7d' },
    );
    return refreshToken;
  }

  async ifEmailRegistered(email: string) {
    const user = await this.prismaService.user.count({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new HttpException('email already registered', 400);
    }
  }

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    await this.ifEmailRegistered(registerRequest.email);

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    if (user.role === 'mentor') {
      await this.prismaService.mentorProfile.create({
        data: {
          mentor_id: user.id,
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new HttpException('email or password wrong', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('email or password wrong', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    user = await this.prismaService.user.update({
      data: {
        token: refreshToken,
      },
      where: {
        email: loginRequest.email,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<UserResponse> {
    if (!refreshToken) throw new HttpException('refresh token not valid', 401);

    let user = jwt.verify(
      refreshToken,
      this.configService.get<string>('REFRESH_TOKEN_KEY'),
    );

    user = await this.prismaService.user.findUnique({
      where: {
        id: user.userId,
        token: refreshToken,
      },
    });

    const accessToken = this.generateAccessToken(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      access_token: accessToken,
      refresh_token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.email) {
      this.ifEmailRegistered(updateRequest.email);
      user.email = updateRequest.email;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.phone) {
      user.phone = updateRequest.phone;
    }

    const result = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      phone: result.phone,
      role: result.role,
    };
  }

  async getDashboard(user: User): Promise<DashboardResponse[]> {
    if (user.role === 'mentor') {
      const dashboards = await this.prismaService.bookedSession.findMany({
        where: {
          session: {
            mentor_id: user.id,
          },
        },
        include: {
          session: {
            include: {
              mentor: {
                include: {
                  mentor_profile: true,
                },
              },
            },
          },
          student: true,
        },
      });

      return dashboards.map((dashboard) => ({
        mentor_name: dashboard.session.mentor.name,
        student_name: dashboard.student.name,
        scheduledAt: dashboard.session.scheduledAt,
        field: dashboard.session.mentor.mentor_profile.field,
      }));
    } else {
      const dashboards = await this.prismaService.bookedSession.findMany({
        where: {
          student: {
            id: user.id,
          },
        },
        include: {
          session: {
            include: {
              mentor: {
                include: {
                  mentor_profile: true,
                },
              },
            },
          },
          student: true,
        },
      });

      return dashboards.map((dashboard) => ({
        mentor_name: dashboard.session.mentor.name,
        student_name: dashboard.student.name,
        scheduledAt: dashboard.session.scheduledAt,
        field: dashboard.session.mentor.mentor_profile.field,
      }));
    }
  }

  async logout(user: User) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });
  }
}
