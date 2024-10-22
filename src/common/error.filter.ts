import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import * as jwt from 'jsonwebtoken';
const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = jwt;

@Catch(
  ZodError,
  HttpException,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        success: false,
        message: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        success: false,
        message: exception.errors,
      });
    } else if (
      exception instanceof TokenExpiredError ||
      JsonWebTokenError ||
      NotBeforeError
    ) {
      response.status(401).json({
        success: false,
        message: exception.message,
      });
    } else {
      response.status(500).json({
        success: false,
        message: exception.message,
      });
    }
  }
}
