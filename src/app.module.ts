import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { Expense } from './expenses/expense.entity';
import { ExpenseModule } from './expenses/expenses.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ExpenseModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'budget',  // Remplace par le nom de ta base de données MySQL
      entities: [User, Expense, Category], // Référence tes entités ici
      synchronize: true, // Utilisé pour synchroniser automatiquement l'entité avec la base de données. Désactive-le en production !
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
