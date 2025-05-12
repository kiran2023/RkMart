import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthUserGuard } from 'src/app/auth-user.guard';
import { UrlGuard } from 'src/app/url.guard';
import { CartService } from 'src/app/user/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterViewChecked {

  product: any = [];
  subtotal: number = 0;

  productQuantityData = 1;

  offerApply:any;

  constructor(private cartService: CartService, private route: Router, private urlGuard:UrlGuard ,private http: HttpClient, private guard: AuthUserGuard, private title: Title) { 
    this.urlGuard.navigatePermission = false;
  }

  ngOnInit() {
    this.offerApply = sessionStorage.getItem('offerApply');

    if(this.offerApply=='true'){
      this.cartService.getProducts().subscribe((productData: any) => {
        this.product = productData;
  
        this.subtotal = this.cartService.getProductTotalAmount();
        
      });
    }

    if(this.offerApply=='false'){
      this.cartService.getProducts().subscribe((productData: any) => {
        this.product = productData;
  
        this.subtotal = this.cartService.getProductTotalAmount();
        
      });
    }
    this.title.setTitle('Cart | RK MART');
  }

  quantityIncrement(id: any, productid: any) {
    this.http.get(`http://localhost:3000/Productdata/${productid}`).subscribe((productData: any) => {
      this.productQuantityData = this.cartService.increaseQuantity(id, productData.Stock);
    });
  }

  quantityDecrement(id: any) {
    const indexValue = this.cartService.cartProducts.findIndex((cartData: any) => cartData.id == id);

    if (indexValue !== -1 && this.cartService.cartProducts[indexValue].quantity > 1) {
      this.productQuantityData = this.cartService.decreaseQuantity(id);
    }
  }

  removeProduct(product: any) {
    this.cartService.removeProduct(product, sessionStorage.getItem('userId')).subscribe();
  }

  shipping(){
    if(this.product.length!=0){
      this.urlGuard.navigatePermission = true;
      this.route.navigate(['/cart/shipping']);
    }
  }

  clearCart() {
    this.product.forEach((product: any) => {
      this.cartService.clearCart(product.id);
    })
  }

  ngAfterViewChecked() {
    if (!sessionStorage.getItem('userLoggedIn')) {
      this.route.navigate(['home']);
    }
  }
}