import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.css']
})
export class QueriesComponent implements OnInit {
  queries:any="";
  queryDisplay:boolean = true;

  queryStatus = ['Pending', 'Addressed'];

  updateQueries:FormGroup;

  constructor(private http:HttpClient, private title:Title, private formBuilder:FormBuilder) {
    this.updateQueries = this.formBuilder.group({
      uid:[,Validators.required],
      queryStatus:[,Validators.required],
      id:[,Validators.required],
      addressingData:[,Validators.required]
    })
   }

  ngOnInit() {
    this.http.get('http://localhost:3000/Queries').subscribe((queryData:any)=>{
      this.queries = queryData;
    });
    this.title.setTitle('Query | RK MART');
  }
  updateData(id:number){
    this.queryDisplay = false;
    this.http.get(`http://localhost:3000/Queries/${id}`).subscribe((queryData:any)=>{
      this.updateQueries.controls['uid'].setValue(queryData.uid);
      this.updateQueries.controls['queryStatus'].setValue(queryData.queryStatus);
      this.updateQueries.controls['id'].setValue(queryData.id);
      this.updateQueries.controls['addressingData'].setValue(queryData.addressingData||'');
    });
    this.updateQueries.markAsPristine();
  }

  updateQueryStatus(status:any){
    if(!this.updateQueries.pristine && this.updateQueries.valid){
      this.http.patch(`http://localhost:3000/Queries/${status.id}`, status).subscribe((response:any)=>{
        if(response){
          alert("Updated Successfully");
        }
      });
    }else{
      alert("Data Has not Modified Yet");
    }    
  }

  back(){
    this.queryDisplay = true;
    window.location.reload();
  }
}
