import * as IORedis from 'ioredis';

const REDIS_PORT = 6379;
const REDIS_HOST = 'ant_redis';
const REDIS_DB = 0;

const redis = new IORedis({
  db: REDIS_DB,
  host: REDIS_HOST,
  port: REDIS_PORT,
});

export { redis };
