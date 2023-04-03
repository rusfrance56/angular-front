import {Component, OnInit} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";
import {AuthService} from "./auth/auth.service";
import {StorageService} from "./auth/storage.service";
import {EventBusService} from "./auth/event-bus.service";
import {Subscription} from "rxjs";

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
              private eventBusService: EventBusService) {
    this.currentLang = this.translocoService.getActiveLang();
  }

  changeLanguage(lang?: string) {
    if (this.translocoService.getActiveLang().endsWith('en')) {
      this.translocoService.setActiveLang('ru');
    } else {
      this.translocoService.setActiveLang('en');
    }
    /*switch (lang) {
      case 'Ru':
        this.translocoService.setActiveLang('Ru');
        break;
      case 'En':
        this.translocoService.setActiveLang('En');
        break;
      default:
        this.translocoService.setActiveLang('En');
    }*/
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
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
