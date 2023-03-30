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
    // console.log('required roles', requiredRoles);
    // if no role?, request should flow
    if (!requiredRoles) {
      return true;
    }
    // get the user from the quest
    // annotate user type? :User
    const { user } = context.switchToHttp().getRequest();
    // console.log('Request.user rolesGuard', user.roles);
    // if (!user) {
    //   return true;
    // }
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
