import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  queryAddressedData: any;
  query: boolean = false;
  constructor(private http: HttpClient, private title:Title) {
    let userId = sessionStorage.getItem('userId');

    this.http.get(`http://localhost:3000/Queries?uid=${userId}`).subscribe((data) => {

      if (data != '') {
        this.queryAddressedData = data;
        this.query = true;
      } else {
        this.query = false;
      }
    })
  }

  ngOnInit() {
    this.title.setTitle('My Queries | RK MART');
  }

}
