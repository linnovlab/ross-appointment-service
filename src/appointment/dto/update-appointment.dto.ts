import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';
import { TypeConsulation } from 'src/common/shared/enum/consultation.enum';
import { TypeAppointments } from 'src/common/shared/enum/typeAppointment.enum';

@InputType()
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  motif: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TypeConsulation)
  @Field({
    nullable: true,
    defaultValue: TypeConsulation.VIDEOCALL,
    description: 'Is and enum (PHYSICAL,VISIOCONFERENCE,PHONECALL)',
  })
  consultation: TypeConsulation;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  translatorId: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  translatorName: string;

  @IsNumber()
  @IsNotEmpty()
  @Field({ nullable: true })
  duration: number;

  // 2024-06-18 12:32:46
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  datetime: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  note: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  documentId: string[];

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  spokenLanguage: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  translatedLanguage: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true, defaultValue: false })
  deleted: boolean;

  @IsEnum(TypeAppointments)
  @IsOptional()
  @Field({
    nullable: true,
    description: 'Is an enum (INCOMING, PASSED)',
  })
  status?: TypeAppointments;
}
