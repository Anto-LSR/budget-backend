import { Module } from "@nestjs/common";
import { ExpenseController } from "./expenses.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "./expense.entity";
import { ExpenseService } from "./expenses.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports:[TypeOrmModule.forFeature([Expense]), AuthModule],
    providers: [ExpenseService],
    controllers: [ExpenseController],
    exports: [ExpenseService]
})
export class ExpenseModule{}