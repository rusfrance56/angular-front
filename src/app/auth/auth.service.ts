import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const AUTH_API = 'http://localhost:8080/api/v1/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        userName: userName,
        password
      },
      httpOptions
    );
  }

  register(userName: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        userName: userName,
        password
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }

  refreshToken(refreshToken: any): Observable<any> {
    return this.http.post(AUTH_API + 'refreshtoken', {refreshToken}, httpOptions);
  }
}
