import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './src/config/database.config';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env'],
});

const configService = new ConfigService();

export const AppDataSource = new DataSource(getDatabaseConfig(configService));
