import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './investment.entity';
import { InvestorProfile } from '../investors/investor-profile.entity';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { InvestorProfilesService } from '../investors/investor-profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, InvestorProfile])],
  providers: [InvestmentsService, InvestorProfilesService],
  controllers: [InvestmentsController],
  exports: [InvestmentsService, InvestorProfilesService],
})
export class InvestmentsModule {}
