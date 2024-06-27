import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeConsulation } from 'src/common/shared/enum/consultation.enum';
import { TypeAppointments } from 'src/common/shared/enum/typeAppointment.enum';

@InputType()
export class FilterAppointmentDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  _id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  motif?: string;

  @IsString()
  @IsOptional()
  @IsEnum(TypeConsulation)
  @Field({
    nullable: true,
    defaultValue: TypeConsulation.VIDEOCALL,
    description: 'Is and enum (PHYSICAL,VISIOCONFERENCE,PHONECALL)',
  })
  consultation?: TypeConsulation;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  clientId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  translatorId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  duration?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  spokenLanguage?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  translatedLanguage?: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true, defaultValue: false })
  deleted?: boolean;

  @IsEnum(TypeAppointments)
  @IsOptional()
  @Field({
    nullable: true,
    description: 'Is an enum (INCOMING, PASSED)',
  })
  status?: TypeAppointments;
}
