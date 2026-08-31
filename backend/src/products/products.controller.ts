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
  getRandomProduct(@Query('categoryId') categoryId: string) {
    return this.productsService.getRandomProduct(Number(categoryId));
    
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
