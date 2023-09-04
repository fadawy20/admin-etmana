import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, map, Observable } from 'rxjs';
import { CreditStoreService } from 'src/app/Services/credit-store.service';
import { OrderService } from 'src/app/Services/order.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
export enum controlKeys {
  name = 'name',
  type = 'type',
  amount = 'amount',
  responsibility_type = 'responsibility_type',
  reason_id = 'reason_id',
  other_reason = 'other_reason',
  country_id = 'country_id',
  customer_type = 'customer_type',
  no_expiration = 'no_expiration',
  date_from = 'date_from',
  date_to = 'date_to',
  // max_use = 'max_use',
  clients = 'clients',
  order_id = 'order_id',
  serial_number = 'serial_number',
  shipment_products = 'shipment_products',
  transfer_type = 'transfer_type',
  bank_id = 'bank_id',
  account_name = 'account_name',
  bank_number = 'bank_number',
  iban = 'iban',
  phone = 'phone',
  status = 'status',
}
@Component({
  selector: 'app-create-credit',
  templateUrl: './create-credit.component.html',
  styleUrls: ['./create-credit.component.scss'],
})
export class CreateCreditComponent implements OnInit {
  Visibility: boolean = false;
  orderLength: number = 0;
  incloudShipping: any;
  submitted: boolean = false;
  genralInfoForm!: FormGroup;
  conditionInfoForm!: FormGroup;
  creditType: any;
  website: any[] = [];
  resposibility: any;
  hasExpiry: boolean = false;
  CustomerType: any;
  Reasons: any[] = [];
  loadingIndicator: boolean = false;
  Costomersdata$: Observable<any>;
  customerSelect: any[] = [];
  pageSize?: number;
  pageNumber?: number;
  CoustomerId: number = 0;
  params: any;
  length: number = 0;
  searchValue: string = '';
  page: number = 0;
  product: any;
  Loading: boolean = false;
  transfer: any[] = [];
  selectedAll: boolean = false;
  compensationFeild: boolean = false;
  refundFeild: boolean = false;
  stateFeild: boolean = false;
  theReasonField: boolean = false;
  specificCustomerField: boolean = false;
  vodafonCashFeild: boolean = false;
  bankAccountFeild: boolean = false;
  customersSelected: any[] = [];
  customersSelectedType: any;
  tableHeader: any[] = [];
  showOrderDetails: boolean = false;
  showSubmittedOrder: boolean = false;
  customerName: any;
  orderTotal: number = 0;
  orders: any[] = [];
  creditIdURL: any = 0;
  deleveryPrice: number = 0;
  discountDetails: any[] = [];
  productsSelected: any[] = [];
  sumSelected: number = 0;
  editModeStoreCredit: boolean = false;
  selectedValues: boolean = true;
  @ViewChild('table') table: any;
  banks: any[] = [];
  slide: boolean = true;
  statusProduct: boolean = false;
  systemDiscount: number = 0
  // slideDown:boolean=false
  display: boolean = false;
  ordersDisplay: boolean = false;
  addressForm!: FormGroup;
  customerSelect2: any;
  orderClients: any[] = []
  orderChecked: number = 0;
  orderSerialNumber: number = 0;
  loadingOrader: boolean = false;
  orderRefund: string = '';
  currency: any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private _activetedRoute: ActivatedRoute,
    private _CreditStoreService: CreditStoreService,
    private datePipe: DatePipe,
    private _orderService: OrderService,
    private _authService: AuthService
  ) {

    this.currency = this._authService.currency
    this.params = new HttpParams();
    this.genralInfoForm = this.fb.group({
      [controlKeys.type]: ['', [Validators.required]],
      [controlKeys.status]: [''],
      [controlKeys.name]: ['', [Validators.required]],
      [controlKeys.amount]: ['', [Validators.required]],
      [controlKeys.country_id]: ['', []],
      [controlKeys.serial_number]: ['', []],
      // [controlKeys.max_use]: ['', [Validators.required]],

      [controlKeys.responsibility_type]: ['', [Validators.required]],
    });
    this.conditionInfoForm = this.fb.group({
      [controlKeys.customer_type]: ['', [Validators.required]],
      [controlKeys.other_reason]: [''],
      [controlKeys.transfer_type]: ['', [Validators.required]],
      [controlKeys.reason_id]: ['', [Validators.required]],
      [controlKeys.bank_id]: ['', [Validators.required]],
      [controlKeys.iban]: ['', [Validators.required]],
      [controlKeys.account_name]: ['', [Validators.required]],
      [controlKeys.bank_number]: ['', [Validators.required]],
      [controlKeys.phone]: [
        '',
        [Validators.required, Validators.pattern(/^(01)(0|1|2|5)[0-9]{8}$/)],
      ],
    });
    this.tableHeader = [
      { field: 'id', header: 'ID' },
      { field: 'Name', header: 'Name' },
      { field: 'phone', header: 'Phone Number' },
      { field: 'Status', header: 'Status' },
      { field: 'date_modified', header: 'Date Modified' },
    ];

    this.transfer = [
      { name: 'Bank Account', code: 1 },
      { name: 'Etmana credit', code: 2 },
      { name: 'Vodafone cash', code: 4 },
    ];
    this.creditType = [
      { name: 'Refund', code: 1 },
      { name: 'compensation', code: 2 },
    ];
    this.customersSelected = [
      { name: 'None', code: 1 },
      { name: 'Selected', code: 2 },
    ];
    this.website = [
      { name: 'Egypt', code: 1 },
      { name: 'Saudi Arabia', code: 2 },
    ];
    this.CustomerType = [
      { name: 'All Customers', code: 1 },
      { name: 'Specific Customers', code: 2 },
    ];
    this.resposibility = [
      { name: 'Seller', code: 1 },
      { name: 'Customer service', code: 2 },
      { name: 'Logistics', code: 3 },
      { name: 'Commercial', code: 4 },
    ];
    this.Costomersdata$ = this.getAllCustomer();
    this.getReasons();
    this.getBanks();
    this._activetedRoute.paramMap.subscribe((params: ParamMap) => {
      this.creditIdURL = params.get('id');
      if (this.creditIdURL) {
        this.handleCreditStore();
      }
    });
  }
  closeOrderDetails() {
    this.slide = !this.slide;
  }
  // get all Reasons
  getReasons() {
    this._CreditStoreService.getReasons().subscribe((reasons) => {
      this.Reasons = reasons.data;
      this.Reasons.push({ description_en: 'Others', id: 5 });
    });
  }
  // get all Banks Name
  getBanks() {
    this._CreditStoreService.getBanks().subscribe((res) => {
      this.banks = res.data;
    });
  }

  switchStatus(ev: any) { }

  orderId: number = 0;
  // show order Details
  SubmittedOrderDetails() {
    this.productsSelected = [];
    this._CreditStoreService
      .orderDetailsBySerial(+this.genralInfoForm.get('serial_number')?.value)
      .subscribe((res) => {

        this.orderId = res.data.id;
        this.deleveryPrice = res?.data?.delivery_price;
        console.log(this.deleveryPrice, 'this is delevery price');
        this.customerName = res?.data.client;
        this.orderTotal = res?.data?.total_price;
        // this.discountDetails = res.data?.discount_details[0]?.discount;
        this.discountDetails = res.data?.discount_details;
        this.systemDiscount = res.data?.system_discount;



        this.orderLength = res.data?.total_requested_quantity;
        if (this.orders.length !== 0) {
          this.genralInfoForm.get(controlKeys.amount)?.setValue('');
          this.sumSelected = 0;
        }

        this.orders = res?.data?.shipment_items.map((product: any) => {
          return {
            id: product.id,
            productName: product?.seller_variation.variation.product.title_en,
            image: product?.seller_variation.variation.images[0]
              ? product?.seller_variation.variation.images[0]
              : product?.seller_variation.variation.product.images[0],
            Qty: product.quantity,
            price: product.price,
            logo: product?.seller_variation.variation.product.brand.logo,
            subTotal: product.subtotal,
            isSelected: false,
          };
        });
        console.log('This is order order', this.orders);

        // this.genralInfoForm.get('amount')?.setValue(res?.data?.subtotal)
        this.showOrderDetails = true;
        this.ordersDisplay = false;
        this.orderClients = [];
        this.orderSerialNumber = 0;
      });
  }
  // set all values to inputs feild for edit credit
  handleCreditStore() {
    this.editModeStoreCredit = true;
    this.productsSelected = [];
    this._CreditStoreService
      .showStoreCredit(this.creditIdURL)
      .subscribe((res) => {

        this.customerSelect = res.data.clients;
        this.incloudShipping = res.data.refund_shipping;
        if (res.data.serial_number) {
          this.genralInfoForm
            .get(controlKeys.serial_number)
            ?.setValue(res.data.serial_number);
          this.sumSelected = this.sumSelected + res.data.amount;

          this._CreditStoreService
            .orderDetails(res.data.serial_number)
            .pipe(
              finalize(() => {
                this.showOrderDetails = true;
              })
            )
            .subscribe((data) => {
              console.log(data);

              this.customerName = data?.data.client;
              this.orderTotal = data?.data?.total_price;
              this.orderLength = data.data?.total_requested_quantity;

              this.orders = data.data.shipment_items.map((order: any) => {
                let foundProduct = false;
                res?.data?.shipmentProducts.forEach((product: any) => {
                  if (order?.id === product?.id) {
                    this.productsSelected.push({
                      id: product.id,
                      quantity: product.quantity,
                    });

                    foundProduct = true;
                  }
                });
                return {
                  id: order?.id,
                  productName:
                    order?.seller_variation.variation.product.title_en,
                  image: order?.seller_variation.variation.images[0]
                    ? order?.seller_variation.variation.images[0]
                    : order?.seller_variation.variation.product.images[0],
                  Qty: order.quantity,
                  price: order.price,
                  logo: order?.seller_variation.variation.product.brand.logo,
                  subTotal: order.subtotal,
                  isSelected: foundProduct,
                };
              });
            });
        }
        this.genralInfoForm.get(controlKeys.type)?.setValue({
          name: res.data?.type?.id === 1 ? 'Refund' : 'compensation',
          code: res.data?.type?.id,
        });
        this.genralInfoForm.get(controlKeys.name)?.setValue(res.data.name);

        // this.genralInfoForm
        //   .get(controlKeys.max_use)
        //   ?.setValue(res.data.max_use);
        let name = {
          name: res?.data?.country?.name_en,
          code: res.data?.country?.id,
        };
        this.genralInfoForm.get(controlKeys.country_id)?.setValue(name);

        this.genralInfoForm.get(controlKeys.responsibility_type)?.setValue({
          name:
            res.data.responsibility_type.id === 1
              ? 'Seller'
              : res.data.responsibility_type.id === 2
                ? 'Customer service'
                : res.data.responsibility_type.id === 3
                  ? 'Logistics'
                  : 'Commercial',
          code: res.data.responsibility_type.id,
        });
        this.genralInfoForm.get(controlKeys.amount)?.setValue(res.data.amount);
        this.conditionInfoForm.get(controlKeys.customer_type)?.setValue({
          name:
            res.data.customer_type?.id === 1
              ? 'All Customers'
              : 'Specific Customers',
          code: res.data.customer_type?.id,
        });

        this.conditionInfoForm.get(controlKeys.reason_id)?.setValue({
          id: res.data.reason?.id,
          description_ar: res.data.reason?.description_ar,
          description_en: res.data.reason?.description_en,
          type: {
            id: res.data.reason?.type?.id,
            name: res.data.reason?.type?.name,
          },
          created_at: res.data.reason?.created_at,
        });
        this.conditionInfoForm
          .get(controlKeys.other_reason)
          ?.setValue(res.data.other_reason);
        this.conditionInfoForm.get(controlKeys.bank_id)?.setValue({
          created_at: res.data.bank?.created_at,
          id: res.data.bank?.id,
          name_ar: res.data.bank?.name_ar,
          name_en: res.data.bank?.name_en,
        });
        this.conditionInfoForm.get(controlKeys.iban)?.setValue(res.data.iban);
        this.conditionInfoForm
          .get(controlKeys.account_name)
          ?.setValue(res.data.account_name);
        this.conditionInfoForm
          .get(controlKeys.bank_number)
          ?.setValue(res.data.bank_number);
        if (res?.data?.type?.id === 2) {
          this.hasExpiry = res.data.no_expiration;
          this.conditionInfoForm
            .get(controlKeys.date_from)
            ?.setValue(new Date(res.data.date_from));
          this.conditionInfoForm
            .get(controlKeys.date_to)
            ?.setValue(new Date(res.data.date_to));
        }
        this.conditionInfoForm.get(controlKeys.transfer_type)?.setValue({
          name:
            res.data?.transfer_type?.id === 1
              ? 'Bank Account'
              : res.data?.transfer_type?.id === 2
                ? 'Etmana credit'
                : 'Vodafone cash',
          code: res.data?.transfer_type?.id,
        });

        this.conditionInfoForm
          .get(controlKeys.phone)
          ?.setValue(res.data.phone || '');
      });
  }
  incrment(product: any, i: number): any {
    if (product.Qty < 5) {
      let qty = this.orders[i].Qty++;

      this.orderLength += 1;
      if (product.isSelected) {
        this.sumSelected = this.sumSelected + product.price;
        // this.getTotlaNumber(product.price, qty)

        var foundIndex = this.productsSelected.findIndex(
          (x) => x.id == product.id
        );

        this.productsSelected[foundIndex] = {
          id: product.id,
          quantity: product.Qty,
        };

        this.genralInfoForm.get(controlKeys.amount)?.setValue(this.sumSelected);
      }
      this.orderTotal = this.orderTotal + product.price;
    }
  }
  descrment(product: any, i: number): any {
    if (product.Qty > 1) {
      this.orders[i].Qty--;
      this.orderLength -= 1;
      if (product.isSelected) {
        this.sumSelected = this.sumSelected - product.price;
        // });

        var foundIndex = this.productsSelected.findIndex(
          (x) => x.id == product.id
        );

        this.productsSelected[foundIndex] = {
          id: product.id,
          quantity: product.Qty,
        };

        this.genralInfoForm.get(controlKeys.amount)?.setValue(this.sumSelected);
      }
      this.orderTotal = this.orderTotal - product.price;
      return this.sumSelected;
    }
  }
  // check if all products selection change select all to checked
  // checkSelectionAllProduct(product: any) {
  //   return product.isSelected == true;
  // }
  // check products is Selected or not
  handleSelectedOrder(event: any, item: any, index: number) {
    // this.sumSelected=0
    this.orders[index].isSelected = !this.orders[index].isSelected;
    if (event.checked) {
      this.productsSelected.push({
        id: item.id,
        quantity: item.Qty,
      });
      // this.sumSelected = this.sumSelected + +(item.price * item.Qty);
      this.getTotlaNumber(item.price, item.Qty);
      let diesTotal = 0;
      this.discountDetails.forEach(item => { diesTotal += item.discount })
      // console.log(item);
      this.sumSelected = this.sumSelected - diesTotal
      // this.genralInfoForm.get(controlKeys.amount)?.setValue(this.sumSelected - diesTotal );
      // console.log(this.sumSelected, '===>');

      // if (this.orders.every(this.checkSelectionAllProduct)) {

      // }
    } else {
      // this.productsSelected = this.productsSelected.filter(
      //   (product) => product !== item.id
      // );
      this.productsSelected.splice(
        this.productsSelected.findIndex((a) => a.id === item.id),
        1
      );


      this.sumSelected = Math.abs(this.sumSelected - (item.price * item.Qty));

    }
  }

  getTotlaNumber(price: number, amount: number) {
    let sum = 0;
    let totlaNumberPerProduct = Number(amount) * Number(price);
    this.sumSelected = this.sumSelected + totlaNumberPerProduct;
  }

  // check select all checked or not
  isSelectedIncludedShipping: boolean = false
  handleSelectedAllOrders(event: any) {
    this.productsSelected = [];
    if (event.checked) {
      this.sumSelected = 0;
      this.orders.map((element) => {
        this.productsSelected.push({
          id: element.id,
          quantity: element.Qty,
        });
        element.isSelected = true;
        this.isSelectedIncludedShipping = true
        this.genralInfoForm.get(controlKeys.amount)?.setValue(this.orderTotal);

      });
    } else {
      this.productsSelected = [];
      this.orders.map((element) => {
        element.isSelected = false;
        this.isSelectedIncludedShipping = false

        this.genralInfoForm.get(controlKeys.amount)?.setValue('');
      });
    }
  }
  //incloud shipping
  handleSelectedShipping(event: any) {
    if (event.checked) this.sumSelected += this.deleveryPrice
    else {
      this.sumSelected -= this.deleveryPrice
      if (this.genralInfoForm.get(controlKeys.amount)?.value === this.orderTotal) {
        this.sumSelected = this.orderTotal - this.deleveryPrice
      }
    }



  }
  changeOrderId() {
    this.sumSelected = 0;
    this.genralInfoForm
      .get(controlKeys.serial_number)
      ?.valueChanges.subscribe((value: any) => {
        if (value !== '') {
          this.showSubmittedOrder = true;
        } else {
          this.showSubmittedOrder = false;
        }
      });
  }

  navigate() {
    this.router.navigate(['/Dashboard/credit']);
    sessionStorage.removeItem('storeCreditID')
  }
  changesSpecificCustomer() {
    this.conditionInfoForm
      .get(controlKeys.customer_type)
      ?.valueChanges.subscribe((customer_type: any) => {
        if (customer_type?.code === 2) {
          this.specificCustomerField = true;
        } else {
          this.specificCustomerField = false;
        }
      });
  }

  showFieldOtherReason() {
    this.conditionInfoForm
      .get(controlKeys.reason_id)
      ?.valueChanges.subscribe((Reason: any) => {
        if (Reason?.id === 5) {
          this.theReasonField = true;
          this.conditionInfoForm.addControl(
            controlKeys.other_reason,
            this.fb.control('', [Validators.required])
          );
        } else {
          this.theReasonField = false;
          this.conditionInfoForm.removeControl(controlKeys.other_reason);
        }
      });
  }
  // remove and add feild to forms when changes input credit type
  checkTypeChanges() {
    this.genralInfoForm
      .get(controlKeys.type)
      ?.valueChanges.subscribe((type: any) => {
        if (type?.code === 1) {
          this.compensationFeild = false;
          this.refundFeild = true;
          this.stateFeild = true;
          this.submitted = false;
          this.conditionInfoForm.reset();
          this.conditionInfoForm.addControl(
            controlKeys.transfer_type,
            this.fb.control('', [Validators.required])
          );
          this.genralInfoForm.addControl(
            controlKeys.serial_number,
            this.fb.control('', [Validators.required])
          );
          this.genralInfoForm.removeControl(controlKeys.country_id);
          this.conditionInfoForm.removeControl('customer_type');

          // this.genralInfoForm.removeControl('max_use');
          this.genralInfoForm.removeControl(controlKeys.name);
          this.conditionInfoForm.removeControl('date_from');
          this.conditionInfoForm.removeControl(controlKeys.date_to);
        } else if (type?.code === 2) {
          this.genralInfoForm.get('amount')?.setValue('');
          // this.genralInfoForm.addControl(
          //   controlKeys.max_use,
          //   this.fb.control('', [Validators.required])
          // );
          this.genralInfoForm.addControl(
            controlKeys.name,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.addControl(
            controlKeys.date_from,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.addControl(
            controlKeys.date_to,
            this.fb.control('')
          );
          // this.conditionInfoForm.addControl(controlKeys.date_to, this.fb.control('', [Validators.required]));
          this.showOrderDetails = false;
          this.customerName = '';
          this.orderTotal = 0;
          this.orders = [];
          this.submitted = false;
          this.conditionInfoForm.reset();
          this.compensationFeild = true;

          this.stateFeild = true;
          this.refundFeild = false;
          this.conditionInfoForm.get('account_name')?.clearValidators();
          this.conditionInfoForm.get('account_name')?.updateValueAndValidity();
          this.conditionInfoForm.get('iban')?.clearValidators();
          this.conditionInfoForm.get('iban')?.updateValueAndValidity();
          this.conditionInfoForm.get('bank_number')?.clearValidators();
          this.conditionInfoForm.get('bank_number')?.updateValueAndValidity();
          this.conditionInfoForm.get('bank_id')?.clearValidators();
          this.conditionInfoForm.get('bank_id')?.updateValueAndValidity();
          this.conditionInfoForm.get('phone')?.clearValidators();
          this.conditionInfoForm.get('phone')?.updateValueAndValidity();
          this.conditionInfoForm.removeControl('transfer_type');
          this.genralInfoForm.removeControl('serial_number');
          this.genralInfoForm.addControl(
            controlKeys.country_id,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.addControl(
            controlKeys.customer_type,
            this.fb.control('', [Validators.required])
          );
        }
      });
  }
  // remove and add feild to forms when changes input transfer type
  checkTransferCahnges() {
    this.conditionInfoForm
      .get('transfer_type')
      ?.valueChanges.subscribe((type: any) => {
        if (type?.code === 1) {
          this.bankAccountFeild = true;
          this.vodafonCashFeild = false;
          this.conditionInfoForm.addControl(
            controlKeys.account_name,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.addControl(
            controlKeys.iban,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.addControl(
            controlKeys.bank_number,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.addControl(
            controlKeys.bank_id,
            this.fb.control('', [Validators.required])
          );
          this.conditionInfoForm.removeControl('phone');
        } else if (type?.code === 2) {
          this.bankAccountFeild = false;
          this.vodafonCashFeild = false;
          this.conditionInfoForm.removeControl('account_name');
          this.conditionInfoForm.removeControl('iban');
          this.conditionInfoForm.removeControl('bank_number');
          this.conditionInfoForm.removeControl('bank_id');
          this.conditionInfoForm.removeControl('phone');
        } else if (type?.code === 4) {
          this.bankAccountFeild = false;
          this.vodafonCashFeild = true;
          this.submitted = false;
          this.conditionInfoForm.addControl(
            controlKeys.phone,
            this.fb.control('', [
              Validators.required,
              Validators.pattern(/^(01)(0|1|2|5)[0-9]{8}$/),
            ])
          );
          this.conditionInfoForm.removeControl('account_name');
          this.conditionInfoForm.removeControl('iban');
          this.conditionInfoForm.removeControl('bank_number');
          this.conditionInfoForm.removeControl('bank_id');
        }
      });
  }

  checkCustomerType(event: any) {
    if (event?.value?.code === 2) {
      this.specificCustomerField = true;
    } else {
      this.specificCustomerField = false;
    }
  }

  // get all Clients
  getAllCustomer() {
    this.loadingIndicator = true;
    this.params = this.params.set('page', 1);
    this.params = this.params.set('per_page', 5);
    return this._orderService.getCustomers(this.params).pipe(
      map((Clients) => {
        this.length = Clients.meta.total;
        return Clients?.data?.map((Client: any) => {
          return {
            id: Client.id,
            Name: Client.first_name + ' ' + Client.last_name,
            phone: Client.phone,
            code: Client.formatted_phone.code,
            number: Client.formatted_phone.number,
            Status: Client.is_verified === true ? 'Active' : 'In Active',
            date_modified: this.datePipe.transform(
              Client.created_at,
              'E  d  MMM  h:mm'
            ),
            wallet: Client.wallet,
            isSelected: false,
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }
  // check if value customer search is empty reset table
  checkValueSearchCustomers(value: any) {
    this.loadingIndicator = true;
    if (value === '') {
      this.params = this.params.delete('search_key');
      this.Costomersdata$ = this.getAllCustomer();

    } else {
      this.searchInClients(value)


    }
  }
  // reset value search of customer
  reset() {
    this.searchValue = '';
    this.params = this.params.delete('search_key');
    this.Costomersdata$ = this.getAllCustomer();
  }
  // handle pagination of customers
  handleCustomersPageSize(value: any) {
    let currentPage = value.first / value.rows + 1;
    let paginator = {
      page: currentPage,
      size: value.rows,
    };
    this.pageSize = paginator.size;
    this.pageNumber = paginator.page;
    this.params = this.params.set('page', this.pageNumber);
    this.params = this.params.set('per_page', this.pageSize);
    this.loadingIndicator = true;
    this.Costomersdata$ = this._orderService.paginateCustomer(this.params).pipe(
      map((clients) => {
        this.length = clients.meta.total;
        return clients?.data?.map((Client: any) => {
          return {
            id: Client.id,
            Name: Client.first_name + ' ' + Client.last_name,
            phone: Client.phone,
            code: Client.formatted_phone.code,
            number: Client.formatted_phone.number,
            Status: Client.is_verified === true ? 'Active' : 'In Active',
            date_modified: this.datePipe.transform(
              Client.created_at,
              'E  d  MMM  h:mm'
            ),
            wallet: Client.wallet,
            isSelected: false,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }
  // get products
  serachCustomersWithParams(value: any) {
    this.loadingIndicator = true;
    this.Costomersdata$ = this._orderService.paginateCustomer(value).pipe(
      map((clients) => {
        this.length = clients.meta.total;
        this.page = clients.meta.last_page;
        return clients?.data?.map((Client: any) => {
          return {
            id: Client.id,
            Name: Client.first_name + ' ' + Client.last_name,
            phone: Client.phone,
            code: Client.formatted_phone.code,
            number: Client.formatted_phone.number,
            Status: Client.is_verified === true ? 'Active' : 'In Active',
            date_modified: this.datePipe.transform(
              Client.created_at,
              'E  d  MMM  h:mm'
            ),
            wallet: Client.wallet,
            isSelected: false,
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }

  searchInClients(value: any) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize,
    };
    if (value === '') {
      this.params = this.params.delete('search_key');
      this.handleCustomersPageSize(data);
    } else {
      this.params = this.params.set(`search_key`, value);
      this.serachCustomersWithParams(this.params);
    }
  }
  //  select Customer
  onSelectCustomers(value: any) {
    this.customerSelect = value;
  }
  resetForm() {
    this.genralInfoForm.reset();
    this.conditionInfoForm.reset();
  }
  checkCreateOrEditStoreCredit() {
    if (this.editModeStoreCredit) {
      this.editStoreCredit();
    } else {
      this.createStoreCredit();
    }
    sessionStorage.removeItem('storeCreditID')
  }
  //  create store credit
  createStoreCredit() {
    this.submitted = true;
    let allCustomerSelectionsId = this.customerSelect.map(
      (customer) => customer.id
    );
    let obj = {
      name: this.genralInfoForm.get('name')?.value
        ? this.genralInfoForm.get('name')?.value
        : 'credit',
      type: this.genralInfoForm.get('type')?.value?.code,
      amount: this.genralInfoForm.get('amount')?.value,
      responsibility_type: this.genralInfoForm.get('responsibility_type')?.value
        ?.code,
      reason_id:
        this.conditionInfoForm.get('reason_id')?.value?.id === 5
          ? null
          : this.conditionInfoForm.get('reason_id')?.value?.id,
      other_reason: this.conditionInfoForm.get('other_reason')?.value,
      country_id: this.genralInfoForm.get('country_id')?.value?.code,
      customer_type: this.conditionInfoForm.get('customer_type')?.value?.code,
      no_expiration: this.hasExpiry === true ? true : false,
      date_from: this.datePipe.transform(
        this.conditionInfoForm.get('date_from')?.value,
        'dd-MMM-YYYY'
      ),
      date_to: this.datePipe.transform(
        this.conditionInfoForm.get('date_to')?.value,
        'dd-MMM-YYYY'
      ),
      refund_shipping: this.incloudShipping,
      // max_use: this.genralInfoForm.get('max_use')?.value,
      clients: allCustomerSelectionsId,
      order_id: this.orderId,
      shipment_products: this.productsSelected,
      transfer_type: this.conditionInfoForm.get('transfer_type')?.value?.code,
      bank_id: this.conditionInfoForm.get('bank_id')?.value?.id,
      account_name: this.conditionInfoForm.get('account_name')?.value,
      bank_number: this.conditionInfoForm.get('bank_number')?.value,
      iban: this.conditionInfoForm.get('iban')?.value,
      phone: '+2' + this.conditionInfoForm.get('phone')?.value,
    };

    if (this.genralInfoForm.valid && this.conditionInfoForm.valid) {
      this.Loading = true;
      this._CreditStoreService
        .CreateStoreCredit(obj)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.Loading = false;
          })
        )
        .subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Creates Store Credit added  Successfully',
          });

          setTimeout(() => {
            this.router.navigate(['Dashboard/credit']);
          }, 1000);
        });
    }
  }

  // edit store credit
  editStoreCredit() {
    this.Loading = true;
    this.editModeStoreCredit = true;
    this.submitted = true;
    let allCustomerSelectionsId = this.customerSelect.map(
      (customer) => customer.id
    );
    let obj = {
      name: this.genralInfoForm.get('name')?.value
        ? this.genralInfoForm.get('name')?.value
        : 'credit',
      type: this.genralInfoForm.get('type')?.value?.code,
      amount: this.genralInfoForm.get('amount')?.value,
      responsibility_type: this.genralInfoForm.get('responsibility_type')?.value
        ?.code,
      reason_id:
        this.conditionInfoForm.get('reason_id')?.value?.id === 5
          ? null
          : this.conditionInfoForm.get('reason_id')?.value?.id,
      other_reason: this.conditionInfoForm.get('other_reason')?.value,
      country_id: this.genralInfoForm.get('country_id')?.value?.code,
      customer_type: this.conditionInfoForm.get('customer_type')?.value?.code,
      no_expiration: this.hasExpiry === true ? true : false,
      date_from: this.datePipe.transform(
        this.conditionInfoForm.get('date_from')?.value,
        'dd-MMM-YYYY'
      ),
      date_to: this.datePipe.transform(
        this.conditionInfoForm.get('date_to')?.value,
        'dd-MMM-YYYY'
      ),
      refund_shipping: this.incloudShipping,
      // max_use: this.genralInfoForm.get('max_use')?.value,
      clients: allCustomerSelectionsId,
      order_id: this.orderId,
      shipment_products: this.productsSelected,
      transfer_type: this.conditionInfoForm.get('transfer_type')?.value?.code,
      bank_id: this.conditionInfoForm.get('bank_id')?.value?.id,
      account_name: this.conditionInfoForm.get('account_name')?.value,
      bank_number: this.conditionInfoForm.get('bank_number')?.value,
      iban: this.conditionInfoForm.get('iban')?.value,
      phone: '+2' + this.conditionInfoForm.get('phone')?.value,
    };

    if (this.genralInfoForm.valid && this.conditionInfoForm.valid) {
      this._CreditStoreService
        .updateStoreCredit(this.creditIdURL, obj)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.Loading = false;
          })
        )
        .subscribe((res) => {
          this.resetForm();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Updeted Store Credit   Successfully',
          });
          setTimeout(() => {
            this.router.navigate(['Dashboard/credit']);
          }, 1000);
        });
    }
  }
  // select Customer and get all
  onRowSelectCustomer(value: any) {
    this.customerSelect2 = value.data;

    this.CoustomerId = this.customerSelect2.id;
    // this.display = false;
  }
  // get all orders to customer
  getClientOrders() {
    this._orderService.getClientOrdersById(this.CoustomerId).subscribe((res) => {

      this.orderClients = res.data.orders;
      this.loadingOrader = false;
    })
  }

  // dialog to show orders from customer
  showOrdersDisplay() {
    this.display = false;
    this.ordersDisplay = true;
    this.loadingOrader = true;
    this.getClientOrders()
  }
  backToCustomer() {
    this.display = true;
    this.ordersDisplay = false;
    this.orderClients = [];

  }
  cancelDailog() {
    this.ordersDisplay = false;
  }
  checkOrderValue(event: any, item: any, index: number) {

    if (event.checked == false) {
      this.orderChecked = 0;
    }
    this.orderClients[index].isSelected = !this.orderClients[index].isSelected;
    if (event.checked) {
      this.orderChecked = item.id;
      this.orderSerialNumber = item.serial_number;
    }

  }
  selectOrder() {
    this.genralInfoForm.get('serial_number')?.setValue(this.orderSerialNumber);
    this.SubmittedOrderDetails();
  }

  ngOnInit(): void {
    this.checkTypeChanges();
    this.checkTransferCahnges();
    this.changeOrderId();
    this.showFieldOtherReason();
    this.changesSpecificCustomer();
    if (sessionStorage.getItem('storeCreditID') != null) {
      let orderID: any = '';
      orderID = sessionStorage.getItem('storeCreditID');
      this.orderSerialNumber = JSON.parse(orderID);
      // this.creditType[1];
      this.orderRefund = this.creditType[0];
      this.selectOrder()

    }
  }
}
