import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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
  @Column()
  title: string;

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
}
