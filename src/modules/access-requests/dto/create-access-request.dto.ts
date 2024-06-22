import { IsNotEmpty, IsString, IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccessRequestDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  dataset_id: number;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsString()
  @IsNotEmpty()
  status: string; 

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  requested_at?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  resolved_at?: Date;
}
