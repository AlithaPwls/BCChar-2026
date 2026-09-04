import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private api = inject(ApiService);

  categories = signal<{ id: number; name: string }[]>([]);
  name = '';
  productNumber: number | null = null;
  categoryId: number | null = null;
  imageUrl = '';
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit() {
    this.api.getCategories().subscribe((data) => {
      this.categories.set(data as { id: number; name: string }[]);
    });
  }

  save() {
    this.message.set(null);
    this.error.set(null);

    if (!this.name.trim() || this.productNumber === null || this.categoryId === null) {
      this.error.set('Naam, nummer en categorie zijn verplicht.');
      return;
    }

    this.api
      .createProduct({
        name: this.name.trim(),
        productNumber: this.productNumber,
        categoryId: this.categoryId,
        imageUrl: this.imageUrl.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.message.set('Product toegevoegd.');
          this.name = '';
          this.productNumber = null;
          this.imageUrl = '';
        },
        error: () => {
          this.error.set('Opslaan mislukt. Controleer de velden en de backend.');
        },
      });
  }
}
