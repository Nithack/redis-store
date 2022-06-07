import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisLayerModule } from './redis-layer/redis-layer.module';

@Module({
  imports: [RedisLayerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
