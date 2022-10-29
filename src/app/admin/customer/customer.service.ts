import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public apiCustomer = "http://localhost:8080/api/";
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiCustomer + "customers");
  }

  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.apiCustomer + "customers", customer);
  }

  getCustomerById(id: any): Observable<any> {
    return this.http.get<any>(this.apiCustomer + "customers/" + id);
  }

  public updateCustomer(customer: Customer): Observable<any> {
    return this.http.put<any>(this.apiCustomer + "customers/", customer);
  }

  public deleteCustomer(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiCustomer}`+ "customers/" + id);
  }

  public getPageTransfer(indexPage: any,
    descAsc: any, dto: any): Observable<any> {
    return this.http.put<any>(this.apiCustomer + '/sortByKey?page=' + indexPage +
      '&descAsc=' + descAsc, dto);
  }

}
