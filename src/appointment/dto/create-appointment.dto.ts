import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeConsulation } from 'src/common/shared/enum/consultation.enum';

@InputType()
export class CreateAppointmentDto {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  motif: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TypeConsulation)
  @Field({
    nullable: false,
    defaultValue: TypeConsulation.VIDEOCALL,
    description: 'Is and enum (PHYSICAL,VISIOCONFERENCE,PHONECALL)',
  })
  consultation: TypeConsulation;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  clientId: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  translatorId: string;

  @IsNumber()
  @IsNotEmpty()
  @Field({ nullable: false })
  duration: number;

  // 2024-06-18 12:32:46
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
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
  @Field({ nullable: false })
  spokenLanguage: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  translatedLanguage: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true, defaultValue: false })
  deleted: boolean;
}
