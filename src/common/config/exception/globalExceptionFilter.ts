import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { customException } from './customException';

@Catch(HttpException)
export class HttpGlobalExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const response = gqlHost.getContext().res;

    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const responseMessage = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: gqlHost?.getInfo()?.fieldName,
      message: exception.message || 'Unexpected error occurred',
      errors: exception.getResponse(),
    };
    const formattedResponse = customException(responseMessage);
    response.status(status).json(formattedResponse);
  }
}
