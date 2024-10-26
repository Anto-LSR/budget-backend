import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { User } from 'src/users/user.entity';
import { log } from 'console';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, user: any): Promise<Category> {
        log(user);
        const newCategory = this.categoryRepository.create({
            ...createCategoryDto,
            expenses: createCategoryDto.expenses || [],
            userId: user.sub,
        });
        return this.categoryRepository.save(newCategory);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }
}
