import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    } //  aca en caso que no haya roles definidos,  se dá el acceso libre

    const request = context.switchToHttp().getRequest();
    const {user} = request;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }
    if (!roles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
