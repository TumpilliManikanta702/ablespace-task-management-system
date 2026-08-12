import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async guestLogin(dto: GuestLoginDto) {
    // Find existing guest user or create a new one
    let guest = await this.prisma.user.findFirst({
      where: { email: 'guest@ablespace.io' },
    });

    if (!guest) {
      guest = await this.prisma.user.create({
        data: {
          email: 'guest@ablespace.io',
          name: dto.name || 'Guest User',
          username: `guest_${Date.now().toString().slice(-6)}`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          title: 'Full Stack Engineer',
          isGuest: true,
          theme: 'light',
          colorMode: 'blue',
        },
      });
    }

    const payload = { sub: guest.id, email: guest.email, name: guest.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: guest,
    };
  }
}
