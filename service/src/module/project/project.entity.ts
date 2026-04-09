/*
 * @name: Kary
 * @Date: 2025-09-23 16:51:03
 * @Description: 
 */

import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn() // 自增ID
  id: number;

  @Column()
  name: string;

  @Column()
  createTime: number;

  @Column()
  description: string;

  @Column('mediumtext', {
    nullable: false,
  })
  viewerJson: string;

  @Column()
  release: number;
}