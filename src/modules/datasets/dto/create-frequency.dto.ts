import { IsUUID, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFrequencyDto {
  @IsUUID()
  @IsNotEmpty()
  datasetId: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsNumber()
  @IsNotEmpty()
  marketCapUsd: number;
}
