// src/users/user.service.ts
import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Cet Email est déjà utilisé'); // Lancer une exception si l'email existe déjà
    }

    const user = this.userRepository.create(createUserDto); // Créer un nouvel utilisateur
    return this.userRepository.save(user); // Enregistrer l'utilisateur en base de données
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async validateUser(loginUserDto: { email: string; password: string }): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });

    if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
      return user; // L'utilisateur est validé
    }

    throw new UnauthorizedException('Identifiants invalides'); // Si l'utilisateur n'existe pas ou le mot de passe est incorrect
  }

}
