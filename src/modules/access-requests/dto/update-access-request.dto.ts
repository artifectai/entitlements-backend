import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessRequestDto } from './create-access-request.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { StatusEnum } from '../../../common/types'

export class UpdateAccessRequestDto extends PartialType(CreateAccessRequestDto) {
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @IsDateString()
  @IsOptional()
  requestedAt?: Date;

  @IsDateString()
  @IsOptional()
  resolvedAt?: Date;

  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @IsBoolean()
  @IsOptional()
  isTemporary?: boolean;
}
