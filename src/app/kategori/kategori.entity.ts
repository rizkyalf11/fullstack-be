import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User, UserGoogle } from '../auth/auth.entity';

@Entity()
export class Kategori extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama_kategori: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' }) //buat relasi many to one  dengan table user
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' }) //buat relasi many to one  dengan table user
  updated_by: User;

  @ManyToOne(() => UserGoogle) // Tambahkan relasi ManyToOne dengan UserGoogle
  @JoinColumn({ name: 'created_by_google' }) // Nama kolom untuk kunci luar ke UserGoogle
  created_by_google: UserGoogle;

  @ManyToOne(() => UserGoogle) // Tambahkan relasi ManyToOne dengan UserGoogle
  @JoinColumn({ name: 'updated_by_google' }) // Nama kolom untuk kunci luar ke UserGoogle
  updated_by_google: UserGoogle;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
