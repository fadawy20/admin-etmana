import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event, NavigationEnd, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class NavServiceService {

  public appDrawer: any;
    public currentUrl = new BehaviorSubject<string>("");
    constructor(private router: Router) {
      this.router.events.subscribe((event: Event) => {
          if (event instanceof NavigationEnd) {
              this.currentUrl.next(event.urlAfterRedirects);
          }
      });
  }

  public closeNav() {
      this.appDrawer.close();
  }

  public openNav() {
      this.appDrawer.open();
  }
}
