import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { createResponse } from 'src/common/helpers/response.helper';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createCartDto: CreateCartDto, user: User): Promise<any> {
    try {
      let { quantity, productId } = createCartDto;
      let product = await this.productRepository.findOne({
        select: ['id', 'name', 'price', 'unit', 'discount', 'description', 'feature', 'status', 'createdAt', 'updatedAt'],
        where: { id: productId },
        relations: ['categories', 'subCategories', 'images']
      });
      let cart = this.cartRepository.create({
        product: product,
        quantity: quantity,
        user: user
      });

      cart = await this.cartRepository.save(cart);
      return createResponse(201, 'cart created successfully', cart);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }

  }

  findAll() {
    return `This action returns all cart`;
  }

  async findOne(id: number): Promise<any> {
    try {
      const cart = await this.cartRepository.findOne({
        select: ['id', 'quantity', 'createdAt', 'updatedAt'],
        where: { id: id },
        relations: ['user', 'product', 'product.categories',
          'product.subCategories', 'product.images']
      });
      return createResponse(201, 'success', cart);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<any> {
    try {
      let cart = await this.cartRepository.findOne({
        where: { id: id },
        relations: ['user', 'product', 'product.categories',
          'product.subCategories', 'product.images'],
      });

      if (updateCartDto.quantity !== undefined) cart.quantity = updateCartDto.quantity;


      console.log(cart, "product 12345")
      await this.cartRepository.save(cart);
      cart = await this.cartRepository.findOne({
        where: { id: id },
        relations: ['user', 'product', 'product.categories',
          'product.subCategories', 'product.images'],
      });
      return createResponse(201, 'cart updated successfully', cart);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
