import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from './../services/auth-service.service';

enum controlKeys {
  password = 'password',
  email = 'email',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loadingIndicator: boolean = false;
  loginForm: FormGroup;
  submitted: boolean | undefined;

  constructor(
    private router: Router,
    private _AuthServiceService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      [controlKeys.email]: ['', [Validators.required, Validators.email]],
      [controlKeys.password]: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  Login() {
    this.loadingIndicator = true;
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loadingIndicator = false;
      return;
    }
    let loginData = {
      email: this.loginForm.value[controlKeys.email],
      password: this.loginForm.value[controlKeys.password],
    };
    this._AuthServiceService
      .login(loginData)
      .pipe(
        finalize(() => {
          this.loadingIndicator = false;
          this._AuthServiceService.detectCountry()
        })
      )
      .subscribe((res) => {
        this._AuthServiceService.saveUserData('user', res.data),
          this._AuthServiceService.saveUserData('permissions', res.permissions),
          this._AuthServiceService.setToken(res.token);
        this.router.navigateByUrl('/Dashboard');
      });
  }
}
