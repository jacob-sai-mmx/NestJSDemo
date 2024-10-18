import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config } from './config.entity';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(): Promise<Config | null> {
    return this.configService.getConfig();
  }

  @Put()
  async updateConfig(@Body() body: Partial<Config>): Promise<Config | null> {
    return this.configService.updateConfig(body);
  }
}
