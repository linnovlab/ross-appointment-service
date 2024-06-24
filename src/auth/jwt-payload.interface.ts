import { Role } from 'src/common/shared/enum/role.enum';

export interface JwtPayload {
  email: string;
  role: Role;
}
