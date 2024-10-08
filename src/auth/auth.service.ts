import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatches = bcrypt.compareSync(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const payload = { sub: (user as any)._id, email: user.email };
    const { password: n, ...rest } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: rest,
    };
  }
}
