import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent {
  @Input() imageNames: string[] = [];
  carouselId: string|undefined = undefined;
  @Input() autoRide: boolean = false;

  constructor() {}

  ngOnInit() {
    this.carouselId = this.generateRandomId(10);
  }

  private generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  removeImage(index: number): void {
    if (index > -1 && index < this.imageNames.length) {
      this.imageNames.splice(index, 1);
    }
  }
}
