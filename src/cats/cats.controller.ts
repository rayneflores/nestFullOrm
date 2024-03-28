import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from './../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Cat } from './entities/cat.entity';

@ApiTags('Cats')
@ApiBearerAuth()
@Controller('cats')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Cat Created Successfully!!!' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ description: 'Create a new Cat' })
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  create(
    @Body() createCatDto: CreateCatDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.catsService.create(createCatDto, user);
  }

  @Get()
  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(Cat) } },
  })
  @ApiOperation({ description: 'Find All Cats' })
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  findAll() {
    return this.catsService.findAll();
  }

  @Get('/my-cats')
  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(Cat) } },
  })
  @ApiOperation({ description: 'Find My Cats' })
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findMyOwn(@ActiveUser() user: UserActiveInterface) {
    return this.catsService.findMyOwn(user);
  }

  @Get(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Cat) } })
  @ApiOperation({ description: 'Find Cat By Id' })
  @Auth([Role.USER, Role.ADMIN, Role.SUPERADMIN])
  findOne(@Param('id') id: number) {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Cat) } })
  @ApiOperation({ description: 'Update Cat By Id' })
  @Auth([Role.ADMIN, Role.SUPERADMIN])
  update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.catsService.update(+id, updateCatDto, user);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Cat) } })
  @ApiOperation({ description: 'Delete Cat By Id' })
  @Auth(Role.SUPERADMIN)
  remove(@Param('id') id: number) {
    return this.catsService.remove(+id);
  }
}
