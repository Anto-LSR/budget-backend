import { Expense } from '../expenses/expense.entity';
import { Category } from '../categories/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Category, category => category.user)
  categories: Category[];

  @OneToMany(() => Expense, expense => expense.userEntity)
  expenses: Expense[];
}