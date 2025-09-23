import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth-user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-user')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
