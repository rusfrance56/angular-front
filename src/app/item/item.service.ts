import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Item} from "./item";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseURL = "http://localhost:8080/items";

  constructor(private httpClient: HttpClient) {

  }

  getItemList(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.baseURL);
  }

  save(item: Item): Observable<Item>  {
    return this.httpClient.post<Item>(this.baseURL, item);
  }

  update(item: Item): Observable<Item>  {
    return this.httpClient.put<Item>(this.baseURL + '/' + item.id, item);
  }

  getItemById(id: number): Observable<Item>  {
    return this.httpClient.get<Item>(this.baseURL + '/' + id);
  }

  delete(id: number): Observable<Item>  {
    return this.httpClient.delete<Item>(this.baseURL + '/' + id);
  }
}
