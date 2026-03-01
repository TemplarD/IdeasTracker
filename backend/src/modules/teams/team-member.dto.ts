import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberStatus } from './team-member.entity';

export class JoinTeamDto {
  @ApiPropertyOptional({ example: 'Разработчик' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: 'Опыт работы с React и Node.js' })
  @IsString()
  @IsOptional()
  bio?: string;
}

export class UpdateMemberStatusDto {
  @ApiProperty({ example: 'active', enum: MemberStatus })
  @IsEnum(MemberStatus)
  @IsNotEmpty()
  status: MemberStatus;
}

export class TeamMemberResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  teamId: string;

  @ApiProperty({ example: 'uuid' })
  userId: string;

  @ApiPropertyOptional({ example: 'Разработчик' })
  role?: string;

  @ApiPropertyOptional({ example: 'Опыт работы' })
  bio?: string;

  @ApiProperty({ example: 'pending', enum: MemberStatus })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  joinedAt: Date;
}
