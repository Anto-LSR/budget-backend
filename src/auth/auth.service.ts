// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/users.service'; // Assure-toi que le chemin est correct
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Créer un nouvel utilisateur avec le mot de passe haché
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Retourner une réponse appropriée
    return { message: 'Inscription réussie !', user };
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.userService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload); // Retourner uniquement le token
  }

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      // Récupérer l'utilisateur de votre base de données en fonction de l'ID dans le payload
      return await this.userRepository.findOne(payload.sub); // ou une méthode appropriée pour récupérer l'utilisateur
    } catch (error) {
      return null; // Si le token est invalide, retourner null
    }
  }
}
