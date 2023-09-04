import { RoleService } from './../../../Services/permissionRole/role.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SideBarService } from '../../services/side-bar.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  routes: any = this.sidebarservice.navItemsDashboard;
  routesRol = this.sidebarservice.navItemsDashboard;
  sidebarStatus = 'side';
  opened = true;
  position = 'start';
  contentMargin: number = 0;
  childrenComponent: any[] = [];

  constructor(
    public sidebarservice: SideBarService,
    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (JSON.parse(localStorage.getItem('user') || '').id == 1)
      this.routes = this.sidebarservice.navItemsDashboard;
    else {
      let permissions: any = localStorage.getItem('permissions');

      let arr: any = JSON.parse(permissions);
      arr = arr.map((data: any) => {
        return data.name;
      });

      for (let i = 0; i < this.routes.length; i++) {
        if (this.routes[i]?.children) {
          let x = [];
          for (let j = 0; j < this.routes[i].children.length; j++) {
            if (arr.includes(this.routes[i].children[j].namePermission))
              x.push(this.routes[i].children[j]);
          }
          if (x.length !== 0) {
            this.childrenComponent.push({
              displayName: this.routes[i].displayName,
              iconName: this.routes[i].iconName,
              children: x,
            });
          }
        } else {
          if (arr.includes(this.routes[i].namePermission))
            this.childrenComponent.push(this.routes[i]);
        }
      }
      this.routes = this.childrenComponent;
    }

    this.contentMargin = 1;
  }

  ngOnInit(): void {
    this.checkMediaQuery();   
    // console.log(this.router.url);
    this.router.events.subscribe((event) => { event instanceof NavigationEnd ? event.url=='/Dashboard/credit/create-credit'? this.handleClikedItem(false):null: null

     })     
  }

  
  checkMediaQuery() {
    this.breakpointObserver
      .observe(['(max-width: 900px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.opened = false;
          this.sidebarStatus = 'over';
        } else {
          this.opened = true;
          this.sidebarStatus = 'side';
        }
      });
  }
  handleSideBarToggle(data: boolean) {
    this.opened = !this.opened;
    if (!this.opened) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 250;
    }
  }
  handleClikedItem(flag: boolean) {
    this.opened = flag;
    // this.contentMargin = 250;
    if (!this.opened) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 250;
    }

  }
  CloseSdieNav() {
    this.opened = !this.opened;
    if (!this.opened) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 250;
    }
  }
  openMenue(flag: any) {
    this.opened = true;
    this.contentMargin = 250;
  }
}
