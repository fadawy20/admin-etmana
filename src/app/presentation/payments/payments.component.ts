import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Observable, Subscription, of } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerService } from 'src/app/Services/seller.service';
import { PaymentsService } from 'src/app/Services/payments.service';
import { HttpParams } from '@angular/common/http';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  maxDate = new Date().toISOString().slice(0, 10);
  @ViewChild('dropdownSellerId') dropdownSellerId!: Dropdown;
  @ViewChild('dropdownIsValidated') dropdownIsValidated!: Dropdown;

  selectedSellerId: any;
  selectedIsValidated: any;

  subscription = new Subscription();
  paginationParams = new HttpParams();
  filterPaymentsParams = new HttpParams();

  loadingIndicator: boolean = false;
  showValidateBtn: boolean = false;
  selectedItems = [];
  length: number = 5;
  page: number = 0;
  perPage:number = 5;
  selectStatus: any;
  tableHeader = [
    { field: 'seller_name', header: 'Seller Name' },
    { field: 'serial_number', header: 'Order Number' },
    { field: 'created_at', header: 'Date' },
    { field: 'item_name', header: 'Item Name' },
    { field: 'sku', header: 'Sku' },
    { field: 'status', header: 'Status' },
    { field: 'original_price', header: 'Original Price' },
    { field: 'price', header: 'Price' },
    { field: 'cost_price', header: 'Cost' },
    { field: 'commission_percentage', header: 'Commission Percentage' },
    { field: 'commission_amount', header: 'Commission' },
    { field: 'total_revenue', header: 'Total Revenue' },
    { field: 'is_validated', header: 'Is Validated' },
  ];
  payments = [];
  filterField = this._FormBuilder.group({
    ['from_date']: [''],
    ['to_date']: [''],
    ['is_validate']: [],
    ['seller_id']: [],
  });
  data$!: Observable<any[]>;

  sellers = [];
  isValidatedValue = [
    { value: 0, name: 'false' },
    { value: 1, name: 'true' },
  ];

  get fromDate() {
    return this.filterField.get('from_date');
  }
  get toDate() {
    return this.filterField.get('to_date');
  }
  get isValidated() {
    return this.filterField.get('is_validate');
  }
  get sellerId() {
    return this.filterField.get('seller_id');
  }

  constructor(
    private _SellerService: SellerService,
    private _PaymentsService: PaymentsService,
    private _FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllSellers();
    this.getAllPayments();
  }

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
    this.filterPaymentsParams = this.filterPaymentsParams.set('page', this.page);
    this.filterPaymentsParams = this.filterPaymentsParams.set('per_page', this.perPage);
    this.filterPaymentsParams = this.filterPaymentsParams.set(
      'filters[seller_id]',
      this.sellerId?.value || ''
    );
    this.filterPaymentsParams = this.filterPaymentsParams.set(
      'filters[order_date_from]',
      this.fromDate?.value || ''
    );
    this.filterPaymentsParams = this.filterPaymentsParams.set(
      'filters[order_date_to]',
      this.toDate?.value || ''
    );
    this.filterPaymentsParams = this.filterPaymentsParams.set(
      'filters[is_validate]',
      this.isValidated?.value || ''
    );

    console.log('filterField', this.filterField.value);

    this.subscription.add(
      this._PaymentsService
        .getPayments(this.filterPaymentsParams)
        .subscribe((res) => {
          this.payments = res?.data;
          this.length = res.meta.total;
          const updatedArray = this.payments.map((object: any) => {
            if (object.is_validated === 0) {
              return { ...object, is_validated: 'false' };
            } else {
              return { ...object, is_validated: 'true' };
            }
          });
          console.log(updatedArray);

          this.data$ = of(updatedArray);
          this.loadingIndicator = false;
        })
    );
  }

  validateItemList() {
    console.log('this.selectedItems', this.selectedItems);

    const shipmentsIds = this.selectedItems.map((item:any) => item?.id)
    this.subscription.add(
      this._PaymentsService
        .validateItemList({ ids: shipmentsIds})
        .subscribe(() => {
          this.getAllPayments();
          this.showValidateBtn = false;
        })
    );
  }

  getFilterAction() {
    this.getAllPayments();
    console.log('filterField', this.filterField.value);
  }

  resetFormColumn() {
    this.dropdownSellerId.resetFilter();

    this.selectedSellerId = null; // Reset the selected option to null
    this.selectedIsValidated = null; // Reset the selected option to null
    this.filterField.reset();
    this.getAllPayments();
  }

  itemsSelected(selectedItem: any) {
    this.selectedItems = selectedItem;
    if (this.selectedItems.length) {
      this.showValidateBtn = this.selectedItems
        .map((item: { is_validated: any }) => item.is_validated)
        .includes("true")
        ? false
        : true;
    } else {
      this.showValidateBtn = false;
    }
  }

  paginationHandler(value:any){
    console.log("paginationHandler" , value);
    this.page = value?.page;
    this.perPage = value?.size;
    this.getAllPayments()
  }

  setIsValideValue(event: any) {
    this.isValidated?.setValue(event?.value?.value);
    console.log('this.isValidated', this.selectedIsValidated);
  }

  setSellerIdValue(event: any) {
    console.log(event?.value?.id);

    this.sellerId?.setValue(event?.value?.id);
  }
}
