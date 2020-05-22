import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: { id: number; label: string }[] = [
    {
      id: 1,
      label: 'Livres et manuels'
    },
    {
      id: 2,
      label: 'Mathématiques'
    }
  ];

  constructor() {}

  getCategoryById(id: number) {
    return this.categories.find(category => category.id === id);
  }
}
