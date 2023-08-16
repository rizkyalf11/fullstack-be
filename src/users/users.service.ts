/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
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

  getAllUsers(): {
    id? : number,
    nama : string,
    email : string,
    umur : number,
    tanggal_lahir : string,
    status : string
  }[] {
    return this.users;
  };

  createUsers(payload: any): {
    status: string,
    message: string
  } {
    const { nama, email, umur, tanggal_lahir, status} = payload;

    this.users.push({
      id: this.getLastIndex(),
      nama,
      email,
      umur,
      tanggal_lahir,
      status,
    })

    return {
      status: 'Success',
      message: 'Data Berhasil Di Tambah',
    }
  }

  getLastIndex() {
    return this.users.length + 1
  }

  findUserById(id: number): number {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }

    return userIndex;
  }

  updateUser(id: number, payload: any): {status: string, message: string} {
    const { nama, email, umur, tanggal_lahir, status} = payload;
    const userIndex = this.findUserById(id)

    this.users[userIndex].nama = nama;
    this.users[userIndex].email = email;
    this.users[userIndex].umur = umur;
    this.users[userIndex].tanggal_lahir = tanggal_lahir;
    this.users[userIndex].status = status;

    return {
      status: 'Success',
      message: `Buku dengan id ${id} berhasil di update`,
    }
  }

  deleteUser(id: number): {status: string, message: string} {
    const userIndex = this.findUserById(id);

    this.users.splice(userIndex, 1);

    return {
      status: 'success',
      message: `Data dengan id ${id} berhasil di delete`
    }
  }

  getDetail(id: number): {
    id? : number,
    nama : string,
    email : string,
    umur : number,
    tanggal_lahir : string,
    status : string
  } {
    const userIndex = this.findUserById(id);

    return this.users[userIndex];
  }
}
