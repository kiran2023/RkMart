import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './user/cart/cart.component';
import { ContactUsComponent } from './user/contactUs/contactUs.component';
import { ErrorComponent } from './user/error/error.component';
import { HomeComponent } from 'src/app/user/home/home.component';
import { MyOrdersComponent } from 'src/app/user/myOrders/myOrders.component';
import { OrderDetailsComponent } from 'src/app/user/orderDetails/orderDetails.component';
import { PaymentComponent } from 'src/app/user/payment/payment.component';
import { ProductDescriptionComponent } from 'src/app/user/productDescription/productDescription.component';
import { ProductsComponent } from './user/products/products.component';
import { ShippingComponent } from 'src/app/user/shipping/shipping.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthUserGuard } from './auth-user.guard';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { AuthAdminGuard } from './admin/auth-admin.guard';
import { CategoryDataComponent } from './admin/categoryData/categoryData.component';
import { AddCategoryComponent } from './admin/addCategory/addCategory.component';
import { QueriesComponent } from './admin/queries/queries.component';
import { OrderStatusUpdateComponent } from './admin/orderStatusUpdate/orderStatusUpdate.component';
import { QueryComponent } from './user/query/query.component';
import { PaymentDataComponent } from './admin/paymentData/paymentData.component';
import { UrlGuard } from './url.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products', children:[
    { path: ':category', component: ProductsComponent },
    { path: 'productDescription/:productID', component: ProductDescriptionComponent },
    { path: ':category/productDescription/:productID', component: ProductDescriptionComponent },
  ] },
  { path: 'cart', component: CartComponent, canActivate: [AuthUserGuard] },
  { path: 'contactUs', component: ContactUsComponent },
  { path:'cart', canActivateChild:[AuthUserGuard],children:[
    { path: 'shipping', component: ShippingComponent, canActivate: [UrlGuard] },
    { path: 'shipping/orderDetails', component: OrderDetailsComponent, canActivate: [UrlGuard] },
    { path: 'shipping/orderDetails/payment', component: PaymentComponent, canActivate: [UrlGuard] },
    { path: 'myOrders', component: MyOrdersComponent },
    { path: 'query', component:QueryComponent, canActivate: [UrlGuard] }
  ]},
  {path: 'admin', canActivate:[AuthAdminGuard], component: AdminComponent},
    
  {path:'admin', canActivate:[AuthAdminGuard],children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersComponent },
    { path: 'manageProducts', component: ManageProductsComponent },
    { path: 'manageOrders', component: ManageOrdersComponent },
    { path: 'addProducts', component: AddProductsComponent },
    { path: 'category', component: CategoryDataComponent },
    { path: 'addProducts/:id', component: AddProductsComponent },
    { path: 'addCategory', component: AddCategoryComponent },
    { path: 'addCategory/:id', component: AddCategoryComponent },
    { path: 'queries', component: QueriesComponent },
    { path: 'orderStatus/:orderId', component: OrderStatusUpdateComponent },
    { path: 'paymentData', component: PaymentDataComponent }
  ]},

  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
