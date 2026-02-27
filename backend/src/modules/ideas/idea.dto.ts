import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IdeaStatus } from './idea.entity';

export class CreateIdeaDto {
  @ApiProperty({ example: 'Новая социальная сеть' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Описание идеи...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://docs.google.com/presentation/...' })
  @IsString()
  @IsOptional()
  presentationUrl?: string;

  @ApiPropertyOptional({ example: ['https://example.com/file.pdf'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @ApiPropertyOptional({ example: ['социальная сеть', 'web'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'сайт' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'draft', enum: IdeaStatus })
  @IsEnum(IdeaStatus)
  @IsOptional()
  status?: IdeaStatus;
}

export class UpdateIdeaDto {
  @ApiPropertyOptional({ example: 'Новая социальная сеть' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Обновленное описание...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://docs.google.com/presentation/...' })
  @IsString()
  @IsOptional()
  presentationUrl?: string;

  @ApiPropertyOptional({ example: ['https://example.com/file.pdf'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @ApiPropertyOptional({ example: ['социальная сеть', 'web'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'сайт' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 'published', enum: IdeaStatus })
  @IsEnum(IdeaStatus)
  @IsOptional()
  status?: IdeaStatus;
}

export class IdeaResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Новая социальная сеть' })
  title: string;

  @ApiProperty({ example: 'Описание идеи...' })
  description: string;

  @ApiPropertyOptional({ example: 'https://docs.google.com/presentation/...' })
  presentationUrl?: string;

  @ApiPropertyOptional({ example: ['file1.pdf'] })
  attachments?: string[];

  @ApiPropertyOptional({ example: ['социальная сеть', 'web'] })
  tags: string[];

  @ApiPropertyOptional({ example: 'сайт' })
  category?: string;

  @ApiProperty({ example: 'draft', enum: IdeaStatus })
  status: string;

  @ApiProperty({ example: 0 })
  viewsCount: number;

  @ApiProperty({ example: 0 })
  averageRating: number;

  @ApiProperty({ example: 'uuid' })
  authorId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
