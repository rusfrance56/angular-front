import {Component} from '@angular/core';
import {TranslocoService} from "@ngneat/transloco";

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
export class AppComponent {

  currentLang: string;

  constructor(private translocoService: TranslocoService) {
    this.currentLang = this.translocoService.getActiveLang();
  }

  changeLanguage(lang: string) {
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

  posts: Post[] = [
    {title: 'Post1', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum, sequi?',
      id: 1, date: Date.parse('2022-12-12')},
    {title: 'Post2 ', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, deleniti.',
      id: 2, date: Date.parse('2022-03-15')}
  ];

  updatePosts(post: Post) {
    this.posts.unshift(post);
  }
}
