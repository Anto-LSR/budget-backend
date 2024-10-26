// src/expenses/expenses.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { Expense, ExpenseType } from "./expense.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateExpenseDto } from './dto/create-expense.dto'; // Importez votre DTO

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
    ) { }

    async addExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        console.log(createExpenseDto);

        const expense = this.expenseRepository.create(createExpenseDto); // Créer une instance de Expense à partir du DTO
        return await this.expenseRepository.save(expense); // Enregistrer la dépense dans la base de données
    }

    async getSubscriptions(userId: string): Promise<Expense[]> {
        return await this.expenseRepository.find({ where: { userId: Number(userId), isSubscription: true } }); // Récupérer les abonnements de l'utilisateur
    }

    async deleteExpense(expenseId: number, userId: string): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({ where: { id: expenseId, userId: Number(userId) } }); // Récupérer la dépense à supprimer
        if (!expense) {
            throw new Error('Expense not found'); // Gérer le cas où la dépense n'existe pas
        }
        return await this.expenseRepository.remove(expense); // Supprimer la dépense de la base de données
    }

    async pauseSubscription(expenseId: number, userId: string): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({ where: { id: expenseId, userId: Number(userId), isSubscription: true } }); // Récupérer l'abonnement à mettre en pause
        if (!expense) {
            throw new Error('Subscription not found'); // Gérer le cas où l'abonnement n'existe pas
        }
        expense.isPaused = !expense.isPaused; // Mettre en pause ou reprendre l'abonnement
        return await this.expenseRepository.save(expense); // Enregistrer les modifications dans la base de données
    }

    async getFixedCosts(userId: string): Promise<Expense[]> {
        return await this.expenseRepository.find({ where: { userId: Number(userId), type: ExpenseType.FIXED } }); // Récupérer les dépenses fixes de l'utilisateur
    }
}
