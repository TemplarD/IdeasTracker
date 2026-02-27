import { IsInt, IsNotEmpty, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  interest: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  benefit: number;

  @ApiProperty({ example: 3, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  profitability: number;
}

export class UpdateRatingDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  interest?: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  benefit?: number;

  @ApiProperty({ example: 3, minimum: 1, maximum: 5, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  profitability?: number;
}

export class RatingResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 5 })
  interest: number;

  @ApiProperty({ example: 4 })
  benefit: number;

  @ApiProperty({ example: 3 })
  profitability: number;

  @ApiProperty({ example: 4.0 })
  averageRating: number;

  @ApiProperty({ example: 'uuid' })
  userId: string;

  @ApiProperty({ example: 'uuid' })
  ideaId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;
}
