import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDatasetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;
}
