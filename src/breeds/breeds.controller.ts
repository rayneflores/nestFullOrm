import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from './../common/enums/rol.enum';
import { ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath, } from '@nestjs/swagger';
import { Breed } from './entities/breed.entity';

@ApiTags('Breeds')
@ApiBearerAuth()
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Breed Created Successfully!!!' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Create a new Breed' })
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  create(@Body() createBreedDto: CreateBreedDto) {
    return this.breedsService.create(createBreedDto);
  }

  @Get()
  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(Breed) } },
  })
  @ApiOperation({ description: 'Find All Breeds' })
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Breed) } })
  @ApiOperation({ description: 'Find Breed By Id' })
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findOne(@Param('id') id: number) {
    return this.breedsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Breed) } })
  @ApiOperation({ description: 'Update Breed By Id' })
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  update(@Param('id') id: number, @Body() updateBreedDto: UpdateBreedDto) {
    return this.breedsService.update(+id, updateBreedDto);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Breed) } })
  @ApiOperation({ description: 'Delete Breed By Id' })
  @Auth(Role.SUPERADMIN)
  remove(@Param('id') id: number) {
    return this.breedsService.remove(+id);
  }
}
