import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-performing-seller',
  templateUrl: './performing-seller.component.html',
  styleUrls: ['./performing-seller.component.scss'],
})
export class PerformingSellerComponent implements OnInit {
  @Input() sellers: any;
  currency: any
  constructor(private _authService: AuthService) {
    this.currency = this._authService.currency
  }
  ngOnInit(): void { }
}
