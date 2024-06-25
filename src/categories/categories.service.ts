import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { createResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {


  }
  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    try {
      let category: Category = new Category();
      category.name = createCategoryDto.name;
      category.image = createCategoryDto.image;

      const savedCategory = await this.categoryRepository.save(category);
      return createResponse(201, 'category created successfully', savedCategory);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async findAll(page_no?: number, limit?: number, search?: string): Promise<any> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category').leftJoinAndSelect('category.subcategories', 'subCategory').select(['category.id', 'category.name', 'category.status', 'category.createdAt', 'category.updatedAt', 'subCategory.id',
      'subCategory.name',
      'subCategory.status']).where("category.status = :status", { status: true });

    if (search) {
      queryBuilder.where('category.name LIKE :search', { search: `%${search}%` });
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
      const categoryDetail = await this.categoryRepository.findOne({
        select: ['id', 'name', 'image', 'status', 'createdAt', 'updatedAt'],
        where: { id: id },
        relations: ['subcategories']
      });
      return createResponse(201, 'success', categoryDetail);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<any> {
    try {
      let category: Category = new Category();
      category.name = updateCategoryDto.name;
      category.image = updateCategoryDto.image;
      category.id = id;
      await this.categoryRepository.save(category);
      const updateCategory = await this.categoryRepository.findOne({
        select: ['id', 'name', 'image', 'status', 'createdAt', 'updatedAt'],
        where: { id: id }
      });
      return createResponse(201, 'category created successfully', updateCategory);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  remove(id: number) {
    try {
      return this.categoryRepository.delete(id);

    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }


  async toggle(id: number, status: boolean): Promise<any> {
    try {
      let category: Category = new Category();
      category.status = status;
      category.id = id;
      await this.categoryRepository.save(category);
      const updateCategory = await this.categoryRepository.findOne({
        select: ['id', 'name', 'image', 'status', 'createdAt', 'updatedAt'],
        where: { id: id }
      });
      return createResponse(201, 'category status updated successfully', updateCategory);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

}
