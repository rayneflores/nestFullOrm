import { Cat } from 'src/cats/entities/cat.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Breed {
  @Column({
    primary: true,
    generated: true,
  })
  id: number;

  @Column({ length: 500 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Cat, (cat) => cat.breed)
  cats: Cat[];
}
