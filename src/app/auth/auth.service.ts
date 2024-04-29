import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserGoogle, UserUts } from './auth.entity';
import { Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import {
  LoginDto,
  LoginUtsDto,
  LoginWIthGoogleDTO,
  RegisterDto,
  RegisterUtsDto,
  ResetPasswordDto,
} from './auth.dto';
import { ResponseSuccess } from 'src/interface/response';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { MailService } from '../mail/mail.service';
import { ResetPassword } from './reset_password.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(UserUts)
    private readonly authRepository: Repository<UserUts>,
    @InjectRepository(UserGoogle)
    private readonly userGoogleRepo: Repository<UserGoogle>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    super();
  }

  async register(payload: RegisterUtsDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        username: payload.username,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.authRepository.save(payload);

    return this._success('Register Berhasil');
  }

  async login(payload: LoginUtsDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        username: payload.username,
      },
      select: {
        id: true,
        nama: true,
        username: true,
        password: true,
        refresh_token: true,
      },
    });
    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    );
    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        username: checkUserExists.username,
      };
      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );
      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );
      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      });
      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'username dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // async loginWithGoogle(payload: LoginWIthGoogleDTO) {
  //   console.log(payload);

  //   try {
  //     const resDecode: any = this.jwtService.decode(payload.id_token);

  //     if (resDecode.email == payload.email) {
  //       const checkUserExists = await this.userGoogleRepo.findOne({
  //         where: {
  //           email: payload.email,
  //         },
  //         select: {
  //           id: true,
  //           nama: true,
  //           email: true,
  //           refresh_token: true,
  //         },
  //       });

  //       if (checkUserExists == null) {
  //         const jwtPayload: jwtPayload = {
  //           id: payload.id,
  //           nama: payload.nama,
  //           email: payload.email,
  //         };

  //         const refresh_token = await this.generateJWT(
  //           jwtPayload,
  //           '7d',
  //           jwt_config.refresh_token_secret,
  //         );

  //         await this.userGoogleRepo.save({
  //           ...payload,
  //           refresh_token,
  //           id: payload.id,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log('err', error);
  //     throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async getDataloginGoogle(id: string) {
  //   const checkUserExists = await this.userGoogleRepo.findOne({
  //     where: {
  //       id: id,
  //     },
  //     select: {
  //       id: true,
  //       nama: true,
  //       email: true,
  //       refresh_token: true,
  //     },
  //   });

  //   const jwtPayload: jwtPayload = {
  //     id: checkUserExists.id,
  //     nama: checkUserExists.nama,
  //     email: checkUserExists.email,
  //   };

  //   const access_token = await this.generateJWT(
  //     jwtPayload,
  //     '1d',
  //     jwt_config.access_token_secret,
  //   );

  //   return this._success('Login Success', {
  //     ...checkUserExists,
  //     access_token: access_token,
  //     role: 'siswa',
  //   });
  // }

  async tesDoang(token: string) {
    const isinya = this.jwtService.decode(token);

    return isinya;
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', user);
  }

  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        username: true,
        password: true,
        refresh_token: true,
      },
    });

    if (checkUserExists === null) {
      console.log('yes');
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      username: checkUserExists.username,
    };

    const access_token = this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    const refresh_token = this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  // async forgotPassword(email: string): Promise<ResponseSuccess> {
  //   const user = await this.authRepository.findOne({
  //     where: {
  //       email: email,
  //     },
  //   });

  //   if (!user) {
  //     throw new HttpException(
  //       'Email tidak ditemukan',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }
  //   const token = randomBytes(32).toString('hex'); // membuat token
  //   const linkBe = `http://localhost:5002/auth/lupa-password/${user.id}/${token}`; //membuat link untuk reset password
  //   const linkFe = `http://localhost:3000/reset-pw/${user.id}/${token}`; //membuat link untuk reset password

  //   await this.mailService.sendForgotPassword({
  //     email: email,
  //     name: user.nama,
  //     linkBe,
  //     linkFe,
  //   });

  //   const payload = {
  //     user: {
  //       id: user.id,
  //     },
  //     token: token,
  //   };

  //   await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

  //   return this._success('Silahkan Cek Email');
  // }

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({
      // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
