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
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Resolver('Appointment')
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Query(() => AppointmentListWithMeta)
  @UseJwt()
  async findAllAppointment(
    @Args('filter', { nullable: true }) filter: FilterAppointmentDto,
    @Args('pagination', { nullable: true }) pagination: PaginationDto,
    // @Context() context,
  ): Promise<AppointmentListWithMeta | Appointment[]> {
    // const authToken = context.req.headers['authorization'];
    // console.log('Authorization Token:', authToken);
    return await this.appointmentService.findAllAppointments(
      filter,
      pagination,
    );
  }

  @Query(() => Appointment, { nullable: true })
  @UseJwt()
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

  @Mutation(() => Appointment, { nullable: true })
  @UseJwt()
  async updateAppointment(
    @Args('id', { type: () => ID }) id: string,
    @Args('partialAppointmentDto') partialAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.updateAppointment(
      id,
      partialAppointmentDto,
    );
  }

  @Mutation(() => Appointment, { nullable: true })
  @UseJwt()
  async deleteAppointment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Appointment> {
    return await this.appointmentService.deleteAppointment(id);
  }
}
