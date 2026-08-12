import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.label.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
