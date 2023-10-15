import {ArgumentsHost,Catch, ExceptionFilter, HttpException,HttpStatus, InjectionToken} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const request = ctx.getRequest();
    const cbResponse = exception.getResponse() //获取自定义response
    const url = request.originalUrl;//获取错误URL地址
    const dtoMessage = exception.getResponse() //dto中设置的错误信息返回
    // http状态码响应，没有就是500
    const status =dtoMessage['code'] ? 200 :
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 设置错误信息
    const message = dtoMessage['message'] ?dtoMessage['message'] :  exception.message
    const code = dtoMessage['code'] ? dtoMessage['code'] : exception.getStatus()
    console.log(exception)
    const errorResponse = {
      data: {},
      message: message,
      code,
      url
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
