import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CategoryFiltrationService {
  selectedCategoriesSubject = new BehaviorSubject<any>([]);
  selectedDiscountSubject = new BehaviorSubject<any>([]);
  selectedReviewSubject = new BehaviorSubject<any>([]);

  constructor() { }

  addSelectedCategory(categoryId: number) {
    const selectedCategories = this.selectedCategoriesSubject.getValue();
    selectedCategories.push(categoryId);
    this.selectedCategoriesSubject.next(selectedCategories);
  }

  removeSelectedCategory(categoryId: number) {
    const selectedCategories = this.selectedCategoriesSubject.getValue();
    const index = selectedCategories.indexOf(categoryId);
    if (index > -1) {
      selectedCategories.splice(index, 1);
      this.selectedCategoriesSubject.next(selectedCategories);
    }
  }

  addDiscountCategory(Value: number) {
    const selectedDiscounts = this.selectedDiscountSubject.getValue();
    selectedDiscounts.push(Value);
    this.selectedDiscountSubject.next(selectedDiscounts);
  }

  removeDiscountCategory(Value: number) {
    const selectedDiscounts = this.selectedDiscountSubject.getValue();
    const index = selectedDiscounts.indexOf(Value);
    if (index > -1) {
      selectedDiscounts.splice(index, 1);
      this.selectedDiscountSubject.next(selectedDiscounts);
    }
  }

  addReviewCategory(Value: number) {
    const selectReviews = this.selectedReviewSubject.getValue();    
    selectReviews.push(Value);    
    this.selectedReviewSubject.next(selectReviews);
  }

  removeReviewCategory(Value: number) {
    const selectReviews = this.selectedReviewSubject.getValue();
    const index = selectReviews.indexOf(Value);
    if (index > -1) {
      selectReviews.splice(index, 1);
      this.selectedReviewSubject.next(selectReviews);
    }
  }

  getSelectedCategories(): any[] {
    return this.selectedCategoriesSubject.getValue();
  }
  getSelectedDiscount(): any[] {
    return this.selectedDiscountSubject.getValue();
  }
  getSelectedReviews() :any[]{
    return this.selectedReviewSubject.getValue();
  }
}
