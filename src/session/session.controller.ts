import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import {
  AddSessionRequest,
  BookSessionRequest,
  BookSessionResponse,
  SessionResponse,
  UpdateSessionRequest,
} from '../model/session.model';
import { WebResponse } from '../model/web.model';

@Controller('/session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('/api/addSession')
  @HttpCode(200)
  async add(
    @Auth() user: User,
    @Body() request: AddSessionRequest,
  ): Promise<WebResponse<SessionResponse>> {
    const result = await this.sessionService.add(user, request);

    return {
      success: true,
      message: 'successfully add mentor session',
      data: result,
    };
  }

  @Put('/api/updateSession/:sessionId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() request: UpdateSessionRequest,
  ): Promise<WebResponse<SessionResponse>> {
    request.id = sessionId;
    const result = await this.sessionService.update(user, request);

    return {
      success: true,
      message: 'successfully update mentor session',
      data: result,
    };
  }

  @Delete('/api/deleteSession/:sessionId')
  @HttpCode(200)
  async delete(
    @Auth() user: User,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ): Promise<WebResponse<SessionResponse>> {
    await this.sessionService.remove(user, sessionId);

    return {
      success: true,
      message: 'successfully delete mentor session',
    };
  }

  @Get('/getSession/:mentorId')
  @HttpCode(200)
  async get(
    @Param('mentorId', ParseIntPipe) mentorId: number,
  ): Promise<WebResponse<SessionResponse[]>> {
    const result = await this.sessionService.get(mentorId);

    return {
      success: true,
      message: 'successfully get mentor sessions',
      data: result,
    };
  }

  @Post('/api/student/bookSession/:mentorId')
  @HttpCode(200)
  async book(
    @Auth() user: User,
    @Body() request: BookSessionRequest,
    @Param('mentorId', ParseIntPipe) mentorId: number,
  ): Promise<WebResponse<BookSessionResponse>> {
    request.mentor_id = mentorId;
    const result = await this.sessionService.book(user, request);

    return {
      success: true,
      message: 'successfully book mentoring session',
      data: result,
    };
  }
}
