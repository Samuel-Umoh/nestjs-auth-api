// import { Role } from '../enum/role.enum';
// define and import Role[] enum and annotate .roles: Role[]
export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  password?: string;
  roles: string[];
}
