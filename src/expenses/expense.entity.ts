import { Category } from '../categories/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ExpenseType {
  FIXED = 'fixed',
  ONCE = 'once',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ nullable: true })
  date: Date; // Date à laquelle la dépense est prévue (si nécessaire)

  @Column({ default: false })
  isRecurring: boolean; // Indique si c'est une dépense fixe

  @Column({ default: false })
  isSubscription: boolean; // Indique si c'est une dépense fixe

  @Column({ default: false })
  isPaused: boolean; // Indique si l'abonnement est en pause

  @CreateDateColumn() // Utilisé pour la date de création
  dateCreate: Date; // Date à laquelle la dépense a été créée

  @ManyToOne(() => Category, category => category.expenses)
  @JoinColumn({ name: 'categoryId' })
  categoryEntity: Category;

  @Column({ nullable: true })
  categoryId: number;
}