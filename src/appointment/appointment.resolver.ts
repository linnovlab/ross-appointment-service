import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import {
  Appointment,
  AppointmentListWithMeta,
} from './entity/appointment.entity';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';
import { PaginationDto } from 'src/common/shared/utils/pagination/pagination.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UseJwt } from 'src/auth/auth.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import RoleGuard from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/shared/enum/role.enum';

@Resolver('Appointment')
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Query(() => AppointmentListWithMeta)
  @UseJwt()
  async findAllAppointment(
    @Args('filter', { nullable: true }) filter: FilterAppointmentDto,
    @Args('pagination', { nullable: true }) pagination: PaginationDto,
  ): Promise<AppointmentListWithMeta | Appointment[]> {
    return await this.appointmentService.findAllAppointments(
      filter,
      pagination,
    );
  }

  @Query(() => Appointment, { nullable: true })
  @UseJwt()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.CLIENT))
  async findAppointmentById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Appointment> {
    return await this.appointmentService.findAppointmentById(id);
  }

  @Mutation(() => Appointment, { nullable: true })
  @UseJwt()
  async createAppointment(
    @Args('appointmentDTO') data: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.createAppointment(data);
  }
}
