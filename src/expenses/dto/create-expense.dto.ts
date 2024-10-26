import { IsNotEmpty, IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { ExpenseType } from '../expense.entity';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  title: string; // Titre ou description de la dépense

  @IsNotEmpty()
  @IsNumber()
  amount: number; // Montant de la dépense

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  categoryId?: number; // Catégorie personnalisée

  @IsEnum(ExpenseType)
  type: ExpenseType; // Type de dépense (fixe ou ponctuelle)

  @IsOptional()
  @IsString()
  date?: Date; // Date de la dépense (optionnelle)
}
