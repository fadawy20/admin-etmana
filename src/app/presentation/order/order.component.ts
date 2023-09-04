import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { ExportsService } from 'src/app/Services/exports.service';
import { OrderService } from 'src/app/Services/order.service';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  display: boolean = false;
  paginationParams: any;
  loadingIndicator: boolean = false;
  length: number = 0;
  page: number = 0;
  tableHeader: any[] = [];
  data$: Observable<any>;
  params: any;
  totalItems: number = 0;
  oerders: any[] = [];
  pageSize?: number;
  pageNumber?: number;
  selectedOrders: any[] = [];
  showTextHeader: any;
  ordersLength: any[] = [];
  status: any[] = [];
  cityFilter: any[] = [];
  purchasePoint: any[] = [];
  paymentMethod: any[] = [];
  countryId = localStorage.getItem('Country') === 'eg' ? 1 : 2;
  selectStatus: any;
  allColumnFilter: any[] = [];
  searchValue!: string;
  showFilterField!: boolean;
  filterOfNames: any[] = ['title_ar', 'title_en', 'code'];
  filterField!: FormGroup;
  orderCreatedAt: any

  unsubscribe: Subscription[] = [];
  constructor(
    private _Router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _orderService: OrderService,
    private fb: FormBuilder,
    private _exportService: ExportsService,
    public authService: AuthService
  ) {
    // const format = 'E d MMM h:mm a'; // 12-hour format with AM/PM
    // // const format = 'E d MMM HH:mm'; // 24-hour format
    // this.orderCreatedAt = this.datePipe.transform(new Date(), format);
    // console.log('this.orderCreatedAt', this.orderCreatedAt);

    this.params = new HttpParams();
    let sub = this._orderService.getCities(this.countryId).subscribe((res) => {
      this.cityFilter = res.data;
    });
    this.unsubscribe.push(sub);
    let sub1 = this._orderService.getPaymentMethod().subscribe((res) => {
      this.paymentMethod = res.data;
    });
    this.unsubscribe.push(sub1);
    this.tableHeader = [
      { field: 'serial_number', header: 'Id' },
      { field: 'refund_status', header: 'Refund Status' },
      { field: 'include_shipping', header: 'Include Shipping' },
      { field: 'purchase_point', header: 'Purchase Point' },
      { field: 'customerName', header: 'Customer Name' },
      { field: 'products', header: 'Products' },
      { field: 'grandTotal', header: 'Grand Total' },
      { field: 'fees', header: 'Fees' },
      { field: 'Status', header: 'Status' },
      { field: 'country', header: 'Associate WebSite' },
      { field: 'Governrate', header: 'City' },
      { field: 'PhoneNumber', header: 'Phone Num' },
      { field: 'PaymentInfo', header: 'Payment Info' },
      { field: 'created_at', header: 'Creation Date' },
      { field: 'view', header: 'View' },
    ];
    this.status = [
      { id: 3, name: 'Pending' },
      { id: 4, name: 'Validated' },
      { id: 5, name: 'Pending Seller Confirmation' },
      { id: 6, name: 'Ready To Ship' },
      { id: 7, name: 'Out For Delivery' },
      { id: 8, name: 'Partially Delivered ' },
      { id: 9, name: 'Logistics Issue' },
      { id: 10, name: 'Seller Issue' },
      { id: 11, name: 'Customer Isseu' },
      { id: 12, name: 'Delivered' },
      { id: 13, name: 'Return Request' },
      { id: 14, name: 'Out For Return' },
      { id: 15, name: 'Partially Returned' },
      { id: 16, name: 'Returned' },
      { id: 17, name: 'Within Rto' },
      { id: 18, name: 'Rto' },
      { id: 19, name: 'Complete' },
      { id: 20, name: 'Canceled' },
      { id: 21, name: 'Closed' },
      { id: 22, name: 'Complete Partial Refund' },
    ];
    this.purchasePoint = [
      { id: 1, name: 'Web View' },
      { id: 2, name: 'Mobile View' },
      { id: 3, name: 'Mobile App' },
      { id: 4, name: 'Admin Panel' },
      { id: 5, name: 'All' },
    ];

    this.filterField = this.fb.group({
      ['name']: [''],
      ['phone']: [''],
      ['status']: [''],
      ['shipping_fees_from']: [''],
      ['shipping_fees_to']: [''],
      ['purchase_point']: [''],
      ['city']: [''],
      ['payment_method']: [''],
      ['created_from']: [''],
      ['created_to']: [''],
      ['grand_total_from']: [''],
      ['grand_total_to']: [''],
    });
    this.data$ = this.getListOrders();
    console.log(this.data$.subscribe((res) => {
      console.log(res);
    }));

  }
  format: any;
  ngOnInit(): void {
    this.format = 'E d MMM h:mm a';
  }
  // navigation to crate order
  CreateOrder() {
    this._Router.navigate(['Dashboard/order/create-order']);
  }

  goToDetalis(orderData: any) {
    this._Router.navigate(['Dashboard/order/view-order', orderData.id]);
  }

  // get list orders
  getListOrders() {
    this.loadingIndicator = true;

    this.params = this.params.set('page', 1);
    this.params = this.params.set('per_page', 50);
    // this.pageNumber = 1;
    // this.pageSize = 5;
    return this._orderService.getListOrders(this.params).pipe(
      map((Orders) => {
        this.totalItems = Orders.meta.total;
        // console.log(this.totalItems);


        return Orders?.data?.map((Order: any) => {
          return {
            id: Order?.id,
            refund_status: Order?.refunded_status,
            include_shipping: Order?.delivery_price,
            serial_number:
              Order?.serial_number !== null ? Order?.serial_number : '-',
            country: Order?.shipping_address?.country?.name,
            purchase_point: Order?.purchase_point?.label,
            customerName:
              Order?.client?.first_name + ' ' + Order?.client?.last_name,
            length: Order?.total_requested_quantity,
            grandTotal: Order?.grand_total,
            fees: Order?.delivery_price,
            Status: Order?.status?.label,
            Governrate: Order?.shipping_address?.governorate?.name,
            PhoneNumber: Order?.client?.phone,
            PaymentInfo: Order?.payment_info,
            created_at: this.datePipe.transform(
              Order?.created_at,
              'E  d  MMM  h:mm a'
            ),
          };
        });

      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );

  }

  exportData() {
    let value: any[] = [];
    let SelectedIds = this.oerders.map((item: any) => {
      return item.id;
    });
    let IDS: any = {
      ids: SelectedIds,
    };
    if (value.length === 0) {
      this._exportService
        .exportGlobal(SelectedIds, 'admin/orders/export', this.params)
        .subscribe((data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
          this.download(data, data.type);
        });
    } else {
      this._exportService
        .exportGlobal(SelectedIds, 'admin/orders/export', this.params)
        .subscribe((data: any) => {
          this.download(data, data.type);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
        });
    }
  }

  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  openNewTab(rowData: any) {
    console.log(rowData, 'This is row data on new tab');
    const newTabUrl = `/Dashboard/order/view-order/${rowData.id}`;
    window.open(newTabUrl, '_blank');

  }

  showFilterFieldFn(value: boolean) {
    this.showFilterField = value;
  }
  resetForm() {
    this.filterField.reset();
  }
  checkSearchVal(value: string) {
    this.loadingIndicator = true;
    this.data$ = this._orderService.getOrdersBySearch(value).pipe(
      map((Orders) => {
        this.totalItems = Orders.meta.total;
        return Orders?.data?.map((Order: any) => {
          return {

            id: Order?.id,
            serial_number:
              Order?.serial_number !== null ? Order?.serial_number : '-',
            country: Order?.shipping_address?.country?.name,
            purchase_point: Order?.purchase_point?.label,
            customerName:
              Order?.client?.first_name + ' ' + Order?.client?.last_name,
            length: Order?.total_requested_quantity,
            grandTotal: Order?.grand_total,
            fees: Order?.delivery_price,
            Status: Order?.status?.label,
            Governrate: Order?.shipping_address?.governorate?.name,
            PhoneNumber: Order?.client?.phone,
            PaymentInfo: Order?.payment_info,
            created_at: this.datePipe.transform(
              Order?.created_at,
              'E  d  MMM  h:mm'
            ),
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
      this.handleOrdersPageSize(data);
    } else {
      this.pageNumber = 1;
      this.pageSize = 5;
      this.params = this.params.set(`search_key`, value);
      this.params = this.params.set('page', this.pageNumber);
      this.params = this.params.set('per_page', this.pageSize);
      this.checkSearchVal(this.params);
    }
  }
  getFilterAction() {
    if (
      this.filterField.get('name')?.value !== '' ||
      this.filterField.get('phone')?.value !== '' ||
      this.filterField.get('shipping_fees_from')?.value !== '' ||
      this.filterField.get('shipping_fees_to')?.value !== '' ||
      this.filterField.get('grand_total_from')?.value !== '' ||
      this.filterField.get('grand_total_to')?.value !== '' ||
      this.filterField.get('created_from')?.value !== '' ||
      this.filterField.get('created_to')?.value !== '' ||
      this.filterField.get('purchase_point')?.value.name !== '' ||
      this.filterField.get('city')?.value.name_en !== '' ||
      this.filterField.get('payment_method')?.value.name_en !== '' ||
      this.filterField.get('status')?.value.name !== ''
    ) {
      this.pageNumber = 1;
      this.pageSize = 5;
      this.params = this.params.set('page', this.pageNumber);
      this.params = this.params.set('per_page', this.pageSize);
      this.params = this.params.set(
        `filters[name]`,
        this.filterField.get('name')?.value
          ? this.filterField.get('name')?.value
          : ''
      );
      this.params = this.params.set(
        `filters[phone]`,
        this.filterField.get('phone')?.value
          ? this.filterField.get('phone')?.value
          : ''
      );
      this.params = this.params.set(
        `filters[shipping_fees_from]`,
        this.filterField.get('shipping_fees_from')?.value
          ? this.filterField.get('shipping_fees_from')?.value
          : ''
      );
      this.params = this.params.set(
        `filters[shipping_fees_to]`,
        this.filterField.get('shipping_fees_to')?.value
          ? this.filterField.get('shipping_fees_to')?.value
          : ''
      );
      this.params = this.params.set(
        `filters[grand_total_from]`,
        this.filterField.get('grand_total_from')?.value
          ? this.filterField.get('grand_total_from')?.value
          : ''
      );
      this.params = this.params.set(
        `filters[grand_total_to]`,
        this.filterField.get('grand_total_to')?.value
          ? this.filterField.get('grand_total_to')?.value
          : ''
      );

      this.params = this.params.set(
        `filters[created_from]`,
        this.datePipe.transform(
          this.filterField.get('created_from')?.value,
          'YYYY-MM-dd'
        )
          ? new Date(this.filterField.get('created_from')?.value).toISOString()
          : ''
      );
      // console.log(this.filterField.get('created_from')?.value, 'this is value');

      // console.log(new Date(this.filterField.get('created_from')?.value));

      // console.log(new Date(this.filterField.get('created_from')?.value).toISOString());

      this.params = this.params.set(
        `filters[created_to]`,
        this.datePipe.transform(
          this.filterField.get('created_to')?.value,
          'YYYY-MM-dd'
        )
          ? new Date(this.filterField.get('created_to')?.value).toISOString()
          : ''
      );
      this.params = this.params.set(
        `filters[purchase_point]`,
        this.filterField.get('purchase_point')?.value?.id
          ? this.filterField.get('purchase_point')?.value?.id
          : ''
      );
      this.params = this.params.set(
        `filters[city]`,
        this.filterField.get('city')?.value?.id
          ? this.filterField.get('city')?.value?.id
          : ''
      );
      this.params = this.params.set(
        `filters[payment_method]`,
        this.filterField.get('payment_method')?.value?.key
          ? this.filterField.get('payment_method')?.value?.key
          : ''
      );
      this.params = this.params.set(
        `filters[status]`,
        this.filterField.get('status')?.value?.id
          ? this.filterField.get('status')?.value?.id
          : ''
      );
      this.handleOrdersPageSize(this.params);
      console.log(this.params);

    } else {
      this.data$ = this.getListOrders();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.params = this.params.delete(`filters[name]`);
    this.params = this.params.delete(`filters[phone]`);
    this.params = this.params.delete(`filters[shipping_fees_from]`);
    this.params = this.params.delete(`filters[shipping_fees_to]`);
    this.params = this.params.delete(`filters[grand_total_from]`);
    this.params = this.params.delete(`filters[grand_total_to]`);
    this.params = this.params.delete(`filters[created_from]`);
    this.params = this.params.delete(`filters[created_to]`);
    this.params = this.params.delete(`filters[purchase_point]`);
    this.params = this.params.delete(`filters[city]`);
    this.params = this.params.delete(`filters[payment_method]`);
    this.params = this.params.delete(`filters[status]`);
    this.data$ = this.getListOrders();
  }
  //  handle page size of orders
  handleOrdersPageSize(value: any) {
    console.log('this is value of', value);

    let currentPage = value.first / value.rows + 1;
    console.log('this is current page: ' + currentPage);

    let paginator = {
      page: currentPage,
      size: value.rows,
    };

    // console.log('paginator: ' + paginator);

    this.pageSize = paginator.size;
    this.pageNumber = paginator.page;

    console.log('page size: ' + this.pageSize);
    console.log('page number: ' + this.pageNumber);




    this.params = this.params.set(
      'page',
      this.pageNumber ? this.pageNumber : 1
    );
    this.params = this.params.set(
      'per_page',
      this.pageSize ? this.pageSize : 50
    );
    this.loadingIndicator = true;
    this.data$ = this._orderService.paginateOrders(this.params).pipe(
      map((Orders) => {
        this.totalItems = Orders.meta.total;
        return Orders?.data?.map((Order: any) => {
          return {
            id: Order?.id,
            serial_number:
              Order?.serial_number !== null ? Order?.serial_number : '-',
            country: Order?.shipping_address?.country?.name,
            purchase_point: Order?.purchase_point?.label,
            customerName:
              Order?.client?.first_name + ' ' + Order?.client?.last_name,
            length: Order?.total_requested_quantity,
            grandTotal: Order?.grand_total,
            fees: Order?.delivery_price,
            Status: Order?.status?.label,
            Governrate: Order?.shipping_address?.governorate?.name,
            PhoneNumber: Order?.client?.phone,
            PaymentInfo: Order?.payment_info,
            created_at: this.datePipe.transform(
              Order?.created_at,
              'E  d  MMM  h:mm a'
            ),
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }
  //  show orders by id
  showOrders(id: number) {
    console.log('this is id from selected orders', id);

    let sub = this._orderService.showOrders(id).subscribe((res) => {
      this.display = true;
      this.showTextHeader = res?.data;
      console.log('this.showTextHeader', this.showTextHeader);

      this.selectedOrders = res?.data?.shipment_items?.map((Product: any) => {
        let sizes =
          Product?.seller_variation.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
        let colors =
          Product?.seller_variation.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );
        return {
          image: Product.seller_variation?.variation.images[0]?.url
            ? Product.seller_variation?.variation.images[0]?.url
            : Product.seller_variation?.variation.product.images[0]?.url,
          sku: Product.seller_variation.variation.sku,
          name: Product.seller_variation?.variation.product.title_en,
          brand: Product.seller_variation?.variation.product.brand_id,
          minPrice: Product.price,
          stock: Product.seller_variation?.variation.product.in_stock,
          variation: [...sizes, ...colors],
          quantity: Product?.quantity,
          id: Product.id,
          serial_number: Product.serial_number,
        };
      });
    });
    this.unsubscribe.push(sub);
  }
  cancelDailog() {
    this.display = false;
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((e) => {
      e.unsubscribe();
    });
  }
}
