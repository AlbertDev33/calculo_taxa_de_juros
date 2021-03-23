import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rates')
export class Rate {
  @ObjectIdColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  seis: number;

  @Column()
  doze: number;

  @Column()
  dezoito: number;

  @Column()
  vinteEquatro: number;

  @Column()
  trintaEseis: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
