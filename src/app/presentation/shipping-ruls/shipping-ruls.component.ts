import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { finalize, map, Observable } from 'rxjs';
import { ExportsService } from 'src/app/Services/exports.service';
import { ShippingService } from 'src/app/Services/shipping.service';

@Component({
  selector: 'app-shipping-ruls',
  templateUrl: './shipping-ruls.component.html',
  styleUrls: ['./shipping-ruls.component.scss']
})
export class ShippingRulsComponent implements OnInit {
  display: boolean = false;
  paginationParams: any;
  loadingIndicator: boolean = false;
  length: number = 0;
  page: number = 0;
  editImageUrl: string = '';
  selectedMenu: any = '';
  tableHeader: any[] = [];
  pageSize: number = 50;
  pageNumber: number = 0;
  msgs: any[] = [];
  selectedItems: any[] = [];
  params: any
  totalItems: number = 0;
  data$: Observable<any>;
  allColumnFilter: any[] = [];
  searchValue!: string
  showFilterField!: boolean;
  filterOfNames: any[] = [
    'Name'
  ]
  filterField!: FormGroup
  constructor(
    private Router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _exportService: ExportsService,
    private _ShippingService: ShippingService,
    private fb: FormBuilder
  ) {
    this.params = new HttpParams()
    this.paginationParams = new HttpParams();
    this.filterField = this.fb.group({
      ['Name']: ['']
    })
    this.tableHeader = [
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'Rule Name' },
      { field: 'country', header: 'Associate Website' },
      { field: 'shippingFees', header: 'Shipping Fees' },
      { field: 'platform', header: 'Platform (Mobile/Web)' },
      { field: 'ruleOrdering', header: 'Rule ordering' },
      { field: 'cities', header: 'Cities' },
      { field: 'usageLimits', header: 'Usage Limit' },
      { field: 'date', header: 'Active Date' },
    ];
    this.data$ = this.getListShipping()
    // console.log('this is data$', this.data$.subscribe((res) => {
    //   console.log(res);

    // }));
    // this.getListShipping
  }
  createShipping() {
    this.Router.navigate(['/Dashboard/shipping/create-rule'])
  }
  // download export
  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  // Export
  handleBulkExportedData(value: any) {
    // console.log('this is value', value);

    let SelectedIds = value.map((item: any) => {
      return item.id;
    });
    let IDS: any = {
      ids: SelectedIds,
    };
    if (value.length === 0) {
      let EmptyArr: any = this.selectedItems;
      this._exportService
        .exportBulk(EmptyArr, 'admin/brands/export')
        .subscribe((data: any) => {
          // let dataPage = {
          //   page: this.pageNumber,
          //   size: this.pageSize,
          // };
          // this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
          this.download(data, data.type);
        });
    } else {
      this._exportService
        .exportBulk(SelectedIds, 'admin/brands/export')
        .subscribe((data: any) => {
          this.download(data, data.type);
          // this.selectedItems = [];
          // let dataPage = {
          //   page: this.pageNumber,
          //   size: this.pageSize,
          // };
          // this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
        });
    }
  }
  // get list orders
  getListShipping() {
    this.loadingIndicator = true;

    this.params = this.params.set('page', 1);
    this.params = this.params.set('per_page', 50);
    return this._ShippingService.get(this.params).pipe(
      map((shipping) => {
        this.length = shipping.meta.total;

        return shipping?.data?.map((ship: any) => {
          // console.log('ship', ship);

          return {
            id: ship?.id,
            name: ship?.name,
            // country_id: ship.country_id,
            country: ship?.country_id === 1 ? 'Egypt' : 'Saudi Arabia',
            shippingFees: ship?.shipping_fees,
            platform: ship?.platform.name,
            ruleOrdering: ship?.rule_ordering,
            cities: ship?.applied_on_all_cities === true ? 'All Cities' : "false",
            usageLimits: ship?.usage_limits?.name,
            date: `From ${this.datePipe.transform(ship?.date_from, 'd  MMM')} to ${this.datePipe.transform(ship?.date_to, 'd  MMM')}`,

          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }
  showFilterFieldFn(value: boolean) {
    this.showFilterField = value
  }
  resetForm() {
    this.filterField.reset()
  }
  checkSearchVal(value: string) {
    this.params = this.params.set('page', this.pageNumber);
    this.params = this.params.set('per_page', this.pageSize);
    this.params = this.params.set(`search_key`, value);

    this.data$ = this._ShippingService.getShippingBySearch(this.params).pipe(
      map((shipping) => {
        this.length = shipping.meta.total;
        return shipping?.data?.map((ship: any) => {
          return {
            id: ship?.id,
            name: ship?.name,
            country: ship?.country_id === 1 ? 'Egypt' : 'Saudi Arabia',
            shippingFees: ship?.shipping_fees,
            platform: ship?.platform.name,
            ruleOrdering: ship?.rule_ordering,
            cities: ship?.applied_on_all_cities === true ? 'All Cities' : "false",
            usageLimits: ship?.usage_limits?.name,
            date: `From ${this.datePipe.transform(ship?.date_from, 'd  MMM')} to ${this.datePipe.transform(ship?.date_to, 'd  MMM')}`,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );

  }

  search(value: string) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize,
    };

    if (value === '') {
      this.params = this.params.delete('search_key');
      this.handleShippingPageSize(data);
    } else {
      this.checkSearchVal(value);
    }
  }

  getFilterAction() {
    if (this.filterField.get('Name')?.value !== '') {
      this.params = this.params.set('page', this.pageNumber);
      this.params = this.params.set('per_page', this.pageSize);
      this.params = this.params.set('filters[name]', this.filterField.get('Name')?.value)
      this.loadingIndicator = true;
      this.handleShippingPageSize(this.params)
    }
    else {
      this.data$ = this.getListShipping()
    }
  }
  resetFormColumn() {
    this.filterField.reset()
    this.data$ = this.getListShipping()
  }
  //  handle page size of shipping
  handleShippingPageSize(value: any) {
    this.pageSize = value.size;
    this.pageNumber = value.page;
    this.params = this.params.set('page', this.pageNumber ? this.pageNumber : 1);
    this.params = this.params.set(
      'per_page',
      this.pageSize ? this.pageSize : 50
    );
    this.loadingIndicator = true;
    this.data$ = this._ShippingService.paginate(this.params).pipe(
      map((shipping) => {
        this.length = shipping.meta.total;
        return shipping?.data?.map((ship: any) => {
          return {
            id: ship?.id,
            name: ship?.name,
            country: ship?.country_id === 1 ? 'Egypt' : 'Saudi Arabia',
            shippingFees: ship?.shipping_fees,
            platform: ship?.platform.name,
            ruleOrdering: ship?.rule_ordering,
            cities: ship?.applied_on_all_cities === true ? 'All Cities' : "false",
            usageLimits: ship?.usage_limits?.name,
            date: `From ${this.datePipe.transform(ship?.date_from, 'd  MMM')} to ${this.datePipe.transform(ship?.date_to, 'd  MMM')}`,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  EditHandler(data: any) {
    this.Router.navigate(['Dashboard/shipping/edit-rule', data.id]);
  }
  deleteHandler(data: any) {
    this.confirmationService.confirm({
      message: 'do you want to delete this Shipping Rule ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._ShippingService.deleteShipping(data.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handleShippingPageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Shipping Rule is Deleted successfully',
          });
        });
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Rejected',
            detail: 'You have rejected',
          },
        ];
      },
    });
  }
  ngOnInit(): void {
  }

}
