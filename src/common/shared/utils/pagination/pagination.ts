import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  pageCount: number;
}
