import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  // 상대에 관련된 컬럼을 가지는 쪽은 Many쪽이다. DB Table 특성상 여러개의 값을 가질 수 없기 때문
  @ManyToOne(() => UserModel, (user) => user.posts, { eager: false })
  author: UserModel;

  @Column()
  title: string;
}
