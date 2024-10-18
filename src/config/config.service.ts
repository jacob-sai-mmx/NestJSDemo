import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Config } from './config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: EntityRepository<Config>,
  ) {}

  async getConfig(): Promise<Config> {
    try {
      const config = await this.configRepository.findOne({ id: 1 });
      if (!config) {
        throw new HttpException(
          'Configuration not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return config;
    } catch (error) {
      console.error(
        '[ConfigService] [getConfig] Error fetching config:',
        error,
      );
      throw new HttpException(
        'Error fetching configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateConfig(data: Partial<Config>): Promise<Config> {
    try {
      const config = await this.getConfig(); // Reuse getConfig to fetch the existing config

      this.configRepository.assign(config, data);
      await this.configRepository.getEntityManager().persistAndFlush(config);

      return config;
    } catch (error) {
      console.error(
        '[ConfigService] [updateConfig] Error updating config:',
        error,
      );
      throw new HttpException(
        'Error updating configuration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
