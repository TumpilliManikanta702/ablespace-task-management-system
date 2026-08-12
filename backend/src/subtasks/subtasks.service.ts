import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubtaskDto) {
    const { dueDate, ...data } = dto;
    return this.prisma.subtask.create({
      data: {
        ...data,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateSubtaskDto) {
    const subtask = await this.prisma.subtask.findUnique({ where: { id } });
    if (!subtask) {
      throw new NotFoundException(`Subtask ${id} not found`);
    }

    const { dueDate, ...data } = dto;

    return this.prisma.subtask.update({
      where: { id },
      data: {
        ...data,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async remove(id: string) {
    const subtask = await this.prisma.subtask.findUnique({ where: { id } });
    if (!subtask) {
      throw new NotFoundException(`Subtask ${id} not found`);
    }

    return this.prisma.subtask.delete({
      where: { id },
    });
  }
}
