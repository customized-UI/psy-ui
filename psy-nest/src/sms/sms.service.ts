/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import * as Core from '@alicloud/pop-core';


@Injectable()
export class SmsService {
    private readonly client: Core;
    constructor(
        private readonly configService: ConfigService,
    ) {
        const config = this.configService.get('aliyunSms')
        this.client = new Core({
          accessKeyId: config.accessKeyId,
          accessKeySecret: config.accessKeySecret,
          endpoint: config.endpoint,
          apiVersion: '2017-05-25',
        });
      }
    
      async sendVerificationCode(phone: string, code: string) {
        const params = {
          PhoneNumbers: phone,
          SignName: this.configService.get<string>('aliyunSms.signName'),
          TemplateCode: this.configService.get<string>('aliyunSms.templateCode'),
          TemplateParam: JSON.stringify({ code }),
        };
    
        try {
          await this.client.request('SendSms', params, { method: 'POST' });
        } catch (err) {
          throw new UnauthorizedException({
            code: '40007',
            message: '请求验证码频繁'
          });
        }
      }
}
