/*
https://docs.nestjs.com/controllers#controllers
*/
// import { NoAuth } from '@decorators/no.auth.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags,ApiOperation } from '@nestjs/swagger';

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}

  // @NoAuth()
  @ApiTags('邮件')
    
  @ApiOperation({summary: '发邮件'})
  @Post('/sendCode')
  async sendEmailCode(@Body() data) {
    return this.emailService.sendEmailCode(data);
  }
}
