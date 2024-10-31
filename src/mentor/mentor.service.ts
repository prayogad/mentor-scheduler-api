import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { MentorResponse, ProfileRequest } from 'src/model/mentor.model';
import { MentorValidation } from './mentor.validation';
import { HttpException, Injectable } from '@nestjs/common';
import {Multer} from 'multer';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MentorService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) { }

  supabase = createClient(this.configService.get<string>('SUPABASE_URL'), this.configService.get<string>('SUPABASE_ANON_KEY'))

  async checkMentorMustExist(userId: number) {
    const mentor = await this.prismaService.user.findFirst({
      where: {
        AND: [
          {
            id: userId,
          },
          {
            role: 'mentor',
          },
        ],
      },
    });

    if (!mentor) {
      throw new HttpException('mentor not found', 404);
    }
  }

  async profile(user: User, request: ProfileRequest, file: Express.Multer.File): Promise<MentorResponse> {
    this.checkMentorMustExist(user.id);
    const profileRequest: ProfileRequest = this.validationService.validate(
      MentorValidation.PROFILE,
      request,
    );

    const data = await this.supabase.storage
      .from('mentor_pictures')
      .upload(`uploads/${Date.now()}-${file.originalname}`, file.buffer, {
        cacheControl: '3600',
        upsert: false
      });

    const publicUrl = this.supabase.storage.from('mentor_pictures').getPublicUrl(data.data.path)

    const profile = await this.prismaService.mentorProfile.update({
      where: {
        mentor_id: user.id,
      },
      data: {
        field: profileRequest.field,
        bio: profileRequest.bio,
        picture_url: publicUrl.data.publicUrl
      },
      include: {
        mentor: true,
      },
    });

    return {
      id: profile.mentor_id,
      email: profile.mentor.email,
      name: profile.mentor.name,
      phone: profile.mentor.phone,
      field: profile.field,
      bio: profile.bio,
    };
  }

  async getById(id: number): Promise<MentorResponse> {
    const mentor = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        mentor_profile: true,
        mentor_sessions: true
      },
    });

    if (!mentor) {
      throw new HttpException('mentor not found', 404);
    }

    const schedule = mentor.mentor_sessions.map((schedule) => ({
      id: schedule.id,
      quota: schedule.quota,
      scheduleAt: schedule.scheduledAt
    }))

    return {
      id: mentor.id,
      email: mentor.email,
      name: mentor.name,
      phone: mentor.phone,
      field: mentor.mentor_profile.field,
      bio: mentor.mentor_profile.bio,
      schedule: schedule
    };
  }

  async getAllMentor(): Promise<MentorResponse[]> {
    const mentors = await this.prismaService.user.findMany({
      where: {
        role: 'mentor',
      },
      include: {
        mentor_profile: true,
      },
    });

    return mentors.map((mentor) => ({
      id: mentor.id,
      email: mentor.email,
      name: mentor.name,
      phone: mentor.phone,
      field: mentor.mentor_profile.field || '',
      bio: mentor.mentor_profile.bio || '',
    }));
  }
}
