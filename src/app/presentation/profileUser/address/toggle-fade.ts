import { animate, style, transition, trigger } from "@angular/animations";

export const toggleFade=trigger('fade',[
  transition(':enter',[
    style({opacity:'0',transform:'translateX(100px)'}),
    animate('1s',style({opacity:'1',transform:'translateX(0px)'}))
  ]),
  transition(':leave',[
    style({opacity:'1'}),
    animate('1s',style({opacity:'1',transform:'translateX(100px)'}))
  ]),
])
