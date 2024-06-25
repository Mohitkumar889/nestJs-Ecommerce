import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { AuthGuard } from '@nestjs/passport';
import { createResponse } from 'src/common/helpers/response.helper';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('subcategories')
@UseGuards(AuthGuard("jwt"))
export class SubcategoriesController {
  constructor(
    private readonly subcategoriesService: SubcategoriesService,
    private readonly categoriesService: CategoriesService
  ) { }

  @Post()
  async create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    let category = await this.subcategoriesService.create(createSubcategoryDto);
    category = category.data;
    console.log(category, "dkksdsdk");
    return createResponse(201, 'subCategory created successfully', category);
  }

  @Get()
  async findAll(@Query('page_no') page_no?: string,
    @Query('limit') limit?: string, @Query('search') search?: string) {
    const pageNumber = page_no ? parseInt(page_no, 10) : undefined;
    const pageLimit = limit ? parseInt(limit, 10) : undefined;
    search = search ? search : "";
    const { data, total } = await this.subcategoriesService.findAll(pageNumber, pageLimit, search);

    return createResponse(200, 'success', { subcategories: data, total });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let subcategory = await this.subcategoriesService.findOne(+id);
    subcategory = subcategory;
    console.log(subcategory, "subcategorysubcategory");
    if (!subcategory) {
      return createResponse(404, 'subcategory does not exist for given id.', {});
    }
    return createResponse(201, 'sucess', subcategory);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    let categoryId = updateSubcategoryDto.categoryId;
    let category = await this.categoriesService.findOne(+categoryId);
    category = category.data;
    if (category == null) {
      return createResponse(404, 'Category does not exist for the given ID.', {});
    }
    let subCategory = await this.subcategoriesService.update(+id, updateSubcategoryDto, category);
    subCategory = subCategory.data;
    return createResponse(201, 'subCategory updated successfully', subCategory);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let subCategory = await this.subcategoriesService.remove(+id);
    return createResponse(201, 'subCategory deleted successfully', {});
  }
}
