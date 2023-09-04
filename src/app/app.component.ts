import { Component } from '@angular/core';
import { CurrentLocationService } from './Services/current-location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'etmana';
  constructor(private _location: CurrentLocationService)
  {
    if (
      !localStorage.getItem('Country') ||
      localStorage.getItem('Country') == ''
    ) {
      this._location.getLocation().subscribe((res: any) => {
        localStorage.setItem('Country', (res.country as string).toLowerCase());
      });
    }
  }
}
