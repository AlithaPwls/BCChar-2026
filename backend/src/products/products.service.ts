import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany();
  }

  async create(data: {
    name: string;
    productNumber: number;
    categoryId: number;
    imageUrl?: string;
  }) {
    const name = data.name?.trim();
    const productNumber = Number(data.productNumber);
    const categoryId = Number(data.categoryId);

    if (!name) {
      throw new BadRequestException('name is required');
    }
    if (!Number.isInteger(productNumber)) {
      throw new BadRequestException('productNumber must be an integer');
    }
    if (!Number.isInteger(categoryId)) {
      throw new BadRequestException('categoryId must be an integer');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }

    const imageUrl = data.imageUrl?.trim();

    return this.prisma.product.create({
      data: {
        name,
        productNumber,
        categoryId,
        imageUrl: imageUrl ? imageUrl : null,
      },
    });
  }

  async getRandomProduct(categoryId: number, excludeId?: number) {
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

    const pool =
      excludeId !== undefined && products.length > 1
        ? products.filter((product) => product.id !== excludeId)
        : products;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const randomProduct = pool[randomIndex];

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
      correctNumber: product.productNumber,
    };
  }
}
