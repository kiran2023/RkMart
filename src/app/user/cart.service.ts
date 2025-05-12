import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductsDataService } from './productsData.service';
import { cart, order, product } from '../admin/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartProducts: any = [];
  productList = new BehaviorSubject<any>([]);

  userid = sessionStorage.getItem("userId");

  cartUrl = 'http://localhost:3000/cartData';
  usersCartUrl = 'http://localhost:3000/cartData?uid=';
  usersCartDeleteUrl = 'http://localhost:3000/cartData?uid=';
  orderUrl = 'http://localhost:3000/orders';
  ordersDataUrl = 'http://localhost:3000/orders?uid=';

  constructor(private http:HttpClient, private productService:ProductsDataService) { }

  getProducts() {
    return this.productList.asObservable();
  }

  addToCart(productData: cart) {
    let result: boolean = false;
    let returnData;
    this.cartProducts.filter((product: cart): boolean =>product.productid == productData.productid && this.userid==product.uid? result = true: result);
    if(!result){
      this.cartProducts.push(productData);
      this.productList.next(this.cartProducts);
      this.getProductTotalAmount();        
      returnData = this.http.post(`${this.cartUrl}`,productData);
    }else{
      alert("Already added in the cart");
    }
    return returnData; 
  }

  increaseQuantity(productid:any, stock:any){
    const indexValue = this.cartProducts.findIndex((products:any)=> products.id==productid );
    if(indexValue!==-1 &&  this.cartProducts[indexValue].quantity<stock ){
      this.cartProducts[indexValue].quantity++;
    }

    this.productList.next(this.cartProducts);
    this.getProductTotalAmount();
    this.http.put(`${this.cartUrl}/${productid}`, this.cartProducts[indexValue]).subscribe();
    return this.cartProducts[indexValue].quantity;

  }

  decreaseQuantity(productid:any){
    const indexValue = this.cartProducts.findIndex((products:any)=> products.id==productid );
    if(indexValue!==-1){
       this.cartProducts[indexValue].quantity--;
    }

    this.productList.next(this.cartProducts);
    this.getProductTotalAmount();
    this.http.put(`${this.cartUrl}/${productid}`, this.cartProducts[indexValue]).subscribe();
    return this.cartProducts[indexValue].quantity;
  }

  getProductTotalAmount():number {
    let grandTotal = 0;
    this.cartProducts.map((product: product) => {
      grandTotal = grandTotal + parseInt(product.originalAmount,10)*product.quantity;
    });
    return grandTotal;
  }

  getUsersCartList(userid:any){
    let offerStatus = sessionStorage.getItem("offerApply");
    let data:any;
    if(offerStatus=='true'){
      
      data = this.http.get(`${this.usersCartUrl}${userid}`,{observe:'response'}).subscribe((res)=>{
        if(res && res.body){
          this.cartProducts = res.body;
          
          this.cartProducts.forEach((cartProduct:any) => {
            cartProduct.originalAmount = cartProduct.actualAmount;
          });
  
          this.productList.next(this.cartProducts);
        }
      });
    }else{
      data = this.http.get(`${this.usersCartUrl}${userid}`,{observe:'response'}).subscribe((res)=>{
        if(res && res.body){
          this.cartProducts = res.body;
          
          this.cartProducts.forEach((cartProduct:any) => {
            cartProduct.originalAmount = cartProduct.discountedPrice;
          });
  
          this.productList.next(this.cartProducts);
        }
      });
    } 

    return data;
  }

  removeProduct(product: cart,userid:any) {
    let indexData = product.productid;    
    let removefromCart:any|undefined;
    this.cartProducts.map((productData: cart, indexData:any) => {
      if(product.productid == productData.productid && userid==productData.uid && product.id==productData.id) {
        this.cartProducts.splice(indexData,1);
        removefromCart = productData;
        this.productList.next(this.cartProducts);
      }
    });    
    return this.http.delete(`${this.cartUrl}/${removefromCart.id}`);
  }

  clearCart(productId:number) {
    return this.http.delete(`${this.cartUrl}/${productId}`,{observe:'response'}).subscribe((response)=>{
      if(response){
        this.cartProducts = [];
        this.productList.next(this.cartProducts);
      }
    });
  }

  order(orderData:any){    
    return this.http.post(`${this.orderUrl}`, orderData)
  }

  ordersData(userid:any){
    return this.http.get<order[]>(`${this.ordersDataUrl}${userid}`)
  } 
}