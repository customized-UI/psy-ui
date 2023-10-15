// src/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { User } from '../user/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import jwtConfig from '../../config/jwt.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { APP_GUARD } from '@nestjs/core'
import { AccessTokenGuard } from './guards/access-token.guard'
import { InvitationCode } from './entities/invitation-code.entity';
import { VerificationCode } from './entities/verification-code.entity'
import { SmsModule } from 'src/sms/sms.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User,InvitationCode,VerificationCode]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    SmsModule
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
      {
        provide: APP_GUARD,
        useClass: AccessTokenGuard,
      }
  ],
})
export class AuthModule {}
