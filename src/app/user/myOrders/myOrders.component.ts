import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { cart } from 'src/app/admin/product';
import { CartService } from 'src/app/user/cart.service';

@Component({
  selector: 'app-myOrders',
  templateUrl: './myOrders.component.html',
  styleUrls: ['./myOrders.component.css']
})
export class MyOrdersComponent implements OnInit {
  userid = sessionStorage.getItem("userId");
  username = sessionStorage.getItem('userName');
  orderData: any = [];
  orderTotalAmount: any;

  cartOrderList: cart[] | undefined;

  userRating: { [productId: number]: number } = {};

  constructor(private cartService: CartService, private http: HttpClient, private title: Title) { }

  ngOnInit() {
    if (sessionStorage.getItem('shippingData')) {
      sessionStorage.removeItem('shippingData');
    }
    this.cartService.ordersData(this.userid).subscribe((data: any) => {
      let orderDetails = data;

      orderDetails.forEach((orderDatas: any) => {
        let cartData = orderDatas.cartItems;

        cartData.forEach((cart: any) => {
          this.http.get(`http://localhost:3000/orderStatusUpdate?orderid=${cart.orderUniqueId}`).subscribe((response: any) => {

            let status = response[0].status;
            let delivery = response[0].delivery;
            let orderId = response[0].id;
            let reviewStatus = response[0].reviewStatus;
            let orderStatus = {
              ...cart,
              orderId: orderId,
              orderStatus: status,
              delivery: delivery,
              orderDate: response[0].orderDate,
              reviewStatus: reviewStatus
            }

            let dateNow: Date = new Date();
            let deliveryData = dateNow.toLocaleDateString();

            if (response[0].delivery == deliveryData && dateNow.getHours() > 12) {
              this.http.patch(`http://localhost:3000/orderStatusUpdate/${orderId}`, { deliveryDeadline: true }).subscribe(() => {
                orderStatus.deliveryDeadline = true;
                this.orderData.push(orderStatus);
              });
            } else {
              this.http.patch(`http://localhost:3000/orderStatusUpdate/${orderId}`, { deliveryDeadline: false }).subscribe(() => {
                orderStatus.deliveryDeadline = false;
                this.orderData.push(orderStatus);
              });
            }

          });
        });
      });


      if (this.orderData.length == 0) {
        // setTimeout(() => {
        //   const offerData: any = document.querySelector('.popupMsg');
        //   offerData.showModal();
        // }, 3000);
      }
    });

    this.title.setTitle('My Orders | RK MART');
  }

  cancelOrder(orderId: any, productId: any, quantity: any, date: any) {
    let dateNow: Date = new Date();
    let deliveryData = dateNow.toLocaleDateString();

    if (deliveryData != date || (deliveryData == date && dateNow.getHours() < 12)) {
      if (confirm("Are you Sure you Want to Cancel Order")) {

        let orderDatas;
        let id;
        let amount = 0;
        this.http.get(`http://localhost:3000/orderStatusUpdate?orderid=${orderId}`).subscribe((data: any) => {
          orderDatas = data;
          id = orderDatas[0].id;
          amount = orderDatas[0].amount;

          this.http.patch(`http://localhost:3000/orderStatusUpdate/${id}`, { status: "Cancelled" }).subscribe((res) => {
            if (res) {
              this.http.get(`http://localhost:3000/salesAmount/1`).subscribe((data: any) => {
                if (data) {
                  let total = data.totalAmount - amount;
                  this.http.put(`http://localhost:3000/salesAmount/1`, { totalAmount: total }).subscribe((data: any) => {
                    alert("Cancelled Successfully");
                  })
                }
              })
            }
          });

          this.http.get(`http://localhost:3000/Productdata/${productId}`).subscribe((data: any) => {

            let updatedData = {
              ...data,
              Stock: data.Stock + quantity
            }
            this.http.patch(`http://localhost:3000/Productdata/${productId}`, updatedData).subscribe();

          });
        });
      }
    } else {
      alert("Order Out For Delivery You Cannot Cancel Order");
    }
  }

