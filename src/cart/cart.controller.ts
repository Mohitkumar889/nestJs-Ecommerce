import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('cart')
@UseGuards(AuthGuard("jwt"))
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Request() req) {
    const user = req.user;
    let cart = await this.cartService.create(createCartDto, user);
    cart = cart.data;
    console.log(cart, "dkksdsdk1");
    return createResponse(201, 'Cart created successfully', cart);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @Request() req) {
    let cart = await this.cartService.findOne(+id);
    cart = cart.data;
    if (cart == null) {
      return createResponse(404, 'cart does not exist for the given ID.', {});
    }
    cart = await this.cartService.update(+id, updateCartDto);
    console.log(cart, "cart123")
    if (cart.data) {
      cart = cart.data;
      return createResponse(201, 'cart updated successfully', cart);
    } else {
      return createResponse(400, cart.message, "");
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
