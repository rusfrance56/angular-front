import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {StorageService} from "../storage.service";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router,
              private location: Location) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    //todo из-за того что сервер всегда возвращает запрос без ошибки, тут мы якобы получаем пользователя
    //todo можно воспроизвести попробовав залогиниться по несуществующему пользователю
    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.navigateHome();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  navigateHome() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
