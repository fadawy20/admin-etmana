import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenHaederComponent } from 'src/app/shared/components/screen-haeder/screen-haeder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Observable, Subscription, map, of } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerService } from 'src/app/Services/seller.service';
import { PaymentsService } from 'src/app/Services/payments.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  subscription = new Subscription();
  paginationParams = new HttpParams();
  filterPaymentsParams = new HttpParams();

  loadingIndicator: boolean = false;
  showValidateBtn: boolean = false;
  selectedItems = [];
  length: number = 0;
  page: number = 0;
  selectStatus: any;
  tableHeader = [
    // { field: 'serial_number', header: 'Serial Number' },
    { field: 'order_id', header: 'Order Number' },
    { field: 'create_date', header: 'Date' },
    { field: 'item_name', header: 'Item Name' },
    { field: 'item_sku', header: 'Sku' },
    { field: 'status', header: 'Status' },
    { field: 'sale_price', header: 'Price' },
    { field: 'cost', header: 'Cost' },
    { field: 'margin', header: 'Commission Percentage' },
    { field: 'margin', header: 'Commission' },
    { field: 'total_revenue', header: 'Total Revenue' },
    { field: 'validated', header: 'Is Validated' },
  ];
  payments = {
    data: [
      {
        id: 1,
        serial_number: 1254,
        create_date: '16/9/1998',
        order_id: 1235,
        item_name: 'Test Bag',
        item_sku: 'KK1245',
        status: 'Delivered',
        sale_price: 125,
        cost: 100,
        margin: '7%',
        total_revenue: 1555,
        validated: 'true',
      },
      {
        id: 2,
        serial_number: 1254,
        create_date: '16/9/1998',
        order_id: 1235,
        item_name: 'Test Bag',
        item_sku: 'KK1245',
        status: 'Delivered',
        sale_price: 125,
        cost: 100,
        margin: '7%',
        total_revenue: 1555,
        validated: 'true',
      },
      {
        id: 3,
        serial_number: 1254,
        create_date: '16/9/1998',
        order_id: 1235,
        item_name: 'Test Bag',
        item_sku: 'KK1245',
        status: 'Delivered',
        sale_price: 125,
        cost: 100,
        margin: '7%',
        total_revenue: 1555,
        validated: 'false',
      },
    ],
    links: {
      first: 'https://api-staging.etmana.com/api/admin/sellers?page=1',
      last: 'https://api-staging.etmana.com/api/admin/sellers?page=2',
      prev: null,
      next: 'https://api-staging.etmana.com/api/admin/sellers?page=2',
    },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 2,
      links: [
        {
          url: null,
          label: '&laquo; Previous',
          active: false,
        },
        {
          url: 'https://api-staging.etmana.com/api/admin/sellers?page=1',
          label: '1',
          active: true,
        },
        {
          url: 'https://api-staging.etmana.com/api/admin/sellers?page=2',
          label: '2',
          active: false,
        },
        {
          url: 'https://api-staging.etmana.com/api/admin/sellers?page=2',
          label: 'Next &raquo;',
          active: false,
        },
      ],
      path: 'https://api-staging.etmana.com/api/admin/sellers',
      per_page: 50,
      to: 50,
      total: 100,
    },
  };
  filterField = this._FormBuilder.group({
    ['from_date']: [''],
    ['to_date']: [''],
    ['is_validate']: [],
    ['seller_id']: [],
  });
  data$: Observable<any[]> = of(this.payments.data);
  sellers = [];
  isValidatedValue = [
    { value: false, name: 'false' },
    { value: true, name: 'true' },
  ];

  get fromDate(){
    return this.filterField.get('from_date');
  }
  get toDate(){
    return this.filterField.get('to_date');
  }
  get isValidated(){
    return this.filterField.get('is_validate');
  }
  get sellerId(){
    return this.filterField.get('seller_id');
  }

  constructor(
    private _SellerService: SellerService,
    private _PaymentsService: PaymentsService,
    private _FormBuilder:FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllSellers();
    this.getAllPayments();
  }

  // get all Sellers
  // get() {
  //   this.loadingIndicator = true;
  //   this.paginationParams = this.paginationParams.set('page', 1);
  //   this.paginationParams = this.paginationParams.set('per_page', 50);

  //   return this._SellServices.get(this.paginationParams).pipe(
  //     map((Seller) => {
  //       console.log(this.responseData, 'This is seller');

  //       this.length = this.responseData.meta.total;
  //       return Seller?.data?.map((seller: any) => {
  //         // console.log(seller, 'This is seller 2');

  //         // Seller.date_modified =this.datePipe.transform(Date(),)
  //         return {
  //           id: seller.id,
  //           name_en: seller?.seller_info?.name_en,
  //           name_ar: seller?.seller_info?.name_ar,
  //           // commercial_name_en: seller.seller_info.commercial_name_en,
  //           date_modified: this.datePipe.transform(
  //             seller.date_modified,
  //             'E  d  MMM  h:mm'
  //           ),
  //           status: seller.is_active,
  //         };
  //       });
  //     }),
  //     finalize(() => {
  //       this.loadingIndicator = false;
  //     })
  //   );
  // }

  getAllSellers() {
    this.loadingIndicator = false;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this.subscription.add(
      this._SellerService.get(this.paginationParams).subscribe((res) => {
        this.sellers = res?.data;
        this.loadingIndicator = false;
      })
    );
  }

  getAllPayments() {
    this.loadingIndicator = false;
    this.filterPaymentsParams = this.filterPaymentsParams.set('page', 1);
    this.filterPaymentsParams = this.filterPaymentsParams.set('per_page', 50);
    this.filterPaymentsParams = this.filterPaymentsParams.set('seller_id ', this.sellerId?.value || '');
    this.filterPaymentsParams = this.filterPaymentsParams.set('from_date ', this.fromDate?.value || '');
    this.filterPaymentsParams = this.filterPaymentsParams.set('to_date ', this.toDate?.value || '');
    this.filterPaymentsParams = this.filterPaymentsParams.set('is_validate  ', this.isValidated?.value || '');

    console.log("filterField" , this.filterField.value);

    this.subscription.add(
      this._PaymentsService.getPayments(this.filterPaymentsParams).subscribe((res) => {
        this.payments = res?.data;
        this.loadingIndicator = false;
      })
    );
  }

  getFilterAction() {
    this.getAllPayments()
    console.log("filterField" , this.filterField.value);

  }

  resetFormColumn() {}

  test(selectedItem: any) {
    console.log('a;sdlkasd');

    this.selectedItems = selectedItem;
    console.log(
      'selectedItems',
      selectedItem.map((item: { validated: any }) => item.validated)
    );
    this.showValidateBtn = selectedItem
      .map((item: { validated: any }) => item.validated)
      .find(false)
      ? true
      : false;
  }
  validateItemsSeller() {
    console.log('this.selectedItems', this.selectedItems);
  }

  itemsSelected(selectedItem: any) {
    this.selectedItems = selectedItem;
    if (this.selectedItems.length) {
      this.showValidateBtn = this.selectedItems
        .map((item: { validated: any }) => item.validated)
        .includes(true)
        ? false
        : true;
    } else {
      this.showValidateBtn = false
    }
  }

  setIsValideValue(event:any){

    this.isValidated?.setValue(event?.value?.value)
  }

  setSellerIdValue(event:any){
    console.log(event?.value?.id);

    this.sellerId?.setValue(event?.value?.id)
  }
}
