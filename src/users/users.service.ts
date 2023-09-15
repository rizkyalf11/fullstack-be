/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseSuccess } from 'src/interface/response';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { createUsersDto, updateUsersDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>
  ) {}
  private users: {
    id?: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  }[] = [
    {
      id: 1,
      nama: 'Rizky Alfiansyah',
      email: 'rizky@gmail.com',
      umur: 16,
      tanggal_lahir: '17-06-2007',
      status: 'Pelajar',
    },
  ];

  async getAllUsers(): Promise<ResponseSuccess> {
    const result = await this.userService.find();
    return {
      message: 'Berhasil',
      status: '200',
      data: result
    }
  };

  async createUsers(payload: createUsersDto): Promise<ResponseSuccess> {
    const { nama, email, umur, tanggal_lahir, status} = payload;

    try {
      const newUser = await this.userService.save({
        nama,
        email,
        umur,
        tanggal_lahir,
        status
      })
  
      return {
        status: 'Success',
        message: 'Data Berhasil Di Tambah',
        data: newUser
      }
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: number, payload: updateUsersDto): Promise<ResponseSuccess> {
    const check = await this.userService.findOne({
      where: {
        id: id
      }
    })
    
    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

      const update = await this.userService.save({ ...payload, id: id });
      return {
        status: `Success `,
        message: 'Buku berhasil di update',
        data: update,
      };
  }

  async deleteUser(id: number): Promise<ResponseSuccess> {
    const user = await this.userService.findOne({where: {id: id}});

    if (user === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    await this.userService.delete(id)

    return {
      message: 'Data Dihapus',
      status: '200',
      data: user
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const user = await this.userService.findOne({where: {id: id}});

    if (user === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    return {
      message: 'Data ditemukan',
      status: '200',
      data: user
    }
  }
}
