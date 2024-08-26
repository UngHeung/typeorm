// 1. 상속 시 상속받은 클래스들이 각각 개별의 테이블을 생성
// 2. 하나의 테이블로 모든 entity들을 관리

import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm';

export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
}

@Entity()
export class BookModel extends BaseModel {
  @Column()
  name: string;
}

@Entity()
export class CarModel extends BaseModel {
  @Column()
  brand: string;
}

@Entity()
@TableInheritance({
  column: {
    name: 'type', // type column이 추가됨
    type: 'varchar', // type column은 varchar 타입
  },
})
export class SingleBaseModel {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
}

@ChildEntity()
export class ComputerModel extends SingleBaseModel {
  @Column()
  brand: string;
}

@ChildEntity()
export class AirplaneModel extends SingleBaseModel {
  @Column()
  country: string;
}
