import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  synchronize: configService.get('SERVER_ENV') === 'development',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  ssl: configService.get('SERVER_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});