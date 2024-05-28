import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Kategori } from '../kategori/kategori.entity';
import { OrderDetail } from '../order_detail/order_detail.entity';

@Entity()
export class Produk extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  barcode: string;

  @ManyToOne(() => Kategori, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'kategori_id' })
  kategori: Kategori;

  @Column({ nullable: false })
  nama_produk: string;

  @Column({ type: 'text', nullable: false })
  deskripsi_produk: string;

  @Column({ type: 'double', precision: 18, scale: 2, nullable: false })
  harga: number;

  @Column()
  stok: number;

  @Column({ nullable: true })
  foto: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @OneToMany(() => OrderDetail, (v) => v.produk, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  order_detail: OrderDetail[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
