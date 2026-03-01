import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgressDto {
  @ApiProperty({ example: 'Завершили разработку основного функционала' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ProgressResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Завершили разработку' })
  content: string;

  @ApiProperty({ example: 'uuid' })
  teamId: string;

  @ApiProperty({ example: 'uuid' })
  authorId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;
}
