import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment.resolver';
import { MongodbModule } from 'src/common/config/database/mongodb.module';
import { redisClientFactory } from 'src/common/config/cache/redis.client.factory';
import { RedisRepository } from 'src/common/config/cache/redis.repository';

@Module({
  imports: [MongodbModule],
  providers: [
    AppointmentService,
    AppointmentResolver,
    redisClientFactory,
    RedisRepository,
  ],
})
export class AppointmentModule {}
