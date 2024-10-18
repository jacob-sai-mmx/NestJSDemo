import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Config } from './config.entity';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Config])],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
