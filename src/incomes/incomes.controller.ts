import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIncomeDto } from './dto/create-income.dto';

@Controller('incomes')
export class IncomesController {
    constructor(private readonly incomesService: IncomesService) { }

    //add income
    @Post('addIncome')
    @UseGuards(JwtAuthGuard)
    async addIncome(@Body() createIncomeDto: CreateIncomeDto, @Req() request: any) {
        const userId = request.user.sub;
        const incomeWithUserId = {
            ...createIncomeDto,
            userId: userId,
        };

        const newIncome = await this.incomesService.addIncome(incomeWithUserId);
        return newIncome;
    }

    //get all incomes
    @Get('getIncomes')
    @UseGuards(JwtAuthGuard)
    async getIncomes(@Req() request: any) {
        const userId = request.user.sub;
        const incomes = await this.incomesService.getIncomes(userId);
        return incomes;
    }

    @Delete('deleteIncome/:id')
    @UseGuards(JwtAuthGuard)
    async deleteIncome(@Param('id') incomeId: number, @Req() request: any) {
        const userId = request.user.sub;
        const deletedIncome = await this.incomesService.deleteIncome(incomeId, userId);
        return deletedIncome;
    }

}
