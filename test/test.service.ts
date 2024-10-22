import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async deleteAll() {
    await this.deleteBookedSession();
    await this.deleteSession();
    await this.deleteStudent();
    await this.deleteUser();
  }

  async createUser() {
    let user = await this.prismaService.user.create({
      data: {
        email: 'student@example.com',
        password: await bcrypt.hash('pass1234', 10),
        name: 'student',
        phone: '12345678',
        role: 'student',
        token: 'test',
      },
    });

    const accessToken = jwt.sign(
      { userId: user.id },
      this.configService.get<string>('ACCESS_TOKEN_KEY'),
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      this.configService.get<string>('REFRESH_TOKEN_KEY'),
      { expiresIn: '7d' },
    );

    user = await this.prismaService.user.update({
      data: {
        token: refreshToken,
      },
      where: {
        id: user.id,
      },
    });

    const record = {
      ...user,
      ...{ access_token: accessToken },
    };

    return record;
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async deleteStudent() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'student@example.com',
      },
    });
  }

  async deleteUpdatedUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'newTest@example.com',
      },
    });
  }

  async createMentor() {
    let mentor = await this.prismaService.user.create({
      data: {
        email: 'test@example.com',
        password: await bcrypt.hash('pass1234', 10),
        name: 'test',
        phone: '12345678',
        role: 'mentor',
        token: 'test',
        mentor_profile: {
          create: {
            field: 'Web Development',
          },
        },
      },
    });

    const accessToken = jwt.sign(
      { userId: mentor.id },
      this.configService.get<string>('ACCESS_TOKEN_KEY'),
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
      { userId: mentor.id },
      this.configService.get<string>('REFRESH_TOKEN_KEY'),
      { expiresIn: '7d' },
    );

    mentor = await this.prismaService.user.update({
      data: {
        token: refreshToken,
      },
      where: {
        id: mentor.id,
      },
    });

    const record = {
      ...mentor,
      ...{ access_token: accessToken },
    };

    return record;
  }

  async getMentor() {
    return this.prismaService.user.findUnique({
      where: {
        email: 'test@example.com',
      },
      include: {
        mentor_profile: true,
      },
    });
  }

  async getStudent() {
    return this.prismaService.user.findUnique({
      where: {
        email: 'student@example.com',
      },
    });
  }

  async createSesion() {
    const mentor = await this.getMentor();
    return this.prismaService.mentorSession.create({
      data: {
        scheduledAt: '2030-10-03T14:30:00Z',
        quota: 5,
        mentor_id: mentor.id,
      },
    });
  }

  async getSesion() {
    const mentor = await this.getMentor();

    if (!mentor) {
      return;
    }

    return this.prismaService.mentorSession.findFirst({
      where: {
        mentor_id: mentor.id,
      },
    });
  }

  async deleteSession() {
    const mentor = await this.getMentor();

    if (!mentor) {
      return;
    }

    await this.prismaService.mentorSession.deleteMany({
      where: {
        mentor_id: mentor.id,
      },
    });
  }

  async deleteBookedSession() {
    const mentor = await this.getMentor();
    const session = await this.getSesion();

    if (!session) {
      return;
    }

    if (!mentor) {
      return;
    }

    await this.prismaService.bookedSession.deleteMany({
      where: {
        session_id: session.id,
      },
    });
  }

  async createBookedSession(studentId: number) {
    const session = await this.getSesion();

    return this.prismaService.bookedSession.create({
      data: {
        session_id: session.id,
        student_id: studentId,
      },
    });
  }
}
