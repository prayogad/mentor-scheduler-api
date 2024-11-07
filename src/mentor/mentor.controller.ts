import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { MentorResponse, ProfileRequest } from '../model/mentor.model';
import { WebResponse } from '../model/web.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/mentor')
export class MentorController {
  constructor(private mentorService: MentorService) { }

  @Put('/api/profile')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async profile(
    @Auth() user: User,
    @Body() request: ProfileRequest,
    @UploadedFile() file,
  ): Promise<WebResponse<MentorResponse>> {
    const result = await this.mentorService.profile(user, { ...request, file });
    return {
      success: true,
      message: 'successfully update mentor profile',
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  async getById(
    @Param('id', ParseIntPipe) mentorId: number,
  ): Promise<WebResponse<MentorResponse>> {
    const result = await this.mentorService.getById(mentorId);

    return {
      success: true,
      message: 'successfully get mentor by id',
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getAll(): Promise<WebResponse<MentorResponse[]>> {
    const result = await this.mentorService.getAllMentor();

    return {
      success: true,
      message: 'successfully get all mentors',
      data: result,
    };
  }
}
