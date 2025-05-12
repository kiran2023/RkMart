import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/user/cart.service';

import { ProductsDataService } from 'src/app/user/productsData.service';
import { CategoryFiltrationService } from '../categoryFiltration.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  isScrollActive = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrollActive = window.pageYOffset > 100;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  filteredProducts: any = [];
  private selectedCategory: Subscription | undefined;
  private selectedDiscount: Subscription | undefined;
  private selectedReview:Subscription|undefined;

  public myMath = Math;

  productDataFound: any;

  productsData: any = [];
  requiredProduct: string | null | undefined = "";
  searchData: string = "";
  productFound: boolean = true;
  updatedProducts: any = [];
  allProducts: any = [];

  searchProductAvailabilitiy:boolean|undefined;

  categoryData: string | undefined | null;

  offerApply:any;
  

  constructor(private data: ProductsDataService, private cartService: CartService, private titleService: Title, private activeRoute: ActivatedRoute, private filtration: CategoryFiltrationService) {
    this.activeRoute.paramMap.subscribe((urlData) => {
      this.categoryData = urlData.get('category');
    });

    if (this.categoryData) {
      this.data.getProducts().subscribe((productData: any) => {
        this.activeRoute.paramMap.subscribe((urlData: ParamMap) => {

          this.productsData = productData;
          this.requiredProduct = urlData.get('category');
          this.titleService.setTitle(`${this.requiredProduct?.charAt(0)?.toUpperCase()}${this.requiredProduct?.slice(1)}  | RK MART`);

          this.updatedProducts = this.productsData.filter((product: any) => product.category == this.requiredProduct);
          this.allProducts = this.productsData.filter((product: any) => product.category == this.requiredProduct);
        });
      });
    } else {
      this.data.getProducts().subscribe((productData: any) => {
        this.updatedProducts = productData;
        this.allProducts = productData
      });
    }
  }

  ngOnInit() {
    
    this.offerApply = sessionStorage.getItem("offerApply");
    this.titleService.setTitle('Products | RK MART');

    this.selectedCategory = this.filtration.selectedCategoriesSubject.subscribe(() => {
      this.filterProduct();
    });

    this.selectedDiscount = this.filtration.selectedDiscountSubject.subscribe(() => {
      this.filterProduct();
    })

    this.selectedReview = this.filtration.selectedReviewSubject.subscribe(()=>{
      this.filterProduct();
    })
  }

  filterProduct() {    
    let categoryData = this.filtration.getSelectedCategories();
    let discountData = this.filtration.getSelectedDiscount();
    let reviewData = this.filtration.getSelectedReviews();

    if (categoryData.length != 0 || discountData.length != 0 || reviewData.length != 0) {

      this.updatedProducts = [];
      this.allProducts.filter((product: any) => {
        if (categoryData.length != 0 && discountData.length == 0 && reviewData.length == 0) {
          if (categoryData.includes(product.filterValue)) {
            this.updatedProducts.push(product);
          }
        }

        if ((categoryData.length != 0 || categoryData.length == 0) && discountData.length != 0 || reviewData.length!=0) {
          let minimumValue = discountData.length!=0? Math.min(...discountData):0;
          let minimumReview = reviewData.length!=0? Math.min(...reviewData):0;          
          
          if (categoryData.includes(product.filterValue) && product.value >= minimumValue && product.ratingAverage>=minimumReview) {
            this.updatedProducts.push(product);
          } else if (categoryData.length == 0 && product.value >= minimumValue && product.ratingAverage>=minimumReview) {
            this.updatedProducts.push(product);
          }
        }
      });
    } else {
      this.updatedProducts = this.allProducts
    }
  }

  searchProduct(){
    this.searchProductAvailabilitiy = this.updatedProducts.some((product:any) => product.title.toLowerCase().includes(this.searchData));
  }

  addtoCartData(productAddtoCart: any, productID: any) {
    if (this.data.userLogin) {
      this.cartService.addToCart(productAddtoCart);
    } else {
      alert("Login to add product to Cart");
    }
  }
}