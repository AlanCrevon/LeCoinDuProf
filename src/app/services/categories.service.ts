import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: { id: number; label: string }[] = [
    {
      id: 1,
      label: 'Livres de jeunesse'
    },
    {
      id: 2,
      label: 'Manuels et guides pédagogiques'
    },
    {
      id: 3,
      label: 'Manipulation'
    },
    {
      id: 4,
      label: 'Papéterie'
    },
    {
      id: 5,
      label: 'Jeux'
    },
    {
      id: 6,
      label: 'Arts'
    },
    {
      id: 7,
      label: 'Sciences'
    },
    {
      id: 8,
      label: 'Arts'
    },
    {
      id: 9,
      label: 'Sciences'
    },
    {
      id: 10,
      label: 'Sports'
    },
    {
      id: 11,
      label: 'Informatique'
    },
    {
      id: 12,
      label: 'Meubles et rangements'
    },
    {
      id: 13,
      label: `Jeux d'extérieur`
    },
    {
      id: 14,
      label: 'Manuels et guides pédagogiques'
    }
  ];

  constructor() {}

  getCategoryById(id: number) {
    return this.categories.find(category => category.id === id);
  }
}
