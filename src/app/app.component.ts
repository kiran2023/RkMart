import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ProductsDataService } from './user/productsData.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'routing';

  offerApply: any;

  constructor(private titleService: Title, private productDataService: ProductsDataService) {
      this.productDataService.startTimer();
  }

  ngOnInit() {
    this.titleService.setTitle('Home | RK MART');
  }
}

