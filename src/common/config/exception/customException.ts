import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function customException(error: any): any {
  console.log('error:', error);
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Request failed. Something went wrong.';

  if (error instanceof HttpException) {
    status = error?.getStatus();
    message = error?.message;
  } else if (error?.statusCode) {
    if (error?.statusCode === 400) {
      throw new BadRequestException(error?.errors || message);
    } else if (error?.statusCode === 404) {
      throw new NotFoundException(error?.errors || message);
    } else if (error?.statusCode === 403) {
      throw new ForbiddenException(error?.errors || message);
    } else if (error?.statusCode === 401) {
      throw new UnauthorizedException(error?.errors || message);
    }
    status = error?.statusCode;
    message = error?.message || 'An error occurred.';
  } else {
    console.error('Unhandled error:', error);
  }

  return {
    statusCode: status,
    error: message,
  };
}

export function responseBody(data: any, err: any, message?: string) {
  return {
    data,
    error: customException(err),
    message,
  };
}
