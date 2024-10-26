import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ExpenseType {
  FIXED = 'fixed',
  ONCE = 'once',
  SUBSCRIPTION = 'subscription',
  INSTALLMENT = 'installment',
  NEGATIVE = 'negative',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.expenses)
  @JoinColumn({ name: 'userId' })
  userEntity: User;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column('float')
  amount: number;

  @Column({
    type: 'enum',
    enum: ExpenseType,
    default: ExpenseType.ONCE,
  })
  type: ExpenseType; // Type de dépense (fixe ou ponctuelle)

  @Column({ default: false })
  isPaused: boolean; // Indique si l'abonnement est en pause


  @ManyToOne(() => Category, category => category.expenses, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  categoryEntity?: Category;

  @Column({ nullable: true })
  categoryId?: number;

  @CreateDateColumn() // Utilisé pour la date de création
  dateCreate: Date; // Date à laquelle la dépense a été créée
  
  @Column({ nullable: true })
  dateEnd?: Date;


}