import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!!!');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials!!!');
    }
    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { email, token };
  }

  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.create({
      name,
      email,
      password: await bcryptjs.hash(password, 10),
    });

    return { name, email };
  }

  async profile({ email, role }: { email: string; role: string }) {
    //if (role !== 'admin') {
    //throw new UnauthorizedException('You are not allowed to access this resource');
    //}

    return await this.usersService.findOneByEmail(email);
  }

  async refreshToken(current: string): Promise<any> {
    const accessToken = current['token'];
    const user = await this.jwtService.decode(accessToken);
    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
