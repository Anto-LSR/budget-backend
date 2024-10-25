// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token; // Extraire le token du cookie

    if (!token) {
      return false; // Pas de token, pas d'accès
    }

    try {
      const payload = this.jwtService.verify(token); // Vérifier le token
      request.user = payload; // Ajouter les informations de l'utilisateur à la requête
      return true; // Autoriser l'accès
    } catch (error) {
      return false; // Token invalide
    }
  }
}
