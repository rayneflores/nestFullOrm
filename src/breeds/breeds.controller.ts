import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from './../common/enums/rol.enum';

@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  create(@Body() createBreedDto: CreateBreedDto) {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findOne(@Param('id') id: number) {
    return this.breedsService.findOne(+id);
  }

  @Patch(':id')
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  update(@Param('id') id: number, @Body() updateBreedDto: UpdateBreedDto) {
    return this.breedsService.update(+id, updateBreedDto);
  }

  @Delete(':id')
  @Auth(Role.SUPERADMIN)
  remove(@Param('id') id: number) {
    return this.breedsService.remove(+id);
  }
}
