import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisLayerService } from './redis-layer/redis-layer.service';

describe('AppController', () => {
  let appController: AppController;

  const redisLayerServiceMock = {
    client: {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      expire: jest.fn(),
      keys: jest.fn(),
      ttl: jest.fn(),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: RedisLayerService,
          useValue: redisLayerServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('createTask', () => {
    redisLayerServiceMock.client.set.mockReturnValue(true);
    redisLayerServiceMock.client.expire.mockReturnValue(true);
    it('should return the task created', async () => {
      expect(
        await appController.createTask({
          id: 2,
          titulo: 'Primeira Publicação',
          atividade: 'Criar meu primeiro post para o medium',
          ttl: 600,
        }),
      ).toEqual({
        titulo: 'Primeira Publicação',
        atividade: 'Criar meu primeiro post para o medium',
      });
    });
  });

  describe('getTask', () => {
    it('should return the task found', async () => {
      redisLayerServiceMock.client.get.mockReturnValue(
        JSON.stringify({
          titulo: 'Primeira Publicação',
          atividade: 'Criar meu primeiro post para o medium',
        }),
      );
      redisLayerServiceMock.client.ttl.mockReturnValue(600);
      expect(await appController.getTask(2)).toEqual({
        titulo: 'Primeira Publicação',
        atividade: 'Criar meu primeiro post para o medium',
        tempoRestante: 600,
      });
    });
  });

  describe('deleteTask', () => {
    it('should return 1 for success', async () => {
      redisLayerServiceMock.client.del.mockReturnValue(1);
      expect(await appController.deleteTask(2)).toBe(1);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      redisLayerServiceMock.client.keys.mockReturnValue(['task:1', 'task:2']);
      redisLayerServiceMock.client.get.mockReturnValueOnce(
        JSON.stringify({
          titulo: 'Primeira Publicação',
          atividade: 'Criar meu primeiro post para o medium',
        }),
      );
      redisLayerServiceMock.client.get.mockReturnValueOnce(
        JSON.stringify({
          titulo: 'Segunda Publicação',
          atividade: 'Criar meu segundo post para o medium',
        }),
      );
      expect(await appController.getAllTasks()).toEqual([
        {
          titulo: 'Primeira Publicação',
          atividade: 'Criar meu primeiro post para o medium',
          tempoRestante: 600,
        },
        {
          titulo: 'Segunda Publicação',
          atividade: 'Criar meu segundo post para o medium',
          tempoRestante: 600,
        },
      ]);
    });
  });
});
