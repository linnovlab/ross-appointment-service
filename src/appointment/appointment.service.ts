import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentDocument,
  AppointmentListWithMeta,
} from './entity/appointment.entity';
import { Model } from 'mongoose';
import { RedisRepository } from 'src/common/config/cache/redis.repository';
import { expiredAt } from 'src/common/shared/constant/expiry.constant';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';
import { PaginationDto } from 'src/common/shared/utils/pagination/pagination.dto';
import { getPagination } from 'src/common/shared/utils/pagination/getPagination';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async findAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const data = await this.redisRepository.get(
        'GET_BY_ID',
        Appointment.name.toLocaleUpperCase(),
        id,
      );
      if (data) {
        return JSON.parse(data);
      }
      const appointmentExist = await this.appointmentModel
        .findById({
          _id: id,
        })
        .exec();
      if (appointmentExist) {
        await this.redisRepository.setWithExpiry(
          'GET_BY_ID',
          Appointment.name.toLocaleUpperCase(),
          JSON.stringify(appointmentExist),
          expiredAt,
          id,
        );
        return appointmentExist;
      }
      return null;
    } catch (error) {}
  }

  private buildQuery(filterDto: FilterAppointmentDto): any {
    const query = {};
    if (!filterDto) return query;

    const properties = [
      '_id',
      'motif',
      'typeConsultation',
      'deleted',
      'clientId',
      'AppointmentId',
      'spokenLanguage',
      'translatedLanguage',
      'rates',
    ];
    properties.forEach((prop) => {
      if (filterDto[prop] !== undefined) {
        query[prop] = filterDto[prop];
      }
    });

    return query;
  }

  async findAllAppointments(
    filterDto?: FilterAppointmentDto,
    paginationDto?: PaginationDto,
  ): Promise<AppointmentListWithMeta | Appointment[]> {
    const query = this.buildQuery(filterDto);
    const pagination = getPagination(paginationDto);

    try {
      const [data, total] = await Promise.all([
        this.appointmentModel
          .find(query)
          .skip((pagination.page - 1) * pagination.pageSize)
          .limit(pagination.limit)
          .exec(),
        this.appointmentModel.countDocuments(query),
      ]);
      const result = {
        data,
        meta: {
          total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: Math.ceil(total / pagination.pageSize),
        },
      };
      return result;
    } catch (error) {}
  }

  async createAppointment(
    appointment: CreateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const newAppoitment = new this.appointmentModel(appointment);
      return newAppoitment.save().then((res) => {
        return res;
      });
    } catch (error) {}
  }
}
