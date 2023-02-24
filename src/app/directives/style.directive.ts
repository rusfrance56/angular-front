import {Directive, ElementRef, HostListener, Input, Renderer2} from "@angular/core";

@Directive({
  selector: '[appStyle]'
})
export class StyleDirective {

  @Input("fontWeight") fontWeight = 'normal';
  @Input("fontColor") fontColor = 'red';

  constructor(private el: ElementRef,
              private rend: Renderer2) {
    // this.rend.setStyle(this.el.nativeElement, 'color', 'red');
    // el.nativeElement.style.color = 'red'
  }

  @HostListener('mouseenter') onEnter() {
    this.rend.setStyle(this.el.nativeElement, 'color', this.fontColor)
    this.rend.setStyle(this.el.nativeElement, 'font-weight', this.fontWeight)
  }
  @HostListener('mouseleave') onLeave() {
    this.rend.setStyle(this.el.nativeElement, 'color', null)
    this.rend.setStyle(this.el.nativeElement, 'font-weight', null)
  }
}
