import {Component} from '@angular/core';

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
