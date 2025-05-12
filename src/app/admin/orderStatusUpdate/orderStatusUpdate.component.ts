import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orderStatusUpdate',
  templateUrl: './orderStatusUpdate.component.html',
  styleUrls: ['./orderStatusUpdate.component.css']
})
export class OrderStatusUpdateComponent implements OnInit {
  orderStatus = ['Processing', 'Packed', 'Delivered', 'Cancelled'];
  orderId: any;
  orderData: any;
  orderStatusData: FormGroup;

  constructor(private router: ActivatedRoute, private formBuilder: FormBuilder, private http: HttpClient, private Router: Router, private title: Title) {
    if (this.router.snapshot.paramMap.keys.length > 0) {
      this.router.paramMap.subscribe((url: any) => {
        this.orderId = url.get('orderId');

        this.http.get(`http://localhost:3000/orderStatusUpdate?orderid=${this.orderId}`).subscribe((data: any) => {
          this.orderData = data[0];
          this.orderStatusData.controls['orderId'].setValue(this.orderData.orderid);
          this.orderStatusData.controls['status'].setValue(this.orderData.status);
        });
      });

    }

    this.orderStatusData = this.formBuilder.group({
      orderId: [, Validators.required],
      status: [, Validators.required]
    });
    this.orderStatusData.markAsPristine();
  }

  updateData() {
    if (!this.orderStatusData.pristine) {
      this.http.get(`http://localhost:3000/orderStatusUpdate?orderid=${this.orderId}`).subscribe((data: any) => {
        let id = data[0].id;
        if (this.orderStatusData.controls['status'].value != 'Delivered') {
          this.http.patch(`http://localhost:3000/orderStatusUpdate/${id}`, { status: this.orderStatusData.controls['status'].value }).subscribe((res) => {
            if (res) {
              alert("updated Successfully")
            }
          });
        }
        if (this.orderStatusData.controls['status'].value == 'Delivered') {
          this.http.patch(`http://localhost:3000/orderStatusUpdate/${id}`, { status: this.orderStatusData.controls['status'].value, delivery: new Date().toLocaleDateString() }).subscribe((res) => {
            if (res) {
              alert("updated Successfully")
            }
          });
        }
        if (this.orderStatusData.controls['status'].value == 'Cancelled') {
          this.http.get(`http://localhost:3000/salesAmount/1`).subscribe((data: any) => {
            if (data) {
              let total = data.totalAmount - this.orderData.amount;
              this.http.put(`http://localhost:3000/salesAmount/1`, { totalAmount: total }).subscribe((data: any) => {})
            }
          })
        }
      });
    }
  }
  ngOnInit() {
    this.title.setTitle(`Order ${this.orderId} | RK MART`);
  }
}
