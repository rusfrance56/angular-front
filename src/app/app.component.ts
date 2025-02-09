import {Component, OnInit} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";
import {AuthService} from "./auth/auth.service";
import {StorageService} from "./auth/storage.service";
import {EventBusService} from "./auth/event-bus.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {UserService} from "./user/user.service";

export interface Post {
  title: string,
  text: string,
  id?: number,
  date: number
}
export enum Department {
  CUSHIONED= "CUSHIONED",
  STORAGE = "STORAGE",
  OFFICE = "OFFICE"
}
export enum TaskStatus {
  NEW= "NEW",
  DEPLOYED = "DEPLOYED",
  FINISHED = "FINISHED"
}
export enum OrderStatus {
  CREATED= "CREATED",
  DEVELOPED = "DEVELOPED",
  COMPLETE = "COMPLETE"
}
export enum TaskPriority {
  HIGH = "HIGH",
  LOW = 'LOW'
}
export function sortData(data: any[]): any[] {
  return data.sort((a, b) => {
    return <any>new Date(b.updated) - <any>new Date(a.updated);
  });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  currentLang: string;
  roles: string[] = [];
  isLoggedIn = false;
  username?: string;
  eventBusSub?: Subscription;

  constructor(private translocoService: TranslocoService,
              private authService: AuthService,
              private storageService: StorageService,
              private eventBusService: EventBusService,
              private router: Router,
              private userService: UserService) {
    this.currentLang = this.translocoService.getActiveLang();
  }

  changeLanguage(lang?: string) {
    if (this.translocoService.getActiveLang().endsWith('en')) {
      this.translocoService.setActiveLang('ru');
    } else {
      this.translocoService.setActiveLang('en');
    }
    this.currentLang = this.translocoService.getActiveLang();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.navigateLogin();
      },
      error: () => {
        this.storageService.clean();
        this.navigateLogin();
      }
    });
  }

  navigateLogin() {
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isAdmin() {
    return this.userService.isAdmin();
  }
}
