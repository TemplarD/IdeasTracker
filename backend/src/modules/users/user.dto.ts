import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: 'Разработчик с 5-летним опытом' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: ['TypeScript', 'React', 'Node.js'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}

export class UserResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;

  @ApiPropertyOptional({ example: 'Разработчик с 5-летним опытом' })
  bio?: string;

  @ApiPropertyOptional({ example: ['TypeScript', 'React'] })
  skills?: string[];

  @ApiProperty({ example: 0 })
  reputation: number;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;
}
