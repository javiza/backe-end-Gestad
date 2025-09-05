import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsNotEmpty()
  @IsString()
  nombre_usuario: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT chileno con guion' })
  @IsNotEmpty()
  @Matches(/^\d{7,8}-[0-9Kk]$/, {
    message: 'El RUT debe tener el formato 12345678-9',
  })
  rut: string;

  @ApiProperty({ example: 'juan@correo.cl', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña segura (mínimo 8 caracteres)' })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe contener mayúscula, minúscula, número y símbolo',
  })
  password: string;

  @ApiProperty({ example: 'administrador', enum: ['administrador', 'usuario'] })
  @IsIn(['administrador', 'usuario'])
  rol: 'administrador' | 'usuario';
}