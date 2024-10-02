module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: ['dist/**/*.entity*{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  ssl: process.env.SERVER_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
