import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
  const user = await this.usuariosService.findByEmail(email);
  console.log('🔍 Usuario encontrado:', user);

  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }
  if (!user.activo) {
    throw new UnauthorizedException('Usuario desactivado');
  }

  console.log('👉 Password plano recibido:', pass);
  console.log('👉 Hash en DB:', user.password);

  const passwordValid = await bcrypt.compare(pass, user.password);
  console.log('✅ Coinciden?', passwordValid);

  if (!passwordValid) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  return user;
}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { email: user.email, sub: user.id, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario, 
        email: user.email,
        rol: user.rol,
      },
    };
  }
}
