import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {Post} from "../app.component";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  @Output() onAdd: EventEmitter<Post> = new EventEmitter<Post>();

  @ViewChild('titleInput') inputRef: ElementRef;

  title = '';
  text = '';
  date = 0;

  constructor(inputRef: ElementRef) {
    this.inputRef = inputRef;
  }

  addPost() {
    if (this.text.trim() && this.title.trim()) {
      const post: Post = {
        title: this.title,
        text: this.text,
        date: Date.now()
      }
      this.onAdd.emit(post);
      this.title = '';
      this.text = '';
      this.date = 0;
    }
  }

  focusTitle() {
    this.inputRef.nativeElement.focus();
  }
}
