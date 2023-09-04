import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appIsActive]',
})
export class IsActiveDirective {
  constructor(private el: ElementRef) {}

  // isActive: boolean = false;
  @HostListener('click') onMouseLeave() {
    let list = this.el.nativeElement.parentElement.children;

    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove('active');
    }
    // list.forEach((ele: any) => {
    //   ele.classList.remove('active');
    // });
    this.el.nativeElement.classList.add('active');
    this.ahmed.emit(this.el.nativeElement.textContent);
  }

  @Output() ahmed: EventEmitter<any> = new EventEmitter();

  // @HostBinding('class.active') active!: boolean;
}
