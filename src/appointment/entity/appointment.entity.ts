import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TypeConsulation } from 'src/common/shared/enum/consultation.enum';
import { Pagination } from 'src/common/shared/utils/pagination/pagination';

export type AppointmentDocument = Appointment & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Appointment {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field(() => String, { nullable: false })
  motif: string;

  @Prop({ enum: TypeConsulation, required: true })
  @Field({ nullable: false, defaultValue: TypeConsulation.VIDEOCALL })
  consultation: TypeConsulation;

  @Prop({ required: true })
  @Field({ nullable: false })
  clientId: string;

  @Prop({ required: true })
  @Field({ nullable: false })
  translatorId: string;

  @Prop({ default: 30, required: true })
  @Field({ nullable: false })
  duration: number;

  @Prop({ type: Date, default: Date.now, required: true })
  @Field({ nullable: false })
  datetime: string;

  @Prop()
  @Field(() => String, { nullable: true })
  note: string;

  @Field(() => [String], { nullable: true })
  documentId: string[];

  @Prop({ required: true })
  @Field({ nullable: false })
  spokenLanguage: string;

  @Prop({ required: true })
  @Field({ nullable: false })
  translatedLanguage: string;

  @Prop({ default: false })
  @Field({ nullable: true })
  deleted: boolean;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  updatedAt: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

@ObjectType()
export class AppointmentListWithMeta {
  @Field(() => [Appointment])
  data: Appointment[];

  @Field(() => Pagination)
  meta: Pagination;
}
