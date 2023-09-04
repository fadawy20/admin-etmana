import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CreditStoreService } from 'src/app/Services/credit-store.service';
import { ProfileService } from 'src/app/Services/profileUser/profile.service';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss'],
})
export class CreditComponent implements OnInit {
  // @Input() loadingIndicator: boolean = false;
  currency: any
  showCreditTable: boolean = true;
  showAllTransaction: boolean = false;
  // loading: boolean = true;
  crediteData: any[] = [];
  etamanaCreditData: any[] = []
  tableHeaders: any[] = [];
  transactionTableHeaders: any[] = []
  data: any;
  totalPrice: any;
  totalItems: any;
  dataLength: number = 0;
  showEmtpPage: boolean = false;
  id!: number;
  loadingIndicator: boolean = false;
  constructor(
    private _Router: Router,
    private _authService: AuthService,
    private ActivatedDRoute: ActivatedRoute,
    private _profileService: ProfileService,
    // private _crediteEtmana: CrediteEtmanaService,
    private _messageService: MessageService, private _ActivatedRoute: ActivatedRoute, private _CreditStore: CreditStoreService) {
    this.currency = this._authService.currency

    this.id = this._ActivatedRoute.snapshot.params['id']
    this._profileService.observable.next(
      Number(this.ActivatedDRoute.snapshot.paramMap.get('id'))
    );
    console.log(this.id);

    this.getEtmanaCredit()


    this.getCreditData();
    this.tableHeaders = [
      { field: 'type', header: 'ID' },
      { field: 'created_at', header: 'Transaction type' },
      { field: 'amount', header: 'Amount' },
      { field: 'including_shipping', header: 'Including Shipping' },
      { field: 'items_number', header: 'Items' },
      { field: 'create_date', header: 'Creation date' },
      { field: 'end_date', header: 'Expiry date' },
    ];
    this.transactionTableHeaders = [
      { field: 'type', header: 'ID' },
      { field: 'created_at', header: 'Transaction type' },
      { field: 'amount', header: 'Amount' },
      { field: 'including_shipping', header: 'Status' },
      { field: 'create_date', header: 'Creation date' },
      { field: 'end_date', header: 'Expiry date' },
    ];
  }



  ngOnInit(): void {
    this.id = Number(this.ActivatedDRoute.snapshot.paramMap.get('id'))
    // this.getEtmanaCredit()
  }

  getCreditData() {
    // this._crediteEtmana.getCLientCredit().subscribe((res: any) => {
    //   this.totalItems = res.data.length;
    //   this.totalPrice = res.data.total;
    //   //this.dataLength = res.data.store_credits.length
    //   if (res.data.store_credits.length) {
    //     this.showEmtpPage = false;
    //   } else {
    //     this.showEmtpPage = true;
    //   }
    //   this.crediteData = res.data.store_credits.map((data: any) => {
    //     let formatDateCreatedAt = new Date(data.created_at);
    //     let formatDateEnd = new Date(data.end_date);
    //     moment(formatDateCreatedAt).format('ll');
    //     moment(formatDateEnd).format('ll');
    //     return {
    //       type: data.type,
    //       created_at:
    //         'Place On' + ' ' + moment(formatDateCreatedAt).format('ll'),
    //       end_date: 'Expire On' + ' ' + moment(formatDateEnd).format('ll'),
    //       amount: 'EGP' + ' ' + data.amount,
    //     };
    //   });
    // });
  }
  getEtmanaCredit() {
    this.loadingIndicator = true
    this._CreditStore.getEtmanaCredit(this.id).subscribe((res) => {
      this.etamanaCreditData = res.data;
      this.loadingIndicator = false

      console.log('res', res);
      console.log('this.etamanaCreditData', this.etamanaCreditData);
    })
    // this.loadingIndicator = false
  }

  showCreditDataTable() {
    this.showCreditTable = true;
    this.showAllTransaction = false
  }
  showAllTransactionTable() {
    this.showCreditTable = false;
    this.showAllTransaction = true
  }

  // navigateToAllTransactions() {
  //   this._Router.navigate([`all-transaction/${this.id}`])
  // }
}
