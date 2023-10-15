import { SmsService } from './sms.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AliyunSmsConfig  from 'config/aliyun.sms.config';

@Module({
    imports: [
        ConfigModule.forFeature(AliyunSmsConfig),
    ],
    controllers: [],
    providers: [
        SmsService,
        {
            provide: AliyunSmsConfig.KEY,
            useFactory: (configService: ConfigService) => configService.get(AliyunSmsConfig.KEY),
            inject: [ConfigService],
        },
    ],
    exports: [SmsService],
})
export class SmsModule { }
