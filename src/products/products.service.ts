import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { Brackets, In, Repository } from 'typeorm';
import { ProductImage } from './entities/productImage.entity';
import { createResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) { }
  async create(createProductDto: CreateProductDto): Promise<any> {
    try {
      const { categories, subCategories, images, ...productData } = createProductDto;

      const categoryEntities = await this.categoryRepository.findBy({
        id: In(categories.map(category => category.id)),
      });

      const subCategoryEntities = await this.subCategoryRepository.findBy({
        id: In(subCategories.map(subCategory => subCategory.id)),
      });
      console.log(subCategoryEntities, "subCategoryEntities");
      // const imageEntities = images.map(img => this.productImageRepository.create(img));
      const imageEntities = images.map(image => {
        const newImage = new ProductImage();
        newImage.url = image.url;
        return newImage;
      });

      let product = this.productRepository.create({
        ...productData,
        categories: categoryEntities,
        subCategories: subCategoryEntities,
        images: imageEntities,
      });

      product = await this.productRepository.save(product);
      return createResponse(201, 'Product created successfully', product);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async findAll(page_no?: number, limit?: number, search?: string): Promise<any> {
    const queryBuilder = this.productRepository.createQueryBuilder('Product')
      .leftJoinAndSelect('Product.categories', 'productCategory')
      .leftJoinAndSelect('Product.subCategories', 'productSubCategories')
      .leftJoinAndSelect('Product.images', 'productImages')
      .select(['Product.id', 'Product.name', 'Product.status', 'Product.price', 'Product.unit', 'Product.discount', 'Product.description', 'Product.feature', 'Product.createdAt', 'Product.updatedAt', 'productCategory.id', 'productCategory.name', 'productCategory.status', 'productSubCategories.id', 'productSubCategories.name', 'productSubCategories.status', 'productImages.url']).where("Product.status = :status", { status: true });

    if (search) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('Product.name LIKE :search', { search: `%${search}%` })
            .orWhere('productCategory.name LIKE :search', { search: `%${search}%` })
            .orWhere('productSubCategories.name LIKE :search', { search: `%${search}%` });
        })
      );
    }
    if (page_no && limit) {
      const offset = (page_no - 1) * limit;
      queryBuilder.skip(offset).take(limit);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<any> {
    try {
      const productDetail = await this.productRepository.findOne({
        select: ['id', 'name', 'price', 'unit', 'discount', 'description', 'feature', 'status', 'createdAt', 'updatedAt'],
        where: { id: id },
        relations: ['categories', 'subCategories', 'images']
      });
      return createResponse(201, 'success', productDetail);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    try {
      let product = await this.productRepository.findOne({
        where: { id: id },
        relations: ['images'],
      });

      if (updateProductDto.name !== undefined) product.name = updateProductDto.name;
      if (updateProductDto.price !== undefined) product.price = updateProductDto.price;
      if (updateProductDto.unit !== undefined) product.unit = updateProductDto.unit;
      if (updateProductDto.discount !== undefined) product.discount = updateProductDto.discount;
      if (updateProductDto.description !== undefined) product.description = updateProductDto.description;
      if (updateProductDto.feature !== undefined) product.feature = updateProductDto.feature;

      if (updateProductDto.categories && updateProductDto.categories.length > 0) {
        const categories = await this.categoryRepository.findBy({
          id: In(updateProductDto.categories.map(category => category.id)),
        });
        product.categories = categories;
      }

      if (updateProductDto.subCategories && updateProductDto.subCategories.length > 0) {
        const subCategories = await this.subCategoryRepository.findBy({
          id: In(updateProductDto.subCategories.map(subCategory => subCategory.id)),
        });
        product.subCategories = subCategories;
      }

      if (updateProductDto.images && updateProductDto.images.length > 0) {
        await this.productImageRepository.delete({ product: { id } });
        const images = updateProductDto.images.map(img => {
          const image = new ProductImage();
          image.url = img.url;
          image.product = product;
          return image;
        });
        product.images = images;
      }
      console.log(product, "product 12345")
      await this.productRepository.save(product);
      product = await this.productRepository.findOne({
        where: { id: id },
        relations: ['categories', 'subCategories', 'images'],
      });
      return createResponse(201, 'product updated successfully', product);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async remove(id: number) {
    try {
      return this.productRepository.delete(id);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async toggle(id: number, status: boolean): Promise<any> {
    try {
      let product: Product = new Product();
      product.status = status;
      product.id = id;
      await this.productRepository.save(product);
      const updateProduct = await this.productRepository.findOne({
        where: { id: id },
        relations: ['categories', 'subCategories', 'images'],
      });
      return createResponse(201, 'product status updated successfully', updateProduct);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }
}
