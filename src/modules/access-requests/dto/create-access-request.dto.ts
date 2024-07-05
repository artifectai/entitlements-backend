import { IsNotEmpty, IsEnum, IsUUID, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccessRequestDto {
  @IsUUID()
  @IsNotEmpty()
  datasetId: string;

  @IsUUID()
  @IsNotEmpty()
  frequencyId: string;
}
