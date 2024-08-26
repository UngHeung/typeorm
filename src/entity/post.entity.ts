import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { TagModel } from './tag.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // 상대에 관련된 컬럼을 가지는 쪽은 Many쪽이다. DB Table 특성상 여러개의 값을 가질 수 없기 때문
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @ManyToMany(() => TagModel, (tag) => tag.posts)
  @JoinTable()
  tags: TagModel[];
}
