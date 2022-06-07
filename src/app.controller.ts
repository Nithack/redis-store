import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // cria uma nova task
  @Post()
  async createTask(@Body() task: any) {
    return await this.appService.createTask(task);
  }

  // busca uma task pelo id
  @Get(':id')
  async getTask(@Param() params: any) {
    const { id } = params;
    return await this.appService.getTask(id);
  }

  // deleta uma task pelo id
  @Delete(':id')
  async deleteTask(@Param() params: any) {
    const { id } = params;
    return await this.appService.deleteTask(id);
  }

  // busca todas as tasks
  @Get()
  async getAllTasks() {
    return await this.appService.getAllTasks();
  }
}
