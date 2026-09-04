import { Component, computed, ElementRef, inject, Injector, OnInit, afterNextRender, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-quiz',
  imports: [FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  private api = inject(ApiService);
  private injector = inject(Injector);
  private answerInput = viewChild<ElementRef<HTMLInputElement>>('answerInput');

  categories = signal<{ id: number; name: string }[]>([]);
  categoryId = signal<number | null>(null);
  product = signal<{ id: number; name: string } | null>(null);
  answer: number | null = null;
  result = signal<{
    isCorrect: boolean;
    message: string;
    correctNumber?: number;
  } | null>(null);

  selectedCategoryName = computed(() => {
    const id = this.categoryId();
    if (id === null) {
      return null;
    }
    return this.categories().find((category) => category.id === id)?.name ?? null;
  });

  /** Bumps on each product load so the enter animation can re-run. */
  productAnimKey = signal(0);

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

    this.api
      .getRandomProduct(categoryId, this.product()?.id)
      .subscribe((data) => {
      this.product.set(data as { id: number; name: string });
      this.productAnimKey.update((key) => key + 1);
      this.focusAnswerInput();
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

  onEnter() {
    if (this.result()) {
      this.loadNextProduct();
      return;
    }
    this.submitAnswer();
  }

  chooseOtherCategory() {
    this.categoryId.set(null);
    this.product.set(null);
    this.answer = null;
    this.result.set(null);
  }

  private focusAnswerInput() {
    afterNextRender(
      () => this.answerInput()?.nativeElement.focus(),
      { injector: this.injector },
    );
  }
}
