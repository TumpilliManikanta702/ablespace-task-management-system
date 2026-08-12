import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly taskInclude = {
    project: true,
    reporter: {
      select: { id: true, name: true, avatar: true, email: true, title: true, username: true },
    },
    members: {
      include: {
        user: {
          select: { id: true, name: true, avatar: true, email: true, title: true, username: true },
        },
      },
    },
    labels: {
      include: {
        label: true,
      },
    },
    subtasks: {
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' as const },
    },
    comments: {
      include: {
        author: {
          select: { id: true, name: true, avatar: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' as const },
    },
  };

  async findAll(filters?: FilterTaskDto) {
    const where: Prisma.TaskWhereInput = {};

    if (filters) {
      const { search, status, priority, memberId, labelId, projectId, team } = filters;

      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (projectId) where.projectId = projectId;
      if (team) where.team = team;

      if (memberId) {
        where.members = {
          some: { userId: memberId },
        };
      }

      if (labelId) {
        where.labels = {
          some: { labelId },
        };
      }

      if (search && search.trim() !== '') {
        const query = search.trim();
        where.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
          { team: { contains: query } },
        ];
      }
    }

    return this.prisma.task.findMany({
      where,
      include: this.taskInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.taskInclude,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(dto: CreateTaskDto) {
    const { memberIds, labelIds, dueDate, ...taskData } = dto;

    return this.prisma.task.create({
      data: {
        ...taskData,
        dueDate: dueDate ? new Date(dueDate) : null,
        members: memberIds && memberIds.length > 0
          ? {
              create: memberIds.map((userId) => ({ userId })),
            }
          : undefined,
        labels: labelIds && labelIds.length > 0
          ? {
              create: labelIds.map((labelId) => ({ labelId })),
            }
          : undefined,
      },
      include: this.taskInclude,
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    const { memberIds, labelIds, dueDate, ...taskData } = dto;

    // Handle members update if provided
    if (memberIds !== undefined) {
      await this.prisma.taskMember.deleteMany({ where: { taskId: id } });
      if (memberIds.length > 0) {
        await this.prisma.taskMember.createMany({
          data: memberIds.map((userId) => ({ taskId: id, userId })),
        });
      }
    }

    // Handle labels update if provided
    if (labelIds !== undefined) {
      await this.prisma.taskLabel.deleteMany({ where: { taskId: id } });
      if (labelIds.length > 0) {
        await this.prisma.taskLabel.createMany({
          data: labelIds.map((labelId) => ({ taskId: id, labelId })),
        });
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
      },
      include: this.taskInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
