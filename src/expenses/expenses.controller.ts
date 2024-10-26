// src/expenses/expenses.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get, Delete, Param, Patch } from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Request } from 'express';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('addExpense')
  @UseGuards(JwtAuthGuard) // Protection de la route par un guard JWT
  async addExpense(@Body() createExpenseDto: CreateExpenseDto, @Req() request: any) {
    const userId = request.user.sub;
    const expenseWithUserId = {
      ...createExpenseDto,
      userId: userId, // Ajoute l'ID de l'utilisateur à l'objet de dépense
    };

    const newExpense = await this.expenseService.addExpense(expenseWithUserId);
    return newExpense; // Retourner l'objet de dépense nouvellement créé
  }

  @Get('getSubscriptions')
  @UseGuards(JwtAuthGuard) // Protection de la route par un guard JWT
  async getSubscriptions(@Req() request: any) {
    const userId = request.user.sub;
    const subscriptions = await this.expenseService.getSubscriptions(userId);
    return subscriptions; // Retourner la liste des abonnements de l'utilisateur
  }

  //delete expense
  @Delete('deleteExpense/:id')
  @UseGuards(JwtAuthGuard) // Protection de la route par un guard JWT
  async deleteExpense(@Param('id') expenseId: number, @Req() request: any) {
    const userId = request.user.sub;
    const deletedExpense = await this.expenseService.deleteExpense(expenseId, userId);
    return deletedExpense; // Retourner l'objet de dépense supprimé
  }

  //pause subscription
  @Patch('pauseSubscription/:id')
  @UseGuards(JwtAuthGuard) // Protection de la route par un guard JWT
  async pauseSubscription(@Param('id') expenseId: number, @Req() request: any) {
    const userId = request.user.sub;
    const pausedSubscription = await this.expenseService.pauseSubscription(expenseId, userId);
    return pausedSubscription; // Retourner l'abonnement mis en pause
  }

  //getFixedCosts
  @Get('getFixedCosts')
  @UseGuards(JwtAuthGuard) // Protection de la route par un guard JWT
  async getFixedCosts(@Req() request: any) {
    const userId = request.user.sub;
    const fixedCosts = await this.expenseService.getFixedCosts(userId);
    return fixedCosts; // Retourner la liste des dépenses fixes de l'utilisateur
  }
}
