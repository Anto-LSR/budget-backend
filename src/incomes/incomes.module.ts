import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { AuthModule } from '../auth/auth.module';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Income]), AuthModule],
    providers: [IncomesService],
    controllers: [IncomesController],
    exports: [IncomesService],
})
export class IncomesModule {}