  closeOffer() {
    const $offerData: any = document.querySelector('.popupMsg');
    $offerData.close();
  }

  onStarClick(productid: any, rating: number) {
    this.userRating[productid] = rating;
  }

  submitRating(productid: any, orderid: any) {
    this.http.get(`http://localhost:3000/Productdata/${productid}`).pipe(
      map((productData: any) => {
        const rating = [...productData.rating, this.userRating[productid]];
        let reviewAverage = rating;

        const sum = reviewAverage.reduce((total: any, currentValue: any) => total + currentValue, 0);
        let avgReviewCount = reviewAverage.length > 0 ? Math.round(sum / reviewAverage.length) : 0;

        this.http.patch(`http://localhost:3000/Productdata/${productid}`, { ratingAverage: avgReviewCount }).subscribe((response: any) => {
          if (response) {
            this.updateAverageReview({ ...productData, rating }, avgReviewCount, productid, orderid);
          }
        });
      })
    ).subscribe();
  }

  updateAverageReview(updatedProductData: any, reviewAverage: any, productid: any, orderid: any) {
    this.updatedRatingData(productid, updatedProductData).subscribe((response: any) => {
      if (response) {
        alert("Review Submitted Successfully");
        this.http.patch(`http://localhost:3000/orderStatusUpdate/${orderid}`, { reviewStatus: 'true' }).subscribe((response: any) => {
          if (response) {
            this.http.patch(`http://localhost:3000/Productdata/${productid}`, { ratingAverage: reviewAverage }).subscribe();
          }
        });
      }
    });
  }

  updatedRatingData(productid: any, updatedProduct: any) {
    return this.http.patch(`http://localhost:3000/Productdata/${productid}`, updatedProduct);
  }

  printOrder(orderData:any){

    let printReceipt = `
    <html lang="en">
    <head>
      <title> ${this.username} - Order ID : ${ orderData.orderUniqueId } - RkMart </title>
      <style>
      .orderBox {
        width: max-content;
        height: max-content;
        padding: 1.5rem;
        margin-top: 1rem;
        background-color: #fff;
        border: 0.1rem solid rgb(29, 106, 193);;
        border-radius: 1rem;
        margin-bottom: 2rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }

      h2, .status{
        color:rgb(191, 53, 53);
      }
      span{
        color:rgb(8, 5, 97);
      }
      </style>
    </head>
    <body>

    <h2> RK <span> MART <span> </h2>
    <h4> User Name : ${this.username} </h4>

    <div class="orderBox">
        <div>
          <p> <b> Order Id: </b> ${orderData.orderUniqueId} </p>
          <p> <b> Ordered On : </b> ${orderData.orderDate} </p>
          <div
            ${orderData.orderStatus !=='Delivered' && orderData.orderStatus !=='Cancelled'?'':'style="display:none"'}> <b> Delivery Excepted
              : </b> ${orderData.delivery} </div>
          <div ${orderData.orderStatus =='Delivered'?'':'style="display:none"'}> <b> Delivered On : </b>
            ${orderData.delivery} 
          </div>
        </div>
        <div>
          <div>
            <p> <b> Product : </b> ${ orderData.productName }</p>
            <div>
              <p> <b>Quantity : </b>${ orderData.quantity }</p>
              <p> <b> Total Amount : </b> ${ orderData.originalAmount } </p>
            </div>
          </div>
        </div>
        <div>
        <hr>
        <p> <b> Status : <span class="status"> ${orderData.orderStatus} </span> </b></p>
        <p> <b> Total : </b> ${ orderData.originalAmount * orderData.quantity}</p>
        </div>
    </div>
      
    </body>
    </html>
    `
    let receipt = window.open('','_blank');
    receipt?.document.write(printReceipt);
    receipt?.document.close();
    receipt?.print();
  }

}