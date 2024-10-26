import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';

@Injectable()
export class IncomesService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepository: Repository<Income>,
    ) { }

    async addIncome(createIncomeDto: CreateIncomeDto): Promise<Income> {
        const income = this.incomeRepository.create(createIncomeDto);
        return await this.incomeRepository.save(income);
    }

    async getIncomes(userId: string): Promise<Income[]> {
        return await this.incomeRepository.find({ where: { userId: Number(userId) } });
    }

    async deleteIncome(incomeId: number, userId: string): Promise<Income> {
        const income = await this.incomeRepository.findOne({ where: { id: incomeId, userId: Number(userId) } });
        if (!income) {
            return null;
        }
        await this.incomeRepository.remove(income);
        return income;
    }
}
