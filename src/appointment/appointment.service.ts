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
    // private readonly httpService: HttpService,
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  // async getTranslatorById(userId: string, token: string) {
  //   const requestConfig: AxiosRequestConfig = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: token,
  //     },
  //   };
  //   const graphqlQuery = {
  //     query: getTranslatorByIdQuery(userId),
  //   };
  //   const path = process.env.USERS_SERVICE_URI;
  //   try {
  //     const responseData = await lastValueFrom(
  //       this.httpService
  //         .post(path, graphqlQuery, requestConfig)
  //         .pipe(map((response) => response.data)),
  //     ).catch((e) => {
  //       console.log(e);
  //     });
  //     return responseData;
  //   } catch (e) {
  //     console.log('error :', e);
  //     throw new InternalServerErrorException(e);
  //   }
  // }

  async findAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const data = await this.redisRepository.get(
        'GET_BY_ID',
        Appointment.name.toLocaleUpperCase(),
        id,
      );
      if (data) {
        const appointment = JSON.parse(data, (key, value) => {
          return key === 'createdAt' ||
            key === 'updatedAt' ||
            key === 'datetime'
            ? new Date(value)
            : value;
        });
        return appointment;
      }
      const appointmentExist = await this.appointmentModel
        .findById({
          _id: id,
          deleted: false,
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

  // async findAllAppointments(
  //   filterDto?: FilterAppointmentDto,
  //   paginationDto?: PaginationDto,
  // ): Promise<AppointmentListWithMeta | Appointment[]> {
  //   try {
  //     const cachedData = await this.redisRepository.get(
  //       'GET_ALL',
  //       Appointment.name.toLocaleUpperCase(),
  //       `${JSON.stringify(filterDto)}:${JSON.stringify(paginationDto)}`,
  //     );
  //     if (cachedData) {
  //       return JSON.parse(cachedData);
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving from Redis:', error);
  //   }

  //   // Continue with database retrieval if no cache is found
  //   return this.retrieveAndCacheAppointments(filterDto, paginationDto);
  // }

  // async retrieveAndCacheAppointments(
  //   filterDto: FilterAppointmentDto,
  //   paginationDto: PaginationDto,
  // ): Promise<AppointmentListWithMeta> {
  //   const query = this.buildQuery(filterDto);
  //   const pagination = getPagination(paginationDto);

  //   try {
  //     const [data, total] = await Promise.all([
  //       this.appointmentModel
  //         .find(query)
  //         .skip((pagination.page - 1) * pagination.pageSize)
  //         .limit(pagination.limit)
  //         .exec(),
  //       this.appointmentModel.countDocuments(query),
  //     ]);

  //     const result = {
  //       data,
  //       meta: {
  //         total,
  //         page: pagination.page,
  //         pageSize: pagination.pageSize,
  //         pageCount: Math.ceil(total / pagination.pageSize),
  //       },
  //     };

  //     // Store the result in Redis with an expiry time
  //     await this.redisRepository.setWithExpiry(
  //       'GET_ALL',
  //       Appointment.name.toLocaleUpperCase(),
  //       `${JSON.stringify(filterDto)}:${JSON.stringify(paginationDto)}`,
  //       JSON.stringify(result),
  //       3600, // Expiry in seconds, adjust as necessary
  //     );

  //     console.log('Data cached in Redis');
  //     return result;
  //   } catch (error) {
  //     console.error('Error fetching from MongoDB:', error);
  //     throw error; // It's good practice to throw the error so that the caller knows something went wrong.
  //   }
  // }

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
