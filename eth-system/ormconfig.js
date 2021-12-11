module.exports = {
  'type': 'mysql',
  'host': process.env.MYSQL_HOST,
  'port': process.env.MYSQL_PORT || 3306,
  'username': process.env.MYSQL_ETH_SYSTEM_USER,
  'password': process.env.MYSQL_ETH_SYSTEM_PASSWORD,
  'database': process.env.MYSQL_DATABASE,
  'synchronize': false,
  'logging': true,
  'logger': 'file',
  'maxQueryExecutionTime': 1000,
  'migrationsRun': true,
  'cache': {
    type: 'redis',
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  'entities': [
    'dist/entity/**/*.js',
  ],
  'migrations': [
    'dist/migration/**/*.js',
  ],
  'subscribers': [
    'dist/subscriber/**/*.js',
  ],
  'cli': {
    'entitiesDir': 'src/entity',
    'migrationsDir': 'src/migration',
    'subscribersDir': 'src/subscriber',
  },
};
