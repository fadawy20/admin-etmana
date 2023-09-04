import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit, OnChanges {
  data: any;
  @Input() allSales: any;
  chartOptions: any;
  salesData: any[] = [];
  // currencyCountr: any
  constructor(private _authService: AuthService) {

  }

  ngOnChanges(changes: any): void {
    this.salesData = [];
    if (changes.allSales.previousValue) {
      this.ngOnInit();
    }
  }
  currency: any
  ngOnInit(): void {
    // console.log('country', localStorage.getItem('Country'));
    this.currency = this._authService.currency

    // console.log('data', this.data);

    let salesTop = this.allSales.top_sales;

    let rate: any[] = [];

    for (const sal in salesTop) {
      salesTop[sal].percentage = salesTop[sal].percentage.toFixed(1);
      this.salesData.push(salesTop[sal]);
      rate.push(salesTop[sal].percentage);
    }

    this.data = {
      datasets: [
        {
          data: rate,
          backgroundColor: ['#5F2D79', '#0E1740', '#00A599', '#FAB118'],
          hoverBackgroundColor: ['#7a4099', '#232d5a', '#23cfc2', '#f3bc4a'],
        },
      ],
    };
  }
}
