import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProductsService } from '../adminProducts.service';
import { product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {

  head: string = "Add Product";
  addProductMessage: string | undefined;
  editOptionData: string | undefined;

  addProductForm!: FormGroup;
  allProductData: any = "";
  editProduct: product | undefined;

  editProductURLId: string | undefined | null = "";

  editProductEnable: boolean = false;
  idData: undefined | string | null;

  filterValue = ['10', '20', '30', '40', '50'];
  category: any = [];

  currentProduct: any;

  constructor(private productService: AdminProductsService, private formBuilder: FormBuilder, private activateUrl: ActivatedRoute, private http: HttpClient, private title: Title) {
    this.productService.categoryTypesCount().subscribe((category: any) => {
      category.forEach((category: any) => {
        console.warn(category);

        this.category.push(category.categoryType);
      })
    })
  }

  ngOnInit() {
    this.addProductForm = this.formBuilder.group({
      Stock: [, Validators.required],
      category: [, Validators.required],
      uniqueId: [, Validators.required],
      filterValue: [, Validators.required],
      value: [, Validators.required],
      image: [, Validators.required],
      alt: [, Validators.required],
      title: [, Validators.required],
      productName: [, Validators.required],
      quantity: [, Validators.required],
      rating: [],
      ratingAverage: [],
      originalAmount: [, Validators.required],
      discounted: [, Validators.required],
      actualAmount: [, Validators.required],
      manufacture: [],
      packed: [],
      expiry: [],
    });

    this.idData = this.activateUrl.snapshot.paramMap.get('id');
    if (this.idData) {
      this.head = "Update Product";
      this.editOptionData = "Update Product";
      this.productService.editProduct(this.idData).subscribe((product) => {

        if (product) {
          this.currentProduct = product;
          this.head = "Update Product";
          this.editOptionData = "Update Product";
          this.editProductEnable = true;
          this.addProductForm.controls['Stock'].setValue(product.Stock),
            this.addProductForm.controls['category'].setValue(product.category),
            this.addProductForm.controls['uniqueId'].setValue(product.uniqueId),
            this.addProductForm.controls['filterValue'].setValue(product.filterValue),
            this.addProductForm.controls['value'].setValue(product.value),
            this.addProductForm.controls['image'].setValue(product.image),
            this.addProductForm.controls['alt'].setValue(product.alt),
            this.addProductForm.controls['title'].setValue(product.title),
            this.addProductForm.controls['productName'].setValue(product.productName),
            this.addProductForm.controls['quantity'].setValue(product.quantity),
            this.addProductForm.controls['rating'].setValue(product.rating.length),
            this.addProductForm.controls['ratingAverage'].setValue(product.ratingAverage),
            this.addProductForm.controls['originalAmount'].setValue(product.originalAmount),
            this.addProductForm.controls['discounted'].setValue(product.discounted),
            this.addProductForm.controls['actualAmount'].setValue(product.actualAmount),
            this.addProductForm.controls['manufacture']?.setValue(product.manufacture),
            this.addProductForm.controls['packed']?.setValue(product.packed),
            this.addProductForm.controls['expiry']?.setValue(product.expiry)

          this.title.setTitle(`${this.addProductForm.get('title')?.value} | RK MART`);
        }
      });

      this.addProductForm.markAsPristine()
    } else {
      this.title.setTitle(`Add Product | RK MART`);
    }
    this.activateUrl.paramMap.subscribe((data) => {
      this.editProductURLId = data.get('id');
    });
  }

  addProduct(formData: product) {
    let rating: any = [];

    let productStatusMessageDiv = document.querySelector('#addProductMessage');
    let existProductData: any = false;
    this.addProductForm.invalid ? this.addProductMessage = 'Fill all the fields' : this.addProductMessage = undefined;
    setTimeout(() => { this.addProductMessage = '' }, 3000)

    this.productService.getProducts().subscribe((products: any) => {
      products.find((product: any) => {
        if (product.productName.trim() == formData.productName.trim() && existProductData == false) {
          existProductData = true;
        }
      });
      if (existProductData == false) {
        let updated: any;
        productStatusMessageDiv?.classList.remove('invalid');
        productStatusMessageDiv?.classList.add('valid');
        if (this.addProductForm.valid && existProductData != formData.productName) {
          if (this.idData) {
            updated = {
              ...formData,
              rating: rating,
              ratingAverage: 0
            }
          } else {
            updated = {
              ...formData
            }
          }

          this.productService.addProduct(updated).subscribe((response) => {
            if (response) {
              this.addProductMessage = "Product Added Successfully";
            }
            setTimeout(() => this.addProductMessage = undefined, 3000);
          });
        }
      } else {
        productStatusMessageDiv?.classList.remove('valid');
        productStatusMessageDiv?.classList.add('invalid');
        this.addProductMessage = "Product Already Exist";
        setTimeout(() => this.addProductMessage = undefined, 3000);
      }
    });
  }

  updateProduct(productData: product) {
    this.addProductForm.invalid ? this.addProductMessage = 'Fill all the fields' : this.addProductMessage = undefined;
    if (this.addProductForm.valid && !this.addProductForm.pristine) {
      delete productData.rating;
      delete productData.ratingAverage;
      this.productService.updateProductData(productData, this.editProductURLId).subscribe((response) => {
        if (response) {
          this.addProductMessage = "Product Updated Successfully";
        }
        setTimeout(() => this.addProductMessage = undefined, 3000);
      });
    }
  }

  resetForm() {
    this.addProductForm.reset();
  }
}