import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('random')
  getRandomProduct(
    @Query('categoryId') categoryId: string,
    @Query('excludeId') excludeId?: string,
  ) {
    return this.productsService.getRandomProduct(
      Number(categoryId),
      excludeId ? Number(excludeId) : undefined,
    );
  }

  @Post()
  create(
    @Body('name') name: string,
    @Body('productNumber') productNumber: number,
    @Body('categoryId') categoryId: number,
    @Body('imageUrl') imageUrl?: string,
  ) {
    return this.productsService.create({
      name,
      productNumber,
      categoryId,
      imageUrl,
    });
  }

  @Post('check')
  checkAnswer (
    @Body('productId')productId: number,
    @Body('answer')answer: number,
  )
  {
    return this.productsService.checkAnswer(productId, answer);
  }

}
