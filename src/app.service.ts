import { HttpException, Injectable } from '@nestjs/common';
import { RedisLayerService } from './redis-layer/redis-layer.service';

@Injectable()
export class AppService {
  constructor(private readonly redisStore: RedisLayerService) {}
  /**
   * salvando nova task no redisStore
   * @param task - task a ser salva
   * @returns retorna a task salva
   */
  async createTask(task: any) {
    const { id, ttl, ...data } = task;
    //criando key única para cada task
    const key = `task:${id}`;
    // salvando task no redisStore
    await this.redisStore.client.set(key, JSON.stringify(data));
    // definindo tempo de vida da task
    await this.redisStore.client.expire(key, ttl);
    return data;
  }

  /**
   * buscando task no redisStore
   * @param id - id da task a ser buscada
   * @returns retorna a task encontrada
   */
  async getTask(id: string) {
    // cria key utilizada para buscada da task
    const key = `task:${id}`;
    // buscando task no redisStore
    const taskTTL = await this.redisStore.client.ttl(key);
    if (taskTTL === -1) return {};
    return {
      ...JSON.parse(await this.redisStore.client.get(key)),
      tempoRestante: taskTTL,
    };
  }

  /**
   * deletando task no redisStore
   * @param id - id da task a ser deletada
   * @returns retorna 1 para sucesso e 0 para falha
   */
  async deleteTask(id: number) {
    // cria key utilizada para deletar a task
    const key = `task:${id}`;
    // deletando task no redisStore
    return await this.redisStore.client.del(key);
  }

  /**
   * buscando todas as tasks no redisStore
   * @returns retorna todas as tasks
   */
  async getAllTasks() {
    // buscando todas as keys no redisStore
    const keys = await this.redisStore.client.keys('*');
    // criando array de tasks
    const result = [];
    for (const key of keys) {
      // buscando task e ttl no redisStore
      const dataPush = {
        ...JSON.parse(await this.redisStore.client.get(key)),
        tempoRestante: await this.redisStore.client.ttl(key),
      };
      result.push(dataPush);
    }
    return result;
  }
}
