import { Inject, Injectable, HttpCode, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import jwtConfig from 'config/jwt.config';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import * as bcrypt from 'bcryptjs';
import { InvitationCode } from './entities/invitation-code.entity';
import { SmsService } from 'src/sms/sms.service';
import { VerificationCode } from './entities/verification-code.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @InjectRepository(InvitationCode)
    private invitationCodeRepository: Repository<InvitationCode>,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
  ) { }

  async checkToken(token) {
    try {
      await this.jwtService.verifyAsync(token, this.jwtConfiguration)
      return true
    }
    catch (error) {
      return false
    }
  }

  async sendVerificationCode(phone: string) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await this.smsService.sendVerificationCode(phone, code);
    // 存储验证码到数据库
    const verificationCode = this.verificationCodeRepository.create({
      phone,
      code,
      verified: false,
    });
    await this.verificationCodeRepository.save(verificationCode);
    return true;
  }
  
  async validatePhone(phone: string) {
    // 在此处实现验证手机号的逻辑，例如检查手机号是否存在于数据库中
    // 如果手机号有效，返回true；否则返回false
    // 验证手机号格式
    if (!/^1[3456789]\d{9}$/.test(phone)) {
      return false
    } else {
      return true
    }
  }

  async login(phone: string, code: string, inviteCode) {
    let oldUser: any = ''
    let user: any = ''
    const existingUser = await this.userRepository.findOne({
      where: [{ username:phone }],
    });

    if (!existingUser && inviteCode) {//如果是刚注册的用户并且有邀请码则给老用户的使用次数加3,同时刚注册的用户也会生成邀请码
      oldUser = await this.userRepository.findOne({
        where: [{ inviteCode:inviteCode }]
      })
      oldUser.usageCount += 3
      await this.userRepository.save(oldUser)
    } else if(existingUser && !existingUser.inviteCode) {//如果是老用户但是没有验证码的则登录的时候生成邀请码
      existingUser.inviteCode = await this.generateInviteCode();
      await this.userRepository.save(existingUser)
    }
    
    const isValid = await this.validatePhone(phone);
    if (!isValid) {
      throw new Error('Invalid phone number');
    }

    // 在此处实现验证验证码的逻辑，例如检查验证码是否正确
    // 如果验证码正确，返回用户信息；否则返回null
    const isCode = await this.verifyCode(phone, code);
    if (!isCode) {
      throw new UnauthorizedException({
        code: '40006',
        message: '验证码错误'
      });
    }

    

    const userObj = {
      username: phone,
      password: '',
      inviteCode: '',
    }

    // 在此处实现保存手机号的逻辑，如果该手机号存在就不创建新用户直接登录,否则就创建后登录
    if (!existingUser) {
      userObj.inviteCode = await this.generateInviteCode();
      user = await this.userRepository.create(userObj);
      await this.userRepository.save(user);
    }

    const userData = await this.userRepository.findOne({
      where: [{ username: phone }]
    })
    const payload = { phone };
    const token = await this.generateTokens(userData);
    if (userData['password']) {
      delete userData['password']
    }
    return { userData, token };
  }

  private async verifyCode(phone: string, code: string) {
    // 在此处实现验证验证码的逻辑，例如检查验证码是否正确
    // 如果验证码正确，返回用户信息；否则返回null
    // 根据手机号和验证码从数据库中查询记录
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { phone, code },
    });
     // 验证码校验逻辑
     if (verificationCode && !verificationCode.verified) {
      // 验证码有效且未被使用过
      verificationCode.verified = true;
      await this.verificationCodeRepository.save(verificationCode);
      return true;
    } else {
      // 验证码无效或已被使用过
      return false;
    }
  }
  
  async generateInviteCode(): Promise<string> {
    let inviteCode: string;
    let isCodeUnique = false;
    while (!isCodeUnique) {
      inviteCode = Math.floor(10000000 + Math.random() * 90000000).toString();
      const existingCode = await this.invitationCodeRepository.findOneBy({
        inviteCode,
      });

      isCodeUnique = !existingCode;
    }

    const invitationCode = this.invitationCodeRepository.create({
      inviteCode,
    });
    await this.invitationCodeRepository.save(invitationCode);

    return inviteCode;
  }

  async getUserByInviteCode(inviteCode: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ inviteCode }]
    })
  }
//用户账号密码注册
  async signUp(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    let oldUser: any = ''

    const existingUser = await this.userRepository.findOne({
      where: [{ username }],
    });
    if (existingUser) throw new UnauthorizedException({
      code: '40002',
      message: '用户已存在'
    });

    if (signUpDto.inviteCode) {
      oldUser = await this.userRepository.findOne({
        where: [{ inviteCode:signUpDto.inviteCode }]
      })
      oldUser.usageCount += 3
      await this.userRepository.save(oldUser)
    }

    const user = this.userRepository.create(signUpDto);

    this.userRepository.save(user);
    return {}
  }
  //用户登录
  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;
    
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException({
      code: '40001',
      message: '未找到用户名'
    });

    const isEqual = await bcrypt.compareSync(password, user.password);
    if (!isEqual) throw new UnauthorizedException({
      code: '40000',
      message: '密码错误'
    });

    if (!user.inviteCode) {
      user.inviteCode = await this.generateInviteCode();
      await this.userRepository.save(user)
    }

    return await this.generateTokens(user);
  }
  async generateTokens(user) {
    const token = await this.signToken<Partial<ActiveUserData>>(user.id, {
        username: user.username,
    });
    // const token = await this.signToken<Partial<ActiveUserData>>(phone);
    return token;
  }
  private async signToken<T>(userId: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        uid: userId,
        ...payload
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
  }
}
