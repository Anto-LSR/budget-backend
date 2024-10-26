import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();    
    if (!request.cookies || !request.cookies.token) {
      log('No token');
      log(request.cookies);
      return false; // Pas de token, pas d'accès
    }

    const token = request.cookies.token; // Extraire le token du cookie

    try {
      const payload = this.jwtService.verify(token); // Vérifier le token
      request.user = payload; // Ajouter les informations de l'utilisateur à la requête
      return true; // Autoriser l'accès
    } catch (error) {
      console.log(error);
      return false; // Token invalide
    }
  }
}
