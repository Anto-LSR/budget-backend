import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
    
  }

  @Post('createCategory')
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const user = req.user;
    return this.categoriesService.create(createCategoryDto, user);
  }

  @Get('getCategories')
  @UseGuards(JwtAuthGuard)
  async getCategories() {
    return this.categoriesService.findAll();
  }
}
