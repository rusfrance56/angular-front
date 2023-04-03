import {Injectable} from "@angular/core";
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {catchError, mergeMap, Observable, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {StorageService} from "./storage.service";
import {EventBusService} from "./event-bus.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private storageService: StorageService,
              private authService: AuthService,
              private eventBusService: EventBusService) {
  }
  /*
      return next.handle(req).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 401) {
            return this.handle401Error(req, next);
          }
          return throwError(() => error);
        })
      );
  */

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('auth/signin')
      || request.url.includes('auth/signup')
      || request.url.includes('auth/signout')
      || request.url.includes('auth/refreshtoken')) {
      return next.handle(request)
        .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse
            && (request.url.includes('auth/signout')) /* || request.url.includes('auth/refreshtoken')*/
            && (error.status === 403 || error.status === 500)) {
            this.storageService.clean();
            window.location.reload();
          }
          return throwError(() => error);
        })
      );
    }
    const user = this.storageService.getUser();

    if (user && this.isAccessTokenExpired()) {
      return this.authService.refreshToken(user.refreshToken).pipe(
        map(data => {
          let user = this.storageService.getUser();
          user.token = data.accessToken;
          user.refreshToken = data.refreshToken;
          this.storageService.saveUser(user);
          return this.addTokenToRequest(request);
        }),
        mergeMap((req) => next.handle(req)),
        catchError((error) => {
          if (error instanceof HttpErrorResponse
            && !request.url.includes('auth/refreshtoken') && error.status === 403) {
            // this.eventBusService.emit(new EventData('logout', null));
            this.storageService.clean();
            window.location.reload();
            //todo возможно тут выкинуть ошибку на экран?
          }/* else if (error instanceof HttpErrorResponse
            && !request.url.includes('auth/signin') && error.status === 401) {
            return this.handle401Error(request, next);
          }*/
          return throwError(() => error);
        })
      );
    } else {
      request = this.addTokenToRequest(request);
      return next.handle(request);
    }
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const user = this.storageService.getUser();
    if (user) {
      const token = user.token;
      if (token) {
        request = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
      }
    }
    return request;
  }

  private isAccessTokenExpired(): boolean {
    const user = this.storageService.getUser();
    let isAccessExpired = false;
    if (user) {
      const decodedAccessToken = this.storageService.getDecodedAccessToken(user.token);
      if (decodedAccessToken) {
        const tokenInvalidateDate = new Date(decodedAccessToken.exp * 1000);
        const now = new Date();

        if (now > tokenInvalidateDate) {
          isAccessExpired = true;
        }
      }
    }
    return isAccessExpired;
  }

  /*private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.storageService.isLoggedIn()) {
        return this.authService.refreshToken(null).pipe(/!*refreshToken instead of null*!/
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }
            return throwError(() => error);
          })
        );
      }
    }
    return next.handle(request);
  }*/
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
