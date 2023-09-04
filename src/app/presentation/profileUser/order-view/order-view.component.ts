import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent implements OnInit {
  details: any;
  formattedDate: any;
  invoiceLink: any;
  currency: any

  constructor(private _authService: AuthService) // private _OrdersService: OrdersService,
  {
    this.currency = this._authService.currency
  }

  ngOnInit(): void { }

  viewOrderDetails(id: any) {
    // this._OrdersService.getOrderDetails(id).subscribe((res: any) => {
    //   this.invoiceLink = res.data.invoice;
    //   this.details = res.data;
    //   (this.formattedDate = this.datePipe.transform(
    //     res.data.created_at,
    //     'E  d  MMM  '
    //   )),
    //     (this.step = 2);
    // });
  }
}
