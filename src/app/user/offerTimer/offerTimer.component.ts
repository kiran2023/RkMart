import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductsDataService } from '../productsData.service';

@Component({
  selector: 'app-offerTimer',
  templateUrl: './offerTimer.component.html',
  styleUrls: ['./offerTimer.component.css']
})
export class OfferTimerComponent implements OnInit {
  remainingTime:any;
  constructor( private productDataService:ProductsDataService ) {}

  ngOnInit() {
    this.remainingTime = this.productDataService.remainingTime;
  }
}