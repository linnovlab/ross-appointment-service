import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';
import RoleGuard from './guards/roles.guard';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const UseRoles = () => UseGuards(RoleGuard);

export const UseJwt = () => UseGuards(JwtAuthGuard);
