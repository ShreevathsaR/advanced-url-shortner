const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://redis:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect()
  .then(() => {
    console.log('Connected to Redis');
  })
  .catch((err) => {
    console.error('Error connecting to Redis:', err);
  });

module.exports = redisClient;
