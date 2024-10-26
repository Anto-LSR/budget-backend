import { Expense } from "src/expenses/expense.entity";

export class CreateCategoryDto {
    id: number;
    name: string;
    description?: string;
    expenses?: Expense[];
    userId: number;
    
  }