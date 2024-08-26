import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // @PrimaryGeneratedColumn()
  // 자동으로 ID를 생성

  // @PrimaryColumn()
  // 기본적으로 모든 테이블에서 존재한다.
  // 테이블 안에서 각각의 Row를 구분할 수 있는 Column이다.
  // 자동생성하지 않고 직접 넣는다.

  // @PrimaryGeneratedColumn('uuid')
  // PrimaryGeneratedColumn -> 순서대로 올라간다. 0 > 1 > 2 > 3 ...
  // UUID -> 겹치지 않는 고유 ID가 생성된다.
  @PrimaryGeneratedColumn()
  id: number;

  // 제목
  @Column({
    type: 'varchar', // DB에서 인지하는 컬럼타입
    name: 'user_title', // DB 컬럼명, 미입력시 변수명으로 자동 입력
    length: 300, // 입력 글자 최대 길이
    nullable: true, // null 가능 여부
    update: true, // false 시 처음 저장시에만 값 지정이 가능하며 이후 값 변경 불가
    select: true, // 값 요청시 기본으로 가져올지 여부, false시 값을 요청해도 해당 값은 가져오지 않음 (sql select)
    default: 'default value', // 값 미입력시 기본으로 입력되는 값
    unique: false, // 컬럼 중 유일한 값이어야 하는지 여부
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // 데이터가 생성되는 날짜, 시간이 자동으로 입력
  @CreateDateColumn()
  createAt: Date;
  // 업데이트되는 날짜, 시간이 자동으로 입력
  @UpdateDateColumn()
  updateAt: Date;
  // 업데이트 될 때마다 1씩 올라간다.
  @VersionColumn()
  version: number;

  // 데이터를 생성할 때마다 1씩 올라가는 값
  @Column()
  @Generated() // 'uuid' -> 생성할 때마다 uuid 입력
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author, { eager: true })
  posts: PostModel[];
}
