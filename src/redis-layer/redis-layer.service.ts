import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as IORedis from 'ioredis';

@Injectable()
export class RedisLayerService {
  // ejeta a dependência do cache-manager
  constructor(@Inject(CACHE_MANAGER) private cacheManager: any) {}
  // define o cliente redis
  // adicionando o type para ter acesso a todos os métodos do cliente redis
  client: IORedis.Redis = this.cacheManager.store.getClient();
}
