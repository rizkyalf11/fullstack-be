import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { LoginDto, RegisterDto } from './auth.dto';
import { ResponseSuccess } from 'src/interface/response';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super();
  }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); //hash password
    await this.authRepository.save(payload);

    return this._success('Register Berhasil');
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
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

    const checkPassword = compare(payload.password, checkUserExists.password); // compare password yang dikirim dengan password yang ada di tabel

    if (checkPassword) {
      const jwtPayload: jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
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

      return this._success('Login Success', {
        ...checkUserExists,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
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
}
