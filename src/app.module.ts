import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOptions from './mikro-orm.config';

import { AppointmentModule } from './appointment/appointment.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOptions),
    AppointmentModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
