import { WxpayController } from './wxpay.controller';
import { WxpayService } from './wxpay.service';
import { WeChatPayModule } from 'nest-wechatpay-node-v3';
import { Order } from 'src/user/entities/order.entity';
import * as fs from 'fs'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order]),
    WeChatPayModule.registerAsync({
        useFactory: async () => {
          return {
            appid: '',
            mchid: '',
            publicKey: fs.readFileSync('config/apiclient_cert.pem'), // 公钥
            privateKey: fs.readFileSync('config/apiclient_key.pem'), // 秘钥
          };
        },
      }),
    ],
    controllers: [
        WxpayController,],
    providers: [
        WxpayService,],
})
export class WxpayModule { }
