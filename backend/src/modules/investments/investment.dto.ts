import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsEnum, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvestmentStatus } from './investment.entity';

export class CreateInvestmentDto {
  @ApiProperty({ example: 50000, description: 'Сумма инвестиции' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ example: 20, description: 'Доля в проекте (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  sharePercent?: number;

  @ApiPropertyOptional({ example: 5, description: 'Процент автору идеи (%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  authorPercent?: number;

  @ApiPropertyOptional({ example: 'Возврат через 2 года с 10% годовых' })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiPropertyOptional({ example: 'Заинтересовал ваш проект' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID идеи' })
  @IsString()
  @IsOptional()
  ideaId?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID команды' })
  @IsString()
  @IsOptional()
  teamId?: string;
}

export class UpdateInvestmentDto {
  @ApiPropertyOptional({ example: 60000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  sharePercent?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  authorPercent?: number;

  @ApiPropertyOptional({ example: 'Обновленные условия' })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiPropertyOptional({ example: 'discussion', enum: InvestmentStatus })
  @IsEnum(InvestmentStatus)
  @IsOptional()
  status?: InvestmentStatus;
}

export class InvestmentResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 50000 })
  amount: number;

  @ApiPropertyOptional({ example: 20 })
  sharePercent?: number;

  @ApiPropertyOptional({ example: 5 })
  authorPercent?: number;

  @ApiPropertyOptional({ example: 'Условия' })
  terms?: string;

  @ApiPropertyOptional({ example: 'Комментарий' })
  comment?: string;

  @ApiProperty({ example: 'proposed', enum: InvestmentStatus })
  status: string;

  @ApiProperty({ example: 'uuid' })
  investorId: string;

  @ApiPropertyOptional({ example: 'uuid' })
  ideaId?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  teamId?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
