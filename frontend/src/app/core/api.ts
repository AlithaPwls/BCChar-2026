import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get('/api/categories');
  }

  getRandomProduct(categoryId: number, excludeId?: number) {
    const params: Record<string, string | number> = { categoryId };
    if (excludeId !== undefined) {
      params['excludeId'] = excludeId;
    }
    return this.http.get('/api/products/random', { params });
  }

  checkAnswer(productId: number, answer: number) {
    return this.http.post('/api/products/check', { productId, answer });
  }

  createProduct(product: {
    name: string;
    productNumber: number;
    categoryId: number;
    imageUrl?: string;
  }) {
    return this.http.post('/api/products', product);
  }
}