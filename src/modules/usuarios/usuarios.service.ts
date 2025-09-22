import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuariosRepo.create(createUsuarioDto);
    usuario.password = await bcrypt.hash(createUsuarioDto.password, 10);

    try {
      return await this.usuariosRepo.save(usuario);
    } catch (e) {
      if (e.code === '23505') { //codigo para error en caso que el rut ya existe
        throw new ConflictException('Email o RUT ya existen');
      }
      throw e; // en caso de otros errores
    }
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepo.find({ select: ['id', 'nombre_usuario', 'rut', 'email', 'rol', 'fecha_creacion'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { id }, select: ['id', 'nombre_usuario', 'email', 'rol', 'fecha_creacion'] });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

async findByEmail(email: string): Promise<Usuario | null> {
  const usuario = await this.usuariosRepo.findOne({
    where: { email },
    select: [
      'id',
      'nombre_usuario',
      'email',
      'password',   // 👈 incluimos explícitamente
      'rol',
      'activo',
    ],
  });

  console.log('📌 findByEmail → Usuario devuelto:', usuario);
  return usuario;
}





  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuariosRepo.preload({ id, ...updateUsuarioDto });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (updateUsuarioDto.password) {
      usuario.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    return this.usuariosRepo.save(usuario);
  }

async remove(id: number): Promise<void> {
  const usuario = await this.usuariosRepo.findOne({ where: { id } });
  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }
  usuario.activo = false; // baja lógica
  await this.usuariosRepo.save(usuario);
}

}
