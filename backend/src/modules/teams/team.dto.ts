import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeamStatus } from './team.entity';

export class CreateTeamDto {
  @ApiProperty({ example: 'Команда разработки' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Описание команды и целей' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid', description: 'ID идеи' })
  @IsString()
  @IsNotEmpty()
  ideaId: string;
}

export class UpdateTeamDto {
  @ApiPropertyOptional({ example: 'Обновленное название' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Обновленное описание' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'active', enum: TeamStatus })
  @IsEnum(TeamStatus)
  @IsOptional()
  status?: TeamStatus;
}

export class TeamResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Команда разработки' })
  name: string;

  @ApiPropertyOptional({ example: 'Описание команды' })
  description?: string;

  @ApiProperty({ example: 'active', enum: TeamStatus })
  status: string;

  @ApiProperty({ example: 'uuid' })
  ideaId: string;

  @ApiProperty({ example: 'uuid' })
  leaderId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
