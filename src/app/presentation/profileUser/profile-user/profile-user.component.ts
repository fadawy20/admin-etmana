import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpendailogService } from 'src/app/Services/opendailog.service';
import { ProfileService } from 'src/app/Services/profileUser/profile.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss'],
})
export class ProfileUserComponent implements OnInit {
  constructor(private _profileService: ProfileService, private _openDialog: OpendailogService, private _Router: Router) { }
  id!: number;
  ngOnInit(): void {
    this._profileService.observable.subscribe((data) => {
      this.id = data;
      // console.log(this.id);
      sessionStorage.setItem('customerID', JSON.stringify(this.id))

    });
  }

  setVisible(visible: boolean) {
    this._openDialog.setVisible(visible);
    // localStorage.setItem('visible', JSON.stringify(visible))
    // localStorage.setItem()

    this._Router.navigate(['/Dashboard/order/create-order/'], { state: { id: this.id } })
  }
}
