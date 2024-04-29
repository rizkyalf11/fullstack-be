import { UserUts } from 'src/app/auth/auth.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class BookUts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserUts)
  @JoinColumn({ name: 'created_by_id' }) //buat relasi many to one  dengan table user`
  created_by_id: UserUts;

  @ManyToOne(() => UserUts)
  @JoinColumn({ name: 'updated_by_id' }) //buat relasi many to one  dengan table user
  updated_by: UserUts;

  @ManyToOne(() => UserUts)
  @JoinColumn({ name: 'deleted_by_id' }) //buat relasi many to one  dengan table user
  deleted_by: UserUts;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column()
  judul: string;

  @Column()
  cover: string;

  @Column()
  tahun_terbit: number;

  @Column()
  harga: number;

  @Column()
  penulis: string;

  @Column({ type: 'text' })
  deskripsi: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
