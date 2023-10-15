import { Body, Controller, HttpCode, HttpStatus, Post, Session } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    if (!signUpDto.inviteCode) {
      signUpDto.inviteCode = await this.authService.generateInviteCode();
    }
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('send-code')
  async sendVerificationCode(@Body('phone') phone: string) {
    return this.authService.sendVerificationCode(phone);
  }

  @Public()
  @Post('login')
  async login(@Body() params: {phone: string, code: string}, inviteCode) {
    return this.authService.login(params.phone, params.code,inviteCode)
  }

  @Post('check-token')
  async checkToken(@Body() params: { token: string }) {
    return this.authService.checkToken(params.token);
  }
}
