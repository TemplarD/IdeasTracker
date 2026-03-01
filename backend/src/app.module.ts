import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { CommentsModule } from './modules/comments/comments.module';

// Entities
import { User } from './modules/users/user.entity';
import { Idea } from './modules/ideas/idea.entity';
import { Rating } from './modules/ratings/rating.entity';
import { Comment } from './modules/comments/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'ideatracker',
      password: process.env.DB_PASSWORD || 'ideatracker123',
      database: process.env.DB_NAME || 'ideatracker',
      entities: [User, Idea, Rating, Comment],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    IdeasModule,
    RatingsModule,
    CommentsModule,
  ],
})
export class AppModule {}
