import { User } from '../users/user.entity';
import { Expense } from '../expenses/expense.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Expense, expense => expense.categoryId)
    expenses: Expense[];

    @ManyToOne(() => User, user => user.categories)
    user: User;

    @Column()
    userId: number;
}