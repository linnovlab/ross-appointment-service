import { Redis } from 'ioredis';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisRepositoryInterface } from 'src/common/shared/interface/redis.repository.interface';

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(
    prefix: string,
    key: string,
    option?: string,
  ): Promise<string | null> {
    if (option) return await this.redisClient.get(`${key}:${prefix}:${option}`);
    else return await this.redisClient.get(`${key}:${prefix}:`);
  }

  async set(
    prefix: string,
    key: string,
    value: string,
    option?: string,
  ): Promise<void> {
    if (option) await this.redisClient.set(`${key}:${prefix}:${option}`, value);
    else await this.redisClient.set(`${key}:${prefix}:`, value);
  }

  async delete(prefix: string, key: string, option?: string): Promise<void> {
    if (option) await this.redisClient.del(`${key}:${prefix}:${option}`);
    else await this.redisClient.del(`${key}:${prefix}:`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
    option?: string,
  ): Promise<void> {
    if (option)
      await this.redisClient.set(
        `${key}:${prefix}:${option}`,
        value,
        'EX',
        expiry,
      );
    else await this.redisClient.set(`${key}:${prefix}:`, value, 'EX', expiry);
  }
}
