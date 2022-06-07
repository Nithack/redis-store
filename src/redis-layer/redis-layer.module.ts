import { CacheModule, Module } from '@nestjs/common';
import { RedisLayerService } from './redis-layer.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: [RedisLayerService],
  exports: [RedisLayerService],
})
export class RedisLayerModule {}
