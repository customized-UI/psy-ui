import { SmsModule } from './sms/sms.module';
import { WxpayModule } from './wxpay/wxpay.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SmsModule,
    UserModule,
    AuthModule,
    EmailModule,
    WxpayModule,
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path], //配置文件路径，也可以配置为数组如['/config/.env1','.env']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres', // 数据库类型
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 数据表实体
        autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 5432), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '123456789'), // 密码
        database: configService.get('DB_DATABASE', 'search_chat'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        dateStrings: true,
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
