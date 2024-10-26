// src/auth/auth.controller.ts
import { Body, Controller, Post, ConflictException, Res, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express'; // N'oubliez pas d'importer Response
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signup(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message); // Relancer l'exception pour renvoyer un code 409
      }
      throw error; // Relancer toute autre erreur
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    console.log('Tentative de connexion avec:', loginUserDto);

    const token = await this.authService.login(loginUserDto); // Appelle le service pour obtenir le token

    // Envoie le token en tant que cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true, // Le cookie n'est pas accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Utiliser secure si en production
      maxAge: 3600000, // Durée de vie d'une heure (en millisecondes)
    });

    return res.json({ message: 'Connexion réussie !' }); // Renvoyer une réponse JSON
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    // Supprimer le cookie en le définissant avec une date d'expiration dans le passé
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0) // Définir une date d'expiration dans le passé
    });

    return res.json({ message: 'Déconnexion réussie !' }); // Renvoyer une réponse JSON
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Request() req: Request) {
    // Si le guard réussit, l'utilisateur est authentifié et vous pouvez retourner ses informations
    return { authenticated: true }; // req.user contient les informations de l'utilisateur
  }

  @UseGuards(JwtAuthGuard) // Protéger cette route avec le guard
  @Post('protected-route') // Exemple de route protégée
  getProtectedData() { 
    return { message: 'Vous avez accès à ces données protégées !' };
  }
}
