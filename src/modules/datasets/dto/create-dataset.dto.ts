import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateDatasetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsNumber()
  @IsNotEmpty()
  market_cap_usd: number;
}
