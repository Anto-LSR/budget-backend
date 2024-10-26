// src/expenses/expenses.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { Expense, ExpenseType } from "./expense.entity";
import { Between, Not, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateExpenseDto } from './dto/create-expense.dto'; // Importez votre DTO

@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
    ) { }

    async addExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const expense = this.expenseRepository.create(createExpenseDto); // Créer une instance de Expense à partir du DTO
        return await this.expenseRepository.save(expense); // Enregistrer la dépense dans la base de données
    }


    async deleteExpense(expenseId: number, userId: string): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({ where: { id: expenseId, userId: Number(userId) } }); // Récupérer la dépense à supprimer
        if (!expense) {
            throw new Error('Expense not found'); // Gérer le cas où la dépense n'existe pas
        }
        return await this.expenseRepository.remove(expense); // Supprimer la dépense de la base de données
    }

    async pauseSubscription(expenseId: number, userId: string): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({ where: { id: expenseId, userId: Number(userId), type: ExpenseType.SUBSCRIPTION } }); // Récupérer l'abonnement à mettre en pause
        if (!expense) {
            throw new Error('Subscription not found'); // Gérer le cas où l'abonnement n'existe pas
        }
        expense.isPaused = !expense.isPaused; // Mettre en pause ou reprendre l'abonnement
        return await this.expenseRepository.save(expense); // Enregistrer les modifications dans la base de données
    }


    async addFixedCost(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const expense = this.expenseRepository.create({ ...createExpenseDto, type: ExpenseType.FIXED }); // Créer une instance de dépense fixe à partir du DTO
        return await this.expenseRepository.save(expense); // Enregistrer la dépense fixe dans la base de données
    }

    async getFixedCosts(userId: string): Promise<Expense[]> {
        return await this.expenseRepository.find({ where: { userId: Number(userId), type: ExpenseType.FIXED } }); // Récupérer les dépenses fixes de l'utilisateur
    }
    async getExpenses(userId: string, req: any): Promise<Expense[]> {
        const queryparams = req.query;
        const year = queryparams.year;
        const month = queryparams.month;

        const whereConditions: any = {
            userId: Number(userId),
            type: ExpenseType.ONCE,
        };

        if (year) {
            const startDate = new Date(year, month ? parseInt(month) - 1 : 0, 1); // Premier jour du mois
            const endDate = new Date(year, month ? parseInt(month) : 12, 1); // Premier jour du mois suivant

            whereConditions.dateCreate = Between(startDate, endDate); // Utilisation de Between de TypeORM
        }

        return await this.expenseRepository.find({
            where: whereConditions,
        });
    }


    async getSubscriptions(userId: string): Promise<Expense[]> {
        return await this.expenseRepository.find({ where: { userId: Number(userId), type: ExpenseType.SUBSCRIPTION } }); // Récupérer les abonnements de l'utilisateur
    }
    async getInstallmentPayments(userId: string): Promise<Expense[]> {
        return await this.expenseRepository.find({ where: { userId: Number(userId), type: ExpenseType.INSTALLMENT } }); // Récupérer les paiements échelonnés de l'utilisateur
    }
    async getExpenseSummary(userId: string): Promise<any> {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Premier jour du mois en cours
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); // Premier jour du mois suivant

        // Récupérer toutes les dépenses sauf celles de type ONCE
        const nonOnceExpenses = await this.expenseRepository.find({
            where: {
                userId: Number(userId),
                type: Not(ExpenseType.ONCE), // Exclure les dépenses de type ONCE
            },
            relations: ['categoryEntity'],
        });

        // Récupérer uniquement les dépenses de type ONCE pour le mois en cours
        const monthlyOnceExpenses = await this.expenseRepository.find({
            where: {
                userId: Number(userId),
                type: ExpenseType.ONCE,
                dateCreate: Between(startOfMonth, endOfMonth), // Filtrer par date
            },
            relations: ['categoryEntity'],
        });

        // Fusionner les deux tableaux
        const allExpenses = [...nonOnceExpenses, ...monthlyOnceExpenses];

        return allExpenses; // Retourner le tableau fusionné
    }


}
