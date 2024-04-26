import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' }) //Con este nombre se mandará a llamar el microservicio
  // Se toma del @Payload la información y soporta validación de igual manera
  async create(@Payload() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  async findAll(@Payload() PaginationDto: PaginationDto) {
    return await this.productsService.findAll(PaginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    // En este caso se espera: un payload como: {id:15}
    return await this.productsService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(
    // @Param('id') id: string,
    // @Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(
    // @Param('id') id: string
    @Payload('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.remove(+id);
  }
}
