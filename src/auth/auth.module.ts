// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module'; // Importer le module utilisateur
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'votre_secret', // Remplace par une clé secrète sécurisée
      signOptions: { expiresIn: '1h' }, // Durée de validité du token
    }),
  ], // Assure-toi que le UserModule est importé
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
