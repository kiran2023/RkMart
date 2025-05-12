import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contactUs',
  templateUrl: './contactUs.component.html',
  styleUrls: ['./contactUs.component.css']
})
export class ContactUsComponent implements OnInit {
  contactUs:FormGroup;
  userLogin:boolean|undefined;
  constructor(private title:Title, private formBuilder:FormBuilder, private http:HttpClient) { 
    this.contactUs = this.formBuilder.group({
      username:['', [Validators.required, Validators.pattern("^[A-Za-z]+$")]],
      email:['', [Validators.required,Validators.pattern("^[0-9a-zA-Z]+[._]{0,1}[0-9a-zA-Z]+[@][a-zA-Z]+[.][a-zA-Z]{2,3}([.][a-zA-Z]{2,3}){0,1}$")]],
      subject:['', Validators.required],
      textarea:['', Validators.required]
    })
  }
  
  ngOnInit() {
    this.title.setTitle('Contact Us | RK MART');
    this.userLogin = Boolean(sessionStorage.getItem('userLoggedIn'));
    if(sessionStorage.getItem('userLoggedIn')){
    let username = sessionStorage.getItem('userName');
    let email = sessionStorage.getItem('userMail');

    this.contactUs.controls['username'].setValue(username);
    this.contactUs.controls['email'].setValue(email);

    }
  }

  submitQuery(queryData:any){
    let invalidMessage:any = document.querySelector('#errorMessage');
    if(this.contactUs.valid){
      let userData = {
        ...queryData,
        queryStatus:'Pending',
        uid:sessionStorage.getItem('userId')?sessionStorage.getItem('userId'):Math.floor(Math.random() * 100000)
      }
      
      this.http.post('http://localhost:3000/Queries',userData).subscribe();
      !this.userLogin?invalidMessage.innerHTML = "Query Submitted Successfully We will reach you through Mail":invalidMessage.innerHTML = "Query Submitted Successfully check back later in query section";
      setTimeout(()=> { 
        invalidMessage.innerHTML='';  
        this.contactUs.reset();
      },5000);
    }
    if(this.contactUs.invalid){
      invalidMessage.innerHTML= "Enter all the fields";
      setTimeout(()=> invalidMessage.innerHTML='', 3000)
    }
  }
}
