import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomerOrder} from "./customer-order";

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {
  private baseURL = "http://localhost:8080/orders";

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<CustomerOrder[]> {
    return this.httpClient.get<CustomerOrder[]>(this.baseURL);
  }

  create(customerOrder: CustomerOrder): Observable<CustomerOrder> {
    return this.httpClient.post<CustomerOrder>(this.baseURL, customerOrder);
  }

  update(customerOrder: CustomerOrder): Observable<CustomerOrder> {
    return this.httpClient.put<CustomerOrder>(this.baseURL + '/' + customerOrder.id, customerOrder);
  }

  getById(id: number): Observable<CustomerOrder> {
    return this.httpClient.get<CustomerOrder>(this.baseURL + '/' + id);
  }

  delete(id: number): Observable<CustomerOrder> {
    return this.httpClient.delete<CustomerOrder>(this.baseURL + '/' + id);
  }
}
