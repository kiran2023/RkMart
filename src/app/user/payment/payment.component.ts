import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CartService } from 'src/app/user/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  expiryDate: string | undefined;

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  paymentAmount: number = 0;
  data: any = "";
  retrivedStocks: any = [];

  ps: any = [];
  status: any = [];
  pay: any = [];

  payment: FormGroup;

  updateRequests: any = [];
  paymentStatus: string = "Payment Done";

  constructor(private cartService: CartService, private http: HttpClient, private formBuilder: FormBuilder, private title: Title) {
    this.payment = this.formBuilder.group({
      accountNumber: [, [Validators.required, Validators.pattern("[0-9]{0,16}"), Validators.minLength(16), Validators.maxLength(16)]],
      cardType: [, Validators.required],
      expiry: [, Validators.required],
      cvv: [, [Validators.required, Validators.pattern("[0-9]{0,16}"), Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  ngOnInit() {
    this.paymentAmount = this.cartService.getProductTotalAmount();

    this.title.setTitle('Payment | RK MART');
    let extractedData: any = sessionStorage.getItem("shippingData");
    this.data = JSON.parse(extractedData);
  }

  paymentModal() {
    if (this.payment.valid) {
      this.data.cartItems.forEach((product: any) => {
        let date: Date = new Date();
        date.setDate(date.getDate() + 5);
        let deliveryData = date.toLocaleDateString();

        this.http.get(`http://localhost:3000/Productdata/${product.productid}`).subscribe((data: any) => {

          let updatedData = {
            ...data,
            Stock: data.Stock - product.quantity
          }

          let orderId = {
            orderid: product.orderUniqueId,
            productid: product.productid,
            amount: product.originalAmount * product.quantity,
            status: 'Processing',
            deliveryDeadline: false,
            delivery: deliveryData,
            orderDate: new Date().toLocaleDateString(),
            Stock: data.Stock - product.quantity,
            reviewStatus: 'false'
          }

          let payment = {
            orderid: product.orderUniqueId,
            productid: product.productid,
            uid: product.uid,
            status: this.paymentStatus,
          };

          this.http.patch(`http://localhost:3000/Productdata/${product.productid}`, updatedData).subscribe();

          this.http.post('http://localhost:3000/orderStatusUpdate', orderId).subscribe();

          this.http.post(`http://localhost:3000/payments`, payment).subscribe();

          this.http.get(`http://localhost:3000/salesAmount/1`).subscribe((data: any) => {
            if (data) {
              let total = data.totalAmount + product.originalAmount * product.quantity;              
              this.http.put(`http://localhost:3000/salesAmount/1`, {totalAmount:total}).subscribe((data: any) => {
                if(data){
                  sessionStorage.removeItem('shippingData');
                }
              })
            }
          })
        })
      })

      this.cartService.order(this.data).subscribe((response) => {
        if (response) {
          let paymentModal: any = document.querySelector(".paymentModal");
          paymentModal.showModal();
        }
      });
    } else {
      let errorMessage: any = document.querySelector('#errorMessage');
      errorMessage.innerHTML = "Enter all the Fields";
      setTimeout(() => errorMessage.innerHTML = '', 3000);
    }
  }
}
