import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/productImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcategory, Category, Product, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
