import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Appointment } from './appointment.entity';
import { Config } from 'src/config/config.entity';
import { AppointmentService } from './appointment.service';
import { ConfigService } from 'src/config/config.service';
import { AppointmentController } from './appointment.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Appointment, Config])],
  controllers: [AppointmentController],
  providers: [AppointmentService, ConfigService],
})
export class AppointmentModule {}
