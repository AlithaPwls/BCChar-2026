import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-quiz',
  imports: [FormsModule],
  templateUrl: './quiz.html',
})
export class Quiz implements OnInit {
  private api = inject(ApiService);

  categories = signal<{ id: number; name: string }[]>([]);
  categoryId = signal<number | null>(null);
  product = signal<{ id: number; name: string } | null>(null);
  answer: number | null = null;
  result = signal<{
    isCorrect: boolean;
    message: string;
    correctNumber?: number;
  } | null>(null);

  ngOnInit() {
    this.api.getCategories().subscribe((data) => {
      this.categories.set(data as { id: number; name: string }[]);
    });
  }

  selectCategory(categoryId: number) {
    this.categoryId.set(categoryId);
    this.loadNextProduct();
  }

  loadNextProduct() {
    const categoryId = this.categoryId();
    if (categoryId === null) {
      return;
    }

    this.answer = null;
    this.result.set(null);

    this.api.getRandomProduct(categoryId).subscribe((data) => {
      this.product.set(data as { id: number; name: string });
    });
  }

  submitAnswer() {
    const product = this.product();
    if (!product || this.answer === null) {
      return;
    }

    this.api.checkAnswer(product.id, this.answer).subscribe((data) => {
      this.result.set(
        data as {
          isCorrect: boolean;
          message: string;
          correctNumber?: number;
        },
      );
    });
  }

  chooseOtherCategory() {
    this.categoryId.set(null);
    this.product.set(null);
    this.answer = null;
    this.result.set(null);
  }
}
