import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { product } from '../admin/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataService {
  rkMartProducts: any = "";

  adminLogin: boolean = false;

  userLogin: boolean = false;
  activeUser: any = "";
  userId: number | undefined;
  activeUserMail: string = "";

  endTime: Date = new Date();
  offerApply:any;

  remainingTime: any = {
    days:0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  timerId: any;

  getAdminUrl = 'http://localhost:3000/admin';
  getProductDataUrl = 'http://localhost:3000/Productdata';
  getCategoryUrl = 'http://localhost:3000/category';
  getCategoryUrlTypes = 'http://localhost:3000/categoryTypes';
  getRegisteredUsersUrl = 'http://localhost:3000/registeredUser';

  constructor(private http: HttpClient) { }

  admin() {
    return this.http.get(`${this.getAdminUrl}`);
  }

  getProducts() {
    return this.http.get<product>(`${this.getProductDataUrl}`);
  }

  getCategory() {
    return this.http.get(`${this.getCategoryUrl}`);
  }

  getCategoryTypes() {
    return this.http.get(`${this.getCategoryUrlTypes}`);
  }

  registerUser(userData: any) {
    return this.http.post(`${this.getRegisteredUsersUrl}`, userData);
  }

  registeredUser() {
    return this.http.get(`${this.getRegisteredUsersUrl}`);
  }

  startTimer(): void {
    const startTime = new Date();
    startTime.setFullYear(2023, 5, 30)
    startTime.setHours(12, 0, 0); 
  
    const endTime = new Date();
    
    endTime.setFullYear(2023, 6, 18)
    endTime.setHours(18, 0, 0); 
  
    this.calculateRemainingTime(startTime, endTime);
  
    this.timerId = setInterval(() => {
      this.updateRemainingTime();
      if (this.remainingTime.days === 0 && this.remainingTime.hours === 0 && this.remainingTime.minutes === 0 && this.remainingTime.seconds === 0) {
        this.offerApply = sessionStorage.setItem("offerApply", "false");
        clearInterval(this.timerId);
      } else {
        this.offerApply = sessionStorage.setItem("offerApply", "true");
      }
    }, 1000);
  }
  
  calculateRemainingTime(startTime: Date, endTime: Date): void {
    const currentTime = new Date();
    
    if (currentTime >= startTime && currentTime <= endTime) {
      const timeRemaining = endTime.getTime() - currentTime.getTime();
  
      this.remainingTime.days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      this.remainingTime.hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.remainingTime.minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      this.remainingTime.seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    }
  }
  
  updateRemainingTime(): void {
    if (this.remainingTime.seconds > 0) {
      this.remainingTime.seconds--;
    } else {
      if (this.remainingTime.minutes > 0) {
        this.remainingTime.minutes--;
        this.remainingTime.seconds = 59;
      } else {
        if (this.remainingTime.hours > 0) {
          this.remainingTime.hours--;
          this.remainingTime.minutes = 59;
          this.remainingTime.seconds = 59;
        }
      }
    }
  }
}
