import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private readonly httpService: HttpService,
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  /**
   * It sends an email to the user's email address with the subject and content provided
   * @param {string} toEmail - The email address of the recipient
   * @param {string} subject - The subject of the email
   * @param {string} content - The content of the email.
   * @returns A promise that resolves to void.
   */
  async sendMail(
    toEmail: string,
    subject: string,
    content: string,
    payload?: string,
  ): Promise<any> {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = {
      email: toEmail,
      subject: subject,
      message: content,
      payload: payload || '',
    };
    const path = process.env.EMAIL_API_SERVER;
    try {
      const responseData = await lastValueFrom(
        this.httpService.post(path, body, requestConfig).pipe(
          map((response) => {
            console.log(response?.data);
            response?.data;
          }),
        ),
      ).catch((e) => {
        console.log(e);
      });
      return responseData;
    } catch (e) {
      console.log('error :', e);
    }
  }

  generateCodePhysicalAppointment(): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

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
      'status',
      'translatorId',
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
      const cachedData = await this.redisRepository.get(
        'GET_ALL',
        `${Appointment.name.toLocaleUpperCase()}:${JSON.stringify(query)}:${JSON.stringify(pagination)}`,
      );
      if (cachedData) {
        const appointments = JSON.parse(cachedData, (key, value) => {
          return key === 'createdAt' ||
            key === 'updatedAt' ||
            key === 'datetime'
            ? new Date(value)
            : value;
        });
        return appointments;
      }
    } catch (error) {
      console.error('Error retrieving from Redis:', error);
    }

    return this.retrieveAndCacheAppointments(filterDto, paginationDto);
  }

  async retrieveAndCacheAppointments(
    filterDto: FilterAppointmentDto,
    paginationDto: PaginationDto,
  ): Promise<AppointmentListWithMeta> {
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

      await this.redisRepository.setWithExpiry(
        'GET_ALL',
        `${Appointment.name.toLocaleUpperCase()}:${JSON.stringify(query)}:${JSON.stringify(pagination)}`,
        JSON.stringify(result),
        expiredAt,
      );

      return result;
    } catch (error) {
      console.error('Error fetching from MongoDB:', error);
    }
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

  async updateAppointment(
    id: string,
    partialApointment: UpdateAppointmentDto,
  ): Promise<Appointment> {
    try {
      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(id, partialApointment, { new: true })
        .exec();

      if (!updatedAppointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      return updatedAppointment;
    } catch (error) {}
  }

  async deleteAppointment(id: string): Promise<Appointment> {
    try {
      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(id, { deleted: true }, { new: true })
        .exec();

      if (!updatedAppointment) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      return updatedAppointment;
    } catch (error) {}
  }
}
