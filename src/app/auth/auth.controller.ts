import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginWIthGoogleDTO,
  RegisterDto,
  ResetPasswordDto,
  UpdateAvatarDto,
} from './auth.dto';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
// import { MailService } from '../mail/mail.service';
// import { ChildEntity } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('logingoogle')
  async loginwithgoogle(@Body() payload: LoginWIthGoogleDTO) {
    return this.authService.loginWithGoogle(payload);
  }

  @Get('getgoogledata/:id')
  async getData(@Param('id') id: string) {
    return this.authService.getDataloginGoogle(id);
  }

  @Post('tesdoang')
  async hehe(@Body('token') token: string) {
    return this.authService.tesDoang(token);
  }

  @UseGuards(JwtGuard) // impelementasi guard pada route , hal ini berarti endpoint profile hanya bisa diakses jika client membawa token
  @Get('profile')
  async profile(@Req() req) {
    // hasil validate dari jwt strategy akan ditambakan pada req.user. isi object req.user akan sama dengan payload dari jwt token. Silahkan coba console.log(req.user)
    const { id } = req.user;
    console.log(req.user);
    return this.authService.myProfile(id);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('lupa-password/:user_id/:token') // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }

  @UseGuards(JwtGuard) // impelementasi guard pada route , hal ini berarti endpoint profile hanya bisa diakses jika client membawa token
  @Put('profile/update')
  async updateProfile(@Body() payload: UpdateAvatarDto, @Req() req) {
    const { id } = req.user;
    return this.authService.updateProfile(+id, payload);
  }
}
