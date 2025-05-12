// Reviewer    : Sabapathi Shanmugam
// Date        : June 13, 2023
// Participant : Kiran N
// Mentors     : Snigdha Agarwal, Naveen Subramaniam

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './user/home/home.component';
import { ProductsComponent } from './user/products/products.component';
import { ContactUsComponent } from './user/contactUs/contactUs.component';
import { CartComponent } from './user/cart/cart.component';
import { ProductDescriptionComponent } from './user/productDescription/productDescription.component';
import { CategoryComponent } from './user/category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './user/footer/footer.component';
import { ErrorComponent } from './user/error/error.component';
import { MenuComponent } from './user/menu/menu.component';
import { ShippingComponent } from './user/shipping/shipping.component';
import { OrderDetailsComponent } from './user/orderDetails/orderDetails.component';
import { PaymentComponent } from './user/payment/payment.component';
import { MyOrdersComponent } from './user/myOrders/myOrders.component';
import { AdminModule } from './admin/admin.module';
import { OrderStatusUpdateComponent } from '../app/admin/orderStatusUpdate/orderStatusUpdate.component';
import { QueryComponent } from './user/query/query.component';
import { OfferTimerComponent } from './user/offerTimer/offerTimer.component';

@NgModule({
  declarations: [																			
      AppComponent,
      HomeComponent,
      ProductsComponent,
      ContactUsComponent,
      CartComponent,
      ProductDescriptionComponent,
      ProductDescriptionComponent,
      CategoryComponent,
      FooterComponent,
      ErrorComponent,
      MenuComponent,
      ShippingComponent,
      OrderDetailsComponent,
      PaymentComponent,
      MyOrdersComponent,
      OrderStatusUpdateComponent,
      QueryComponent,
      OfferTimerComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }