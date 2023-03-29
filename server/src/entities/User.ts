import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[]; 
  
  @Field(() => String)
  @Column({ unique: true })
  username!: string;
  
  @Column({ unique: true })
  password!: string;
  
  @Field(() => String)
  @Column({ unique: true })
  email!: String;

  @Field(() => String)
  @CreateDateColumn()
  createdAt? = new Date;
  
  @Field(() => String)
  @UpdateDateColumn()
  updatedAt? = new Date;
}
