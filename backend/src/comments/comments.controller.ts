import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findByTask(@Query('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Post()
  async create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }
}
