import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentLocationService } from 'src/app/Services/current-location.service';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.scss'],
})
export class HeaderDashboardComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter();

  selectedMenu: any = '';
  items: any[] = [];
  isExpanded: boolean = true;
  selectedFlag: any;
  user: any = localStorage.getItem('user');
  username: string = '';
  constructor(
    private router: Router,
    private _location: CurrentLocationService
  ) {

    // window.addEventListener('storage', (event) => {
    //   console.log('Local storage event:', event);
    //   // Do something with the event data
    // });


    this.username =
      JSON.parse(this.user).first_name + ' ' + JSON.parse(this.user).last_name;
    if (
      !localStorage.getItem('Country') ||
      localStorage.getItem('Country') == ''
    ) {
      this._location.getLocation().subscribe((res: any) => {
        localStorage.setItem('Country', (res.country as string).toLowerCase()); // sa , eg
        // that when you selected egypt and i logged out that flag = 'sa' and currency is still egy this is not correct it must flag is egypt country
        this.selectedFlag =
        localStorage.getItem('Country') === 'eg' ? 'eg' : 'sa';
      });
    }
    else {
      this.selectedFlag =
        localStorage.getItem('Country') === 'eg' ? 'eg' : 'sa';
    }
    this.items = [
      { label: 'Account Setting', icon: 'pi pi-fw pi-cog' },
      // { label: 'Payment Method', icon: 'pi pi-fw pi-money-bill' },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          localStorage.clear();
          this.router.navigateByUrl('login');
        },
      },
    ];

  }

  ngOnInit(): void { }

  selectFlag(falg: any) {
    localStorage.setItem('Country', falg);
    window.location.reload();
  }

  CloseSdieNav() {
    this.isExpanded = !this.isExpanded;
    this.toggleSideNav.emit(this.isExpanded);
  }
}
