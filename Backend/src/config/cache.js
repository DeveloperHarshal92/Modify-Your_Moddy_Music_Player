import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => {
  console.log('Redis connected successfully...');
});

redis.on('error', (error) => {
  console.log(error);
});

export default redis;