import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private readonly projectInclude = {
    lead: {
      select: { id: true, name: true, avatar: true, email: true, title: true },
    },
    tasks: {
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        labels: {
          include: { label: true },
        },
      },
    },
  };

  async findAll() {
    return this.prisma.project.findMany({
      include: this.projectInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: this.projectInclude,
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  async create(dto: CreateProjectDto) {
    const { dueDate, ...data } = dto;
    return this.prisma.project.create({
      data: {
        ...data,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: this.projectInclude,
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    const { dueDate, ...data } = dto;
    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
      },
      include: this.projectInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
