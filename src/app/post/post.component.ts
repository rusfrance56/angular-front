import {Component, Input, OnInit} from '@angular/core'
import {Post} from "../app.component";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['post.component.css']
})
export class PostComponent implements OnInit {

  @Input() myPost: Post

  constructor() {
    this.myPost = {text: "", title: "", date: 0};
  }

  ngOnInit() {

  }
}
