import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessRequestDto } from './create-access-request.dto';
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateAccessRequestDto extends PartialType(CreateAccessRequestDto) {
  @IsString()
  @IsOptional()
  status?: string;

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
