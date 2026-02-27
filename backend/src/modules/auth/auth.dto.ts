import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsNotEmpty()
  lastName?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
