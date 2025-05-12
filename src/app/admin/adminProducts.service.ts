import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsDataService } from 'src/app/user/productsData.service';
import { product } from './product';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {

  categoryCount: number = 0;
  categoryList = new BehaviorSubject<any>([]);

  adminName: any = "";

  admin: boolean = false;
  editProductData: any = "";
  editProductID: any;

  getProductDataUrl = 'http://localhost:3000/Productdata';
  getCategoryUrl = 'http://localhost:3000/category';

  getCategoryTypesUrl = 'http://localhost:3000/categoryTypes';
  getRegisteredUsersUrl = 'http://localhost:3000/registeredUser';

  getOrdersUrl = 'http://localhost:3000/orders'

  constructor(private http: HttpClient, private userAuth: ProductsDataService, private route: Router) {
    this.adminName = sessionStorage.getItem("adminLoggedin");
  }

  getProducts() {
    return this.http.get<any>(`${this.getProductDataUrl}`);
  }

  productTotalAmount() {
    let productTotalAmount: any = 0
    return this.http.get(`${this.getProductDataUrl}`).pipe(
      map((product: any) => {
        product.forEach((product: any) => {
          productTotalAmount += parseInt(product.originalAmount);
        });
        return productTotalAmount;
      })
    )
  }

  getUsers() {
    return this.http.get<any>(`${this.getRegisteredUsersUrl}`);
  }

  deleteProduct(id: any) {
    return this.http.delete(`${this.getProductDataUrl}/${id}`);
  }

  addProduct(productData: product) {
    return this.http.post(`${this.getProductDataUrl}`, productData);
  }

  categoryTypes(categoryData: any) {
    return this.http.post(`${this.getCategoryTypesUrl}`, categoryData);
  }

  categoryTypesCount() {
    return this.http.get<any>(`${this.getCategoryUrl}`);
  }

  addCategory(categoryData: any) {
    return this.http.post(`${this.getCategoryUrl}`, categoryData);
  }

  updateCategory(categoryData: any, key: any, id: any) {
    return this.http.patch(`${this.getCategoryUrl}/${id}`, { [key]: categoryData });
  }

  updateCategoryData(categoryId:any, categoryData:any){
    return this.http.put(`${this.getCategoryUrl}/${categoryId}`, categoryData);
  }

  getCategory() {
    return this.http.get(`${this.getCategoryUrl}`);
  }

  getCategoryTypes(){
    return this.http.get(`${this.getCategoryTypesUrl}`);
  }

  addCategoryTypes(category: string) {
    return this.http.post(`${this.getCategoryTypesUrl}`, category);
  }

  removeCategoryTypes(id:any){
    return this.http.delete(`${this.getCategoryTypesUrl}/${id}`);
  }

  removeCategory(categoryId:any, updatedData:any){
    return this.http.put(`${this.getCategoryUrl}/${categoryId}`,updatedData);
  }

  editProduct(productId: string | undefined | null) {
    return this.http.get<product>(`${this.getProductDataUrl}/${productId}`);
  }

  updateProductData(product: product, productID: string | undefined | null) {
    return this.http.patch<product>(`${this.getProductDataUrl}/${productID}`, product);
  }

  removerUser(user: any) {
    return this.http.delete(`${this.getRegisteredUsersUrl}/${user}`);
  }

  getOrders(){
    return this.http.get(`${this.getOrdersUrl}`);
  }

  logout() {
    this.admin = false;
    this.userAuth.adminLogin = false;
    sessionStorage.clear();
    this.route.navigate(['/', 'home']);
  }

  addCategoryTest(categoryID: any, categoryKey1: any, categoryKey2: any, categoryKey3: any, categoryData1: any, categoryData2: any, categoryData3: any) {

    return this.http.get(`${this.getCategoryUrl}/${categoryID}`).pipe(
      switchMap((result: any) => {

        let updatedCategory1 = result[categoryKey1].concat(categoryData1);
        let updatedCategory2 = result[categoryKey2].concat(categoryData2);
        let updatedCategory3 = result[categoryKey3].concat(categoryData3);

        const updatedValue = { [categoryKey1]: updatedCategory1, [categoryKey2]: updatedCategory2, [categoryKey3]: updatedCategory3 };

        return this.http.patch(`${this.getCategoryUrl}/${categoryID}`, updatedValue);
      })
    )
  }

  removeCategoryData(categoryId: any, categoryValue: any, categoryClass: any, categoryUniqueValue: any,  redirectStatus?:boolean, redirect?:any,) {
    let confirmation =  redirectStatus? confirm(`Do you want to delete the previous category "${redirect}"`):true;
    if (confirmation) {
      this.http.get(`http://localhost:3000/category/${categoryId}`).subscribe((categoryData: any) => {
        let categoryDataObject = categoryData;

        if (categoryDataObject["category"].indexOf(categoryValue) != -1 && categoryDataObject["categoryClass"].indexOf(categoryClass) != -1 && categoryDataObject["categoryUniqueValue"].indexOf(categoryUniqueValue) != -1) {
          categoryDataObject["category"].splice(categoryDataObject["category"].indexOf(categoryValue), 1);
          categoryDataObject["categoryClass"].splice(categoryDataObject["categoryClass"].indexOf(categoryValue), 1);
          categoryDataObject["categoryUniqueValue"].splice(categoryDataObject["categoryUniqueValue"].indexOf(categoryValue), 1);
        }

        if (categoryData.category.length !== 0) {          
          this.removeCategory(categoryId, categoryDataObject).subscribe((response) => {
            response ? alert("Category Remove Successfully") : alert("Error While Removing Category");
            window.location.reload();
          })
        }
        if (categoryData.category.length == 0) {
          this.removeCategoryTypes(categoryId).subscribe();
          this.http.delete(`http://localhost:3000/category/${categoryId}`).subscribe();
          window.location.reload();
        }
      });
    }
  }
}