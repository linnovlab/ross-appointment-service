import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { Role } from 'src/common/shared/enum/role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const gqlContext = GqlExecutionContext.create(context);
      const request = gqlContext.getContext().req;
      await super.canActivate(context);

      const user = request.user;
      if (!user || !user?.role?.includes(role)) {
        throw new UnauthorizedException(
          'You do not have the required authorization.',
        );
      }
      return true;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
