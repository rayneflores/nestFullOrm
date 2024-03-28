import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
  user: { email: string; role: string };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: 'Login' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ description: 'Register new User' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /*@Get('profile')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  profile(@Req() req: RequestWithUser) {
    return this.authService.profile(req.user);
  }*/

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Show Own User Profile' })
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user);
  }
}
