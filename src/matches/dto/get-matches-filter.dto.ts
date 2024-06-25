import { IsOptional, IsString } from 'class-validator';

export class GetMatchesFilterDto {
  @IsOptional()
  @IsString()
  year?: number;
}
