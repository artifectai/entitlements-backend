import { IsNotEmpty, IsEnum, IsUUID, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusEnum } from '../../../common/types'

export class CreateAccessRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  datasetId: string;

  @IsUUID()
  @IsNotEmpty()
  frequencyId: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  requestedAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  resolvedAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiryDate?: Date;

  @IsBoolean()
  @IsOptional()
  isTemporary?: boolean;
}
