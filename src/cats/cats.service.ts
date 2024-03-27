import { BadRequestException, HttpCode, HttpStatus, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const breed = await this.validateBreed(createCatDto.breed);
    return await this.catRepository.save({
      ...createCatDto,
      breed: breed,
      userEmail: user.email,
    });
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findMyOwn(user: UserActiveInterface) {
    if (user.role == Role.ADMIN || user.role == Role.SUPERADMIN) {
      return await this.catRepository.find();
    }
    return await this.catRepository.find({ where: { userEmail: user.email } });
  }

  async findOne(id: number) {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new NotFoundException('Sorry, cat not found!!!');
    }
    return cat;

    /*
    return {
      name: cat.name,
      breedName: cat.breed.name
    }
    */
  }

  async update(
    id: number,
    updateCatDto: UpdateCatDto,
    user: UserActiveInterface,
  ) {
    await this.findOne(id);
    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed
        ? await this.validateBreed(updateCatDto.breed)
        : undefined,
      userEmail: user.email,
    });
  }

  async remove(id: number) {
    return await this.catRepository.softDelete(id);
  }

  private async validateBreed(breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({ name: breed });
    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }
    return breedEntity;
  }
}
