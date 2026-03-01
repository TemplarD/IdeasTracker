import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from './notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'investment_proposed', enum: NotificationType })
  type: string;

  @ApiProperty({ example: 'Новая заявка на инвестирование' })
  title: string;

  @ApiProperty({ example: 'Инвестор предложил $50,000' })
  message: string;

  @ApiPropertyOptional({ example: 'uuid' })
  referenceId?: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;
}
