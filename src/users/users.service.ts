import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {

  }
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      let user: User = new User();
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.age = createUserDto.age;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      const savedUser = await this.userRepository.save(user);
      return createResponse(201, 'User created successfully', savedUser);
    } catch (error) {
      return createResponse(error.code, error.message, "");
      // if (error.code === '23505') {
      //   throw new BadRequestException('User with this email already exists');
      // }
      // throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(page_no?: number, limit?: number): Promise<{ data: User[], total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user').select(['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.age', 'user.address', 'user.createdAt']);

    if (page_no && limit) {
      const offset = (page_no - 1) * limit;
      queryBuilder.skip(offset).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email', 'age', 'address', 'createdAt'],
      where: { id: id }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    let user: User = new User();
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.age = updateUserDto.age;
    user.id = id;
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email', 'age', 'address', 'createdAt'],
      where: { email: email }
    });
  }
}
