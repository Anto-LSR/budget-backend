// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/users.service'; // Assure-toi que le chemin est correct
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
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
}
