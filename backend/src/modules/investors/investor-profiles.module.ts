import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestorProfile } from './investor-profile.entity';
import { InvestorProfilesService } from './investor-profiles.service';
import { InvestorProfilesController } from './investor-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvestorProfile])],
  providers: [InvestorProfilesService],
  controllers: [InvestorProfilesController],
  exports: [InvestorProfilesService],
})
export class InvestorProfilesModule {}
