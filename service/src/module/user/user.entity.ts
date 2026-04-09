/*
 * @name: Kary
 * @Date: 2025-09-21 20:32:47
 * @Description: 
 */

import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn() // 自增ID
  id: number;

  @Column()
  name: string;

  @Column()
  @Unique(['account'])
  account: string;
  
  @Column()
  password: string;
}