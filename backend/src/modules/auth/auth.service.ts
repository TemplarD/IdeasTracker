import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/user.dto';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Tokens & { user: any }> {
    const user = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { ...tokens, user };
  }

  async login(email: string, password: string): Promise<Tokens & { user: any }> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    
    const userProfile = await this.usersService.findById(user.id);
    
    return { ...tokens, user: userProfile };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findByIdWithoutPassword(userId);
    
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isRefreshTokenValid = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    if (!isRefreshTokenValid || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Неверный refresh token');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    
    return tokens;
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN', '1d'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, refreshToken);
  }
}
