import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orderData: any = [];

  constructor(private http: HttpClient, private title: Title) {
    this.http.get('http://localhost:3000/orders').subscribe((orderData: any) => {

      let orderDatas = orderData;

      orderDatas.forEach((orderDatas: any) => {
        let cartData = orderDatas.cartItems;

        cartData.forEach((cart: any) => {
          this.http.get(`http://localhost:3000/orderStatusUpdate?orderid=${cart.orderUniqueId}`).subscribe((response: any) => {
            let orderStatus = {
              ...cart,
              customerName: orderDatas.customerName,
              customerAddress: orderDatas.customerAddress,
              orderStatus: response[0].status
            }
            this.orderData.push(orderStatus);
            // if (orderStatus == "Cancelled") {
            //   alert("Entered");
            //   this.http.get(`http://localhost:3000/Productdata/${cart.productid}`).subscribe((data: any) => {
            //     let updatedData = {
            //       ...data,
            //       Stock: data.Stock + data.quantity
            //     }
            //     this.http.patch(`http://localhost:3000/Productdata/${cart.productid}`, updatedData).subscribe();
            //   })
            // }
          })
        })
      });
    });
  }

  ngOnInit() {
    this.title.setTitle('Orders | RK MART');
  }
}
