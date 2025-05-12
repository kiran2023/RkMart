import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsDataService } from 'src/app/user/productsData.service';
import { CategoryFiltrationService } from '../categoryFiltration.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: string | null = "";
  currentCategory: string | null | undefined;

  categoryTypes: any = [];
  categoryDisplay: any = "";
  
  offerApply:any;

  constructor(private route: ActivatedRoute, private productService: ProductsDataService, private filterService: CategoryFiltrationService) {
    // this.categoryTypesData();
    this.offerApply = sessionStorage.getItem('offerApply');
  }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('category')) {
      this.category = this.route.snapshot.paramMap.get('category');
      this.currentCategory = this.route.snapshot.paramMap.get('category');
    }

    this.productService.getCategory().subscribe((data) => {
      this.categoryDisplay = data;      

      this.categoryDisplay.forEach((categoryType:any)=>{
        this.categoryTypes.push(categoryType.categoryType);
      })
    });

    // this.categoryTypesData();
  }

  // categoryTypesData() {
  //   this.productService.getCategoryTypes().subscribe((categoryType: any) => {
  //     categoryType.forEach((data: any) => {
  //       this.categoryTypes.push(data.categoryTypeData);
  //     })
  //   })
  // }

  categorySelected(checkedData: any, id: any) {
    const checkedStatus = (checkedData.target as HTMLInputElement)?.checked
    if (checkedStatus) {
      this.filterService.addSelectedCategory(id);
      checkedData.target.checked = true;
    }
    else {
      this.filterService.removeSelectedCategory(id);
      checkedData.target.checked = false;
    }
  }

  discountData(data: any) {
    const id = data.target.value;
    const checkedStatus = (data.target as HTMLInputElement)?.checked;
    if (checkedStatus) {
      this.filterService.addDiscountCategory(id);
    } else {
      this.filterService.removeDiscountCategory(id);
    }
  }

  reviewData(reviewRating: any) {
    const rating = reviewRating.target.value;    

    const checkedStatus = (reviewRating.target as HTMLInputElement)?.checked;
    if (checkedStatus) {
      this.filterService.addReviewCategory(rating);
    } else {
      this.filterService.removeReviewCategory(rating);
    }
  }

  toggleCategory(){
    let menu = document.querySelector('.bevergeSection');

    menu?.classList.toggle('menuActive');
  }
}
