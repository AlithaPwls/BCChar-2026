import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get('/api/categories');
  }

  getRandomProduct(categoryId: number) {
    return this.http.get('/api/products/random', {
      params: { categoryId },
    });
  }

  checkAnswer(productId: number, answer: number) {
    return this.http.post('/api/products/check', { productId, answer });
  }
}