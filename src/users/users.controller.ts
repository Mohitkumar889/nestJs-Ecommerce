import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UsePipes, ValidationPipe, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptors';
import { JwtService } from '@nestjs/jwt';
import { createResponse } from 'src/common/helpers/response.helper';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

  ) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    let email = createUserDto.email;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    let userData = await this.usersService.create(createUserDto);
    const payload = { email: userData.data.email, userId: userData.data.id };
    const token = this.jwtService.sign(payload);
    userData = userData.data;
    console.log(userData, "dkksdsdk");
    return createResponse(201, 'User created successfully', { userData, token });
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    let email = loginUserDto.email;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      if (existingUser.password === loginUserDto.password) {
        const payload = { email: existingUser.email, userId: existingUser.id };
        const token = this.jwtService.sign(payload);
        let userData = existingUser;
        return createResponse(201, 'Login successfully', { userData, token });
      } else {
        return createResponse(400, 'Password is incorrect.', "");
      }
    } else {
      return createResponse(400, 'User not register with given email address', "");
    }
  }

  @Get('details')
  @UseGuards(AuthGuard("jwt"))
  async getUserDetails(@Request() req) {
    let user = req.user;
    return createResponse(200, 'success', user);
  }


  @Get('list')
  @UseGuards(AuthGuard("jwt"))
  async findAll(@Query('page_no') page_no?: string,
    @Query('limit') limit?: string,) {
    const pageNumber = page_no ? parseInt(page_no, 10) : undefined;
    const pageLimit = limit ? parseInt(limit, 10) : undefined;

    const { data, total } = await this.usersService.findAll(pageNumber, pageLimit);

    return createResponse(200, 'success', { users: data, total });
  }

  @Get(':id')
  @UseGuards(AuthGuard("jwt"))
  async findOne(@Param('id') id: string) {
    let user = await this.usersService.findOne(+id);
    return createResponse(200, 'success', user);
  }

  @Patch()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
