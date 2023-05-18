import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShippingService } from 'src/app/shipping.service';
import { CartService } from 'src/app/user/cart.service';
import { ProductsDataService } from 'src/app/user/productsData.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  userShippingData: any = "";

  registeredUserData: any = "";
  activeUserData: any = "";
  constructor(private userData: ProductsDataService, private cartService:CartService, private shippingService:ShippingService ,private title: Title, private formBuilder:FormBuilder, private route:Router) {
  }

  shippingForm = this.formBuilder.group(
    {
      customerName: [],
      customerMail: [],
      customerMobile: [],
      customerState: [, [Validators['required']]],
      customerCity: [, [Validators['required']]],
      customerPincode: [, [Validators['required'],Validators['minLength']]],
      customerAddress: [, [Validators['required']]]
    }
  )

  ngOnInit() {
    this.title.setTitle('Shipping | RK MART');
    this.userShippingData = this.userData.activeUser;

    this.userData.registeredUser().subscribe((data) => {
      this.registeredUserData = data;

      this.registeredUserData.filter((userData: any) => {
        if(userData.mail == sessionStorage.getItem("userMail")){
          this.activeUserData = userData;
        }
      });
    });
  }

  shippingData(){
    let cartItems="";
    this.cartService.getProducts().subscribe((cartData:any)=>{
      cartItems = cartData;
    })
    this.shippingForm.controls['customerName'].setValue(this.activeUserData.username),
    this.shippingForm.controls['customerMail'].setValue(this.activeUserData.mail),
    this.shippingForm.controls['customerMobile'].setValue(this.activeUserData.mobile)
    
    let uid = sessionStorage.getItem("userId");
    let totalAmount = this.cartService.getProductTotalAmount();
    let userOrderData = {
      ...this.shippingForm.value,
      cartItems,
      totalAmount,
      uid
    }
    this.shippingService.userShippingData = userOrderData;
    sessionStorage.setItem('shippingData',JSON.stringify(userOrderData));
    this.route.navigate(['cart/shipping/orderDetails']);
  }
}
