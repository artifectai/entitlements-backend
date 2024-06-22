import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessRequestDto } from './create-access-request.dto';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateAccessRequestDto extends PartialType(CreateAccessRequestDto) {
  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  requested_at?: Date;

  @IsDateString()
  @IsOptional()
  resolved_at?: Date;
}
