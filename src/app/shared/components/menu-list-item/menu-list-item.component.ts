import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { NavServiceService } from 'src/app/core/services/nav.service.service';
@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  expanded: boolean = true;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number = 0;
  @Input() opened: boolean = true
  @Output() onItemClick: EventEmitter<any> = new EventEmitter();

  parentListName: any

  constructor(public navService: NavServiceService,
    public authService: AuthService,
    public router: Router) {
    // if (this.depth === undefined) {
    //   this.depth = 0;
    // }
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }
  onItemSelected(item: any) {
    this.parentListName = item.parent
    // if (!item.children || !item.children.length) {
    //   this.router.navigate([item.route]);
    // }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    this.opened = true
    this.onItemClick.emit(this.opened)
  }

  expandedCheck(str: string, route: string) {
    return str.includes(route);
  }

}
