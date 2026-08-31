import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany();
  }

  async getRandomProduct(categoryId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
      },
    });

    if (products.length === 0) {
      throw new NotFoundException(
        `No products found for category ${categoryId}`,
      );
    }

    const randomIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomIndex];

    return {
      id: randomProduct.id,
      name: randomProduct.name,
    };
  }

  async checkAnswer(productId: number, answer: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    if (product.productNumber === answer) {
      return {
        isCorrect: true,
        message: 'Correct answer',
      };
    }

    return {
      isCorrect: false,
      message: 'Incorrect answer',
    };
  }
}
