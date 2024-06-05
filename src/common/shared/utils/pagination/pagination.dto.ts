import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class PaginationDto {
  @Type(() => Number)
  @Field({ nullable: true })
  page: number;

  @Type(() => Number)
  @Field({ nullable: true })
  pageSize: number;

  @Type(() => Number)
  @Field({ nullable: true })
  limit: number;
}
