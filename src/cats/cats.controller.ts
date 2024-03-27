import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from './../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  create(@Body() createCatDto: CreateCatDto, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  findAll() {
    return this.catsService.findAll();
  }

  @Get('/my-cats')
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findMyOwn(@ActiveUser() user: UserActiveInterface) {
    return this.catsService.findMyOwn(user);
  }

  @Get(':id')
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findOne(@Param('id') id: number) {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  update(@Param('id') id: number, @Body() updateCatDto: UpdateCatDto, @ActiveUser() user: UserActiveInterface) {
    return this.catsService.update(+id, updateCatDto, user);
  }

  @Delete(':id')
  @Auth(Role.SUPERADMIN)
  remove(@Param('id') id: number) {
    return this.catsService.remove(+id);
  }
}
