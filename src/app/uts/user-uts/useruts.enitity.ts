import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
// import { BookUts } from '../book-uts/book-uts.entity';

@Entity()
export class UserUts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  // @OneToMany(() => BookUts, (book) => book.created_by)
  // book_uts_created_by: BookUts[];

  // @OneToMany(() => BookUts, (book) => book.updated_by)
  // book_uts_updated_by: BookUts[];

  // @OneToMany(() => BookUts, (book) => book.deleted_by)
  // book_uts_deleted_by: BookUts[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
