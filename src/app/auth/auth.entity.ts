import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ResetPassword } from './reset_password.entity';
import { Kategori } from '../kategori/kategori.entity';
import { BookUts } from '../book-uts/book-uts.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  nama: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => ResetPassword, (reset) => reset.user) // buat relasi one to many dengan tabel reset password
  reset_password: ResetPassword;

  @OneToMany(() => Kategori, (kategori) => kategori.created_by)
  kategori_created_by: Kategori[];

  @OneToMany(() => Kategori, (kategori) => kategori.updated_by)
  kategori_updated_by: Kategori[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

@Entity()
export class UserGoogle extends BaseEntity {
  @Column({ primary: true, unique: true, nullable: false })
  id: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  nama: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Kategori, (kategori) => kategori.created_by)
  kategori_created_by: Kategori[];

  @OneToMany(() => Kategori, (kategori) => kategori.updated_by)
  kategori_updated_by: Kategori[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

@Entity()
export class UserUts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => BookUts, (book) => book.created_by_id)
  book_uts_created_by: BookUts[];

  @OneToMany(() => BookUts, (book) => book.updated_by)
  book_uts_updated_by: BookUts[];

  @OneToMany(() => BookUts, (book) => book.deleted_by)
  book_uts_deleted_by: BookUts[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
