import { IsNotEmpty, IsString, IsUUID, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsString()
  @IsNotEmpty()
  status: string; 

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
