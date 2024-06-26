import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard("jwt"))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    let product = await this.productsService.create(createProductDto);
    product = product.data;
    console.log(product, "dkksdsdk1");
    return createResponse(201, 'Product created successfully', product);
  }

  @Get()
  async findAll(@Query('page_no') page_no?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string) {
    const pageNumber = page_no ? parseInt(page_no, 10) : undefined;
    const pageLimit = limit ? parseInt(limit, 10) : undefined;
    search = search ? search : "";
    let { data, total } = await this.productsService.findAll(pageNumber, pageLimit, search);
    data = data.map(product => {
      const priceAfterDiscount = product.price - (product.price * (product.discount / 100));
      return { ...product, priceAfterDiscount };
    });
    return createResponse(200, 'success', { products: data, total });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let product = await this.productsService.findOne(+id);
    product = product.data;
    console.log(product, "productproduct");
    if (!product) {
      return createResponse(404, 'product does not exist for given id.', {});
    }
    return createResponse(201, 'sucess', product);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    let product = await this.productsService.findOne(+id);
    product = product.data;
    if (product == null) {
      return createResponse(404, 'Product does not exist for the given ID.', {});
    }
    product = await this.productsService.update(+id, updateProductDto);
    console.log(product, "product123")
    if (product.data) {
      product = product.data;
      return createResponse(201, 'product updated successfully', product);
    } else {
      return createResponse(400, product.message, "");
    }

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let product = await this.productsService.findOne(+id);
    product = product.data;
    if (product == null) {
      return createResponse(404, 'Product does not exist for the given ID.', {});
    }
    await this.productsService.remove(+id);
    return createResponse(201, 'product deleted successfully', {});
  }

  @Patch('/toggle/:id')
  async toggle(@Param('id') id: string) {
    let productNew = await this.productsService.findOne(+id);
    let product = productNew.data;
    if (!product) {
      return createResponse(404, 'product does not exist for given id.', {});
    }

    let status: boolean = product.status == true ? false : true;
    await this.productsService.toggle(+id, status);
    return createResponse(201, 'product status updated successfully', {});
  }
}
