import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './enum/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get the required role
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // if no role?, request should flow
    if (!requiredRoles) {
      return true;
    }
    // get the user from the request
    const { user } = context.switchToHttp().getRequest();
    // if (!user) i.e unAuthenticated request
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
