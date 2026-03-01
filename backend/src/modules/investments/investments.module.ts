import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './investment.entity';
import { Idea } from '../ideas/idea.entity';
import { User } from '../users/user.entity';
import { InvestorProfile } from '../investors/investor-profile.entity';
import { Notification } from '../notifications/notification.entity';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { InvestorProfilesModule } from '../investors/investor-profiles.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment, Idea, User, Notification]),
    InvestorProfilesModule,
    NotificationsModule,
  ],
  providers: [InvestmentsService],
  controllers: [InvestmentsController],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
