import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { MentorSession, User } from '@prisma/client';
import {
  AddSessionRequest,
  BookSessionRequest,
  BookSessionResponse,
  SessionResponse,
  UpdateSessionRequest,
} from 'src/model/session.model';
import { SessionValidation } from './session.validation';
import { MentorService } from '../mentor/mentor.service';

@Injectable()
export class SessionService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private mentorService: MentorService,
  ) {}

  toSessionResponse(session: MentorSession): SessionResponse {
    return {
      id: session.id,
      scheduledAt: session.scheduledAt,
      quota: session.quota,
    };
  }

  async checkStudentMustExist(userId: number) {
    const mentor = await this.prismaService.user.findFirst({
      where: {
        AND: [
          {
            id: userId,
          },
          {
            role: 'student',
          },
        ],
      },
    });

    if (!mentor) {
      throw new HttpException('student not found', 404);
    }
  }

  async checkSessionMustExist(
    sessionId: number,
    mentorId: number,
  ): Promise<MentorSession> {
    const session = await this.prismaService.mentorSession.findUnique({
      where: {
        id: sessionId,
        mentor_id: mentorId,
      },
    });

    if (!session) {
      throw new HttpException('session is not found', 404);
    }

    return session;
  }

  async add(user: User, request: AddSessionRequest): Promise<SessionResponse> {
    const sessionRequest: AddSessionRequest = this.validationService.validate(
      SessionValidation.CREATE,
      request,
    );
    await this.mentorService.checkMentorMustExist(user.id);

    const record = {
      ...sessionRequest,
      ...{ mentor_id: user.id },
    };

    const session = await this.prismaService.mentorSession.create({
      data: record,
    });

    return this.toSessionResponse(session);
  }

  async update(
    user: User,
    request: UpdateSessionRequest,
  ): Promise<SessionResponse> {
    const updateRequest: UpdateSessionRequest = this.validationService.validate(
      SessionValidation.UPDATE,
      request,
    );
    this.mentorService.checkMentorMustExist(user.id);
    const currentSession = await this.checkSessionMustExist(
      updateRequest.id,
      user.id,
    );

    if (updateRequest.scheduledAt) {
      currentSession.scheduledAt = updateRequest.scheduledAt;
    }

    if (updateRequest.quota) {
      currentSession.quota = updateRequest.quota;
    }

    const session = await this.prismaService.mentorSession.update({
      where: {
        id: currentSession.id,
      },
      data: currentSession,
    });

    return this.toSessionResponse(session);
  }

  async remove(user: User, sessionId: number): Promise<SessionResponse> {
    this.mentorService.checkMentorMustExist(user.id);
    const currentSession = await this.checkSessionMustExist(sessionId, user.id);

    const session = await this.prismaService.mentorSession.delete({
      where: {
        id: currentSession.id,
      },
    });

    return this.toSessionResponse(session);
  }

  async get(mentorId: number): Promise<SessionResponse[]> {
    this.mentorService.checkMentorMustExist(mentorId);

    const sessions = await this.prismaService.mentorSession.findMany({
      where: {
        mentor_id: mentorId,
      },
    });

    return sessions.map((session) => this.toSessionResponse(session));
  }

  async book(
    user: User,
    request: BookSessionRequest,
  ): Promise<BookSessionResponse> {
    const bookRequest: BookSessionRequest = this.validationService.validate(
      SessionValidation.BOOK,
      request,
    );
    await this.checkStudentMustExist(user.id);
    await this.checkSessionMustExist(
      bookRequest.session_id,
      bookRequest.mentor_id,
    );

    const bookedSession = await this.prismaService.bookedSession.create({
      data: {
        session_id: bookRequest.session_id,
        student_id: user.id,
      },
      include: {
        student: true,
        session: {
          include: {
            mentor: {
              include: {
                mentor_profile: true,
              },
            },
          },
        },
      },
    });

    return {
      scheduledAt: bookedSession.session.scheduledAt,
      mentor_name: bookedSession.session.mentor.name,
      student_name: bookedSession.student.name,
      field: bookedSession.session.mentor.mentor_profile.field,
      bookedAt: bookedSession.booked_at,
    };
  }
}
