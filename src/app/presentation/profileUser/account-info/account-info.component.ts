import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ProfileService } from 'src/app/Services/profileUser/profile.service';

export enum ControlKeys {
  first_name = 'first_name',
  last_name = 'last_name',
  email = 'email',
  phone = 'phone',
  code = 'code',
  current_password = 'current_password',
  password = 'new_password_confirmation',
  new_password = 'new_password',
}

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit {
  profileData: any;
  loader: boolean = true
  profileForm!: FormGroup;
  profile!: FormGroup;
  openDialog: boolean = false;
  countries!: any[];
  code: boolean = false;
  submited: boolean = false;
  changePassword: boolean = false;
  Loading: boolean = false;
  checkLang: any;
  country: any;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private _profileService: ProfileService,
    private _activateRoute: ActivatedRoute
  ) {
    setTimeout(() => {
      this.loader = false
    }, 800);

    this._profileService.observable.next(
      Number(this._activateRoute.snapshot.paramMap.get('id'))
    );
    this.country = localStorage.getItem('Country');

    this.profile = this.fb.group({
      [ControlKeys.first_name]: ['', [Validators.required]],
      [ControlKeys.last_name]: ['', [Validators.required]],
      [ControlKeys.phone]: ['', [Validators.required]],
      [ControlKeys.code]: ['', [Validators.required]],
      [ControlKeys.email]: [''],

    });
    this.profile.valueChanges.subscribe((changes: any) => {
      if (isNaN(changes.phone)) {
        this.profile.patchValue({
          phone: changes.phone.replace(/[a-zA-Z!@#$%^&*]/g, ''),
        });
      }
    });
    this.profileForm = this.fb.group(
      {
        // [ControlKeys.password]: ['', [Validators.required]],
        [ControlKeys.current_password]: ['', [Validators.required]],
        [ControlKeys.new_password]: ['', [Validators.required]],
      }
      // { validators: this.passwordConfirming }
    );
    this.getClientData();
  }

  getClientData() {
    this._profileService
      .getCLientProfile(Number(this._activateRoute.snapshot.paramMap.get('id')))
      .subscribe((res: any) => {
        this.code = res.data.formatted_phone.code === '+2' ? true : false;
        this.profile.get(ControlKeys.code)?.setValue({
          code: this.code ? 'egypt' : 'KSA',
          img: this.code
            ? 'assets/images/egypt.png'
            : 'assets/images/download (3).png',
          name: res.data.formatted_phone.code,
        });
        this.profile.get(ControlKeys.first_name)?.setValue(res.data.first_name);
        this.profile.get(ControlKeys.last_name)?.setValue(res.data.last_name);
        this.profile
          .get(ControlKeys.phone)
          ?.setValue(res.data.formatted_phone.number);
        this.profile.get(ControlKeys.email)?.setValue(res.data.email);
      });
  }

  changePasswordFlag() {
    this.changePassword = true;
  }
  closeChangePassword() {
    this.changePassword = false;
  }
  saveProfile() {
    if (this.profile.invalid) {
      return;
    }
    this.Loading = true;
    let info = {
      first_name: this.profile.get(ControlKeys.first_name)?.value,
      last_name: this.profile.get(ControlKeys.last_name)?.value,
      email: this.profile.get(ControlKeys.email)?.value,
      phone:
        this.country == 'eg'
          ? '+2' + this.profile.get(ControlKeys.phone)?.value
          : '+966' + this.profile.get(ControlKeys.phone)?.value,
          // password : this.profileForm.get('new_password')?.value
    };
    this._profileService
      .saveUpdatedProfile(
        info,
        Number(this._activateRoute.snapshot.paramMap.get('id'))
      )
      .pipe(finalize(() => (this.Loading = false)))
      .subscribe((res) => {
        this.getClientData();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated Profile',
          detail: 'Your Info is saved successfully',
        });
      });
  }

  setPassword(){
    if (this.profile.invalid) {
      return;
    }
    this.Loading = true;
    let info = {
      first_name: this.profile.get(ControlKeys.first_name)?.value,
      last_name: this.profile.get(ControlKeys.last_name)?.value,
      email: this.profile.get(ControlKeys.email)?.value,
      phone:
        this.country == 'eg'
          ? '+2' + this.profile.get(ControlKeys.phone)?.value
          : '+966' + this.profile.get(ControlKeys.phone)?.value,
          password : this.profileForm.get('new_password')?.value
    };
    this._profileService
      .saveUpdatedProfile(
        info,
        Number(this._activateRoute.snapshot.paramMap.get('id'))
      )
      .pipe(finalize(() => (this.Loading = false)))
      .subscribe((res) => {
        this.getClientData();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated Profile',
          detail: 'Your Info is saved successfully',
        });
      });
  }

  setNewPassword() {
    this.submited = true;
    let obj = {
      current_password: this.profileForm.get('current_password')?.value,
      new_password: this.profileForm.get('new_password')?.value,
      new_password_confirmation: this.profileForm.get('new_password')?.value,
    };
    if (this.profileForm.valid) {
      this._profileService.changePassword(obj).subscribe((res) => {
        if (res.message) {
          this.changePassword = false;
          this.profileForm.reset();
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Updated Profile',
            detail: 'Your new Password is saved successfully',
          });
        }
      });
    }
  }
  ngOnInit(): void { }
}
