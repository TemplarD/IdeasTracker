import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IdeasModule } from './modules/ideas/ideas.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ProgressModule } from './modules/progress/progress.module';

// Entities
import { User } from './modules/users/user.entity';
import { Idea } from './modules/ideas/idea.entity';
import { Rating } from './modules/ratings/rating.entity';
import { Comment } from './modules/comments/comment.entity';
import { Team } from './modules/teams/team.entity';
import { TeamMember } from './modules/teams/team-member.entity';
import { Progress } from './modules/progress/progress.entity';

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
      entities: [User, Idea, Rating, Comment, Team, TeamMember, Progress],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    IdeasModule,
    RatingsModule,
    CommentsModule,
    TeamsModule,
    ProgressModule,
  ],
})
export class AppModule {}
