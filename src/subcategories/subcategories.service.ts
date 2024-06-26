import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createResponse } from 'src/common/helpers/response.helper';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory) private readonly subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {

  }
  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<any> {
    try {
      const { categoryId, name, image } = createSubcategoryDto;

      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        return createResponse(404, 'Category does not exist for the given ID.', {});
      }

      const subcategory = this.subCategoryRepository.create({
        name: name,
        image: image,
        category: category,
      });
      console.log(subcategory, "subcategory");
      const savedSubCategory = await this.subCategoryRepository.save(subcategory);
      return createResponse(201, 'subCategory created successfully', savedSubCategory);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async findAll(page_no?: number, limit?: number, search?: string): Promise<any> {
    const queryBuilder = this.subCategoryRepository.createQueryBuilder('Subcategory').leftJoinAndSelect('Subcategory.category', 'category').select(['Subcategory.id', 'Subcategory.name', 'Subcategory.image', 'Subcategory.status', 'Subcategory.createdAt', 'Subcategory.updatedAt', 'category.id', 'category.name', 'category.status']).where("Subcategory.status = :status", { status: true });

    if (search) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('Subcategory.name LIKE :search', { search: `%${search}%` })
            .orWhere('category.name LIKE :search', { search: `%${search}%` });
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
      const subCategoryDetail = await this.subCategoryRepository.findOne({
        select: ['id', 'name', 'image', 'status', 'createdAt', 'updatedAt'],
        where: { id: id },
        relations: ['category']
      });
      return createResponse(201, 'success', subCategoryDetail);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto, category: Category): Promise<any> {
    try {
      console.log(category, "categorycategorycategorycategory")
      const { name, image } = updateSubcategoryDto;
      const subcategory = this.subCategoryRepository.create({
        name: name,
        image: image,
        category: category,
        id: id
      });
      await this.subCategoryRepository.save(subcategory);
      const savedSubCategory = await this.subCategoryRepository.findOne({
        select: ['id', 'name', 'image', 'status', 'createdAt', 'updatedAt'],
        where: { id: id },
        relations: ['category'],
      });
      return createResponse(201, 'subCategory Update successfully', savedSubCategory);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  remove(id: number) {
    try {
      return this.subCategoryRepository.delete(id);

    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }

  async toggle(id: number, status: boolean): Promise<any> {
    try {
      let subCategory: Subcategory = new Subcategory();
      subCategory.status = status;
      subCategory.id = id;
      await this.subCategoryRepository.save(subCategory);
      const updateSubCategory = await this.subCategoryRepository.findOne({
        select: ['id', 'name', 'image', 'status', 'createdAt', 'updatedAt'],
        where: { id: id }
      });
      return createResponse(201, 'subCategory status updated successfully', updateSubCategory);
    } catch (error) {
      return createResponse(error.code, error.message, "");
    }
  }
}
