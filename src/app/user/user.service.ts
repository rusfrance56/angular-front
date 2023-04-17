import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = "http://localhost:8080/users";

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseURL);
  }

  create(user: User): Observable<User>  {
    return this.httpClient.post<User>(this.baseURL, user);
  }

  update(user: User): Observable<User>  {
    return this.httpClient.put<User>(this.baseURL + '/' + user.id, user);
  }

  getById(id: number): Observable<User>  {
    return this.httpClient.get<User>(this.baseURL + '/' + id);
  }

  getByDepartment(department: string): Observable<User[]>  {
    return this.httpClient.get<User[]>(this.baseURL + '/byDepartment' + '?department=' + department);
  }

  delete(id: number): Observable<User>  {
    return this.httpClient.delete<User>(this.baseURL + '/' + id);
  }
}
