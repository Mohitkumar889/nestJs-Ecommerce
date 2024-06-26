import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('categories')
@UseGuards(AuthGuard("jwt"))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    let category = await this.categoriesService.create(createCategoryDto);
    category = category.data;
    console.log(category, "dkksdsdk");
    return createResponse(201, 'category created successfully', category);
  }

  @Get()
  async findAll(@Query('page_no') page_no?: string,
    @Query('limit') limit?: string, @Query('search') search?: string) {
    const pageNumber = page_no ? parseInt(page_no, 10) : undefined;
    const pageLimit = limit ? parseInt(limit, 10) : undefined;
    search = search ? search : "";

    const { data, total } = await this.categoriesService.findAll(pageNumber, pageLimit, search);

    return createResponse(200, 'success', { categories: data, total });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let category = await this.categoriesService.findOne(+id);
    category = category.data;
    if (!category) {
      return createResponse(404, 'category does not exist for given id.', {});
    }
    return createResponse(201, 'sucess', category);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    let category = await this.categoriesService.update(+id, updateCategoryDto);
    category = category.data;
    return createResponse(201, 'category updated successfully', category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
    return createResponse(201, 'category deleted successfully', {});
  }

  @Patch('/toggle/:id')
  async toggle(@Param('id') id: string) {
    let category = await this.categoriesService.findOne(+id);
    category = category.data;
    if (!category) {
      return createResponse(404, 'category does not exist for given id.', {});
    }
    let status: boolean = category.status == true ? false : true;
    category = await this.categoriesService.toggle(+id, status);
    category = category.data;
    return createResponse(201, 'category status updated successfully', {});
  }
}
