import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvestorProfileDto {
  @ApiPropertyOptional({ example: 100000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ example: 'Опытный инвестор в IT-стартапы' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: ['SaaS', 'Mobile Apps', 'AI'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({ example: ['программа', 'сервис'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCategories?: string[];
}

export class UpdateInvestorProfileDto {
  @ApiPropertyOptional({ example: 150000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ example: 'Обновленное био' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: ['SaaS', 'Mobile Apps'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({ example: ['программа', 'сайт'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCategories?: string[];
}

export class InvestorProfileResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  userId: string;

  @ApiPropertyOptional({ example: 100000 })
  budget?: number;

  @ApiPropertyOptional({ example: 'Опытный инвестор' })
  bio?: string;

  @ApiPropertyOptional({ example: ['SaaS', 'AI'] })
  interests?: string[];

  @ApiPropertyOptional({ example: ['программа', 'сервис'] })
  preferredCategories?: string[];

  @ApiProperty({ example: 0 })
  totalInvestments: number;

  @ApiProperty({ example: 0 })
  investedAmount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
