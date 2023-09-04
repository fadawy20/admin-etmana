import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import {
  Component,
  DoCheck,
  HostListener,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { finalize, map, Observable, Subscription } from 'rxjs';
import { OpendailogService } from 'src/app/Services/opendailog.service';
import { OrderService } from 'src/app/Services/order.service';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

export let browserRefresh = false;
export enum ControlKeys {
  SearchInput = 'SearchInput',
  first_name = 'first_name',
  last_name = 'last_name',
  phoneNumber = 'phoneNumber',
  phoneCode = 'phoneCode',
  address_details = 'address_details',
  country_id = 'country_id',
  governorate_id = 'governorate_id',
  city_id = 'city_id',
  additonalNumber = 'additonalNumber',
  setAddress = 'setAddress',
}
@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  display: boolean = true;
  paginationParams: any;
  visible: boolean = true;

  paginationBrandsParams: any;
  placeOrderLoading: boolean = false;
  loadingIndicator: boolean = false;
  length: number = 0;
  page: number = 0;
  tableHeader: any[] = [];
  Costomersdata$: Observable<any>;
  customerSelect: any;
  pageSize?: number;
  pageNumber?: number;
  pageProductSize?: number;
  pageProductNumber?: number;
  totalItems: number = 0;
  searchValue: string = '';
  ProductNameValue: string = '';
  ProductSKUValue: string = '';
  ProductBrandValue: number = 0;
  productData$: Observable<any>;
  sendTablePageSize: any;
  handleCheckedValues: any;
  checkValues: boolean = true;
  showImage: boolean = false;
  imageHeader?: string;
  showActionCol: boolean = false;
  Products: any[] = [];
  addressForm!: FormGroup;
  addressMode: boolean = false;
  changeAddressMode: boolean = false;
  selectMode: boolean = true;
  newAddrssMode: boolean = false;
  newAddressForm!: FormGroup;
  brandsData: any[] = [];
  brandNext: string = '';
  brandCurrent: number = 1;
  asyncData: any;
  selectedProducts: any[] = [];
  canDeactivate: boolean = false;
  @ViewChild('p', { static: false }) paginator!: Paginator;
  CoustomerId: number = 0;
  addressId: number = 0;
  country: any[] = [];
  governs: any[] = [];
  cities: any[] = [];
  submitted: boolean = false;
  customerDetails: any[] = [];
  customerDetailsIndex: number = 0;
  customerDetailsSet: any[] = [];
  countryId: number = 0;
  editAddressMode: boolean = false;
  quantity: number = 1;
  paymentMethods: any[] = [];
  paymentId: number = 1;
  checkCredits: any;
  selectedAddressId: number = 0;
  msgs: any;
  hideOrderSummary: boolean = false;
  orderSummaryDetails: any;
  params: any;
  promoCode: boolean = true;
  promoCodeVal: string = '';
  iterableDiffer: any;
  iterableDifferVar: any;
  walletBalance: number = 0;
  shippingDetails: any;
  getGovernId: any;
  selectPayment: any = {
    id: 1,
    is_enabled: 1,
    key: 'cash',
    name_ar: 'كاش',
    name_en: 'Cash',
  };
  msgPromo: boolean = true;
  msgPromoVal: string = '';
  customerDetails2: any[] = []
  currency: any

  constructor(
    private _Router: Router,
    private fb: FormBuilder,
    private _orderService: OrderService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private iterableDiffers: IterableDiffers,
    private _openDialog: OpendailogService,
    private _authService: AuthService
  ) {

    this.currency = this._authService.currency



    // console.log(history.state);

    this._orderService.geCoutries().subscribe((countries) => {
      this.country = countries.data;
    });

    this.addressForm = this.fb.group({
      [ControlKeys.country_id]: ['', [Validators.required]],
      [ControlKeys.city_id]: ['', [Validators.required]],
      [ControlKeys.governorate_id]: ['', [Validators.required]],
      [ControlKeys.address_details]: ['', [Validators.required]],
      [ControlKeys.first_name]: ['', [Validators.required]],
      [ControlKeys.last_name]: ['', [Validators.required]],
      [ControlKeys.phoneCode]: ['', [Validators.required]],
      [ControlKeys.phoneNumber]: ['', [Validators.required]],
      [ControlKeys.additonalNumber]: [''],
    });
    // Form new address when add new address
    this.newAddressForm = this.fb.group({
      [ControlKeys.city_id]: ['', [Validators.required]],
      [ControlKeys.governorate_id]: ['', [Validators.required]],
      [ControlKeys.address_details]: ['', [Validators.required]],
      [ControlKeys.first_name]: ['', [Validators.required]],
      [ControlKeys.last_name]: ['', [Validators.required]],
      [ControlKeys.phoneCode]: ['', [Validators.required]],
      [ControlKeys.phoneNumber]: ['', [Validators.required]],
      [ControlKeys.additonalNumber]: [''],
      [ControlKeys.setAddress]: [false],
    });

    // Names of table header of Products
    this.tableHeader = [
      { field: 'SKU', header: 'SKU' },
      { field: 'Image', header: 'Image' },
      { field: 'Name', header: 'Name' },
      { field: 'Brand', header: 'Brand' },
      { field: 'Price', header: 'Price' },
    ];
    this.paginationParams = new HttpParams();
    this.params = new HttpParams();
    this.paginationBrandsParams = new HttpParams();
    this.productData$ = this.getproducts();
    this.Costomersdata$ = this.getAllCustomer();
    this.getAllBrands(1);
  }









  // Get Government in Country by id
  getGovern() {
    // console.log('this is country id', this.countryId);

    this._orderService.geGovern(this.countryId).subscribe((govern) => {
      this.governs = govern.data;

      // console.log('this is governs of order', this.governs);

    });
    if (this.countryId == 1) {
      this.addressForm.get('phoneCode')?.setValue('+2');
    } else {
      this.addressForm.get('phoneCode')?.setValue('+966');
    }
  }
  //
  // Get all Cities in Government by id
  getCities(id: number) {
    this.getGovernId = id;
    this._orderService.geCities(id).subscribe((city) => {
      this.cities = city.data;
    });
  }
  //

  // brands scroll
  handleBrandScrollEvent() {
    this.brandCurrent++;
    this.getAllBrands(this.brandCurrent);
  }
  // get all Brands
  getAllBrands(page: number) {
    this.loadingIndicator = true;
    this.paginationBrandsParams = this.paginationBrandsParams.set('page', page);
    this.paginationBrandsParams = this.paginationBrandsParams.set(
      'per_page',
      15
    );
    this._orderService
      .getBrands(this.paginationBrandsParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands) => {
        this.length = brands.meta.total;
        this.page = brands.meta.last_page;
        this.brandNext = brands.links.next;
        this.asyncData = brands.data
          .map((brand: any) => {
            return {
              title_en: brand.title_en,
              title_ar: brand.title_ar,
              id: brand.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.brandsData.find((atts) => atts.id === asyncedData.id);
          });
        this.brandsData = [...this.brandsData, ...this.asyncData];
      });
  }
  //
  // change content in dailog when add new address
  changeNewAddressMode() {
    this.newAddrssMode = true;
    this.getGovern();
    this.submitted = false;
    if (this.countryId == 1) {
      this.newAddressForm.get('phoneCode')?.setValue('+2');
    } else {
      this.newAddressForm.get('phoneCode')?.setValue('+966');
    }
  }
  //
  // cancel add new or edit address and change falg check Mode
  cancelNewAddress() {
    this.newAddrssMode = false;
    this.newAddressForm.reset();
    this.editAddressMode = false;
    this.submitted = true;
  }
  //
  // Open dailog when show all address and edit or add or delete
  openChangeAddress() {
    this.changeAddressMode = true;
    this.newAddrssMode = false;
  }
  //
  //
  //  select Customer and get all address

  onRowSelectCustomer(value: any) {
    this.customerSelect = value.data;
    this.addressForm.patchValue({
      first_name: this.customerSelect.Name.slice(
        0,
        this.customerSelect.Name.indexOf(' ')
      ),
      last_name: this.customerSelect.Name.slice(
        this.customerSelect.Name.indexOf(' ') + 1
      ),
      phoneNumber: this.customerSelect.number,
      phoneCode: this.customerSelect.phone.slice(0, 2),
    });
    this.CoustomerId = this.customerSelect.id;

    this.walletBalance = value.data.wallet;
    this._orderService
      .getCustomerAddress(this.customerSelect.id)
      .subscribe((Details: any) => {
        if (Details.data.length) {
          Details.data.map((address: any) => {
            if (address.is_default_shipping == 1) {
              this.selectedAddressId = address.id;
            }
          });
          this.customerDetails = Details.data;
          this.countryId = Details.data[0].country_id;

          this.addressMode = true;
          this.display = false;
        } else {
          this.display = false;
          this.addressMode = false;
        }
      });
  }
  //
  // add new address when not have any address
  setCustomerAddress() {
    this.submitted = true;
    let obj = {
      country_id: this.countryId,
      client_id: this.CoustomerId,
      first_name: this.addressForm.get(ControlKeys.first_name)?.value,
      last_name: this.addressForm.get(ControlKeys.last_name)?.value,
      phone:
        this.addressForm.get(ControlKeys.phoneCode)?.value +
        this.addressForm.get(ControlKeys.phoneNumber)?.value,
      address_details: this.addressForm.get(ControlKeys.address_details)?.value,
      city_id: this.addressForm.get(ControlKeys.city_id)?.value,
      governorate_id: this.addressForm.get(ControlKeys.governorate_id)?.value,
      additonalNumber: this.addressForm.get(ControlKeys.additonalNumber)?.value,
      is_default_shipping: 1,
    };
    if (this.addressForm.valid) {
      this.submitted = false;
      this._orderService.setCustomerAddress(obj).subscribe((res) => {
        this.customerDetails.push(res.data);
        this.addressId = res.data.id;
        this.selectedAddressId = res.data.id;
        this.addressMode = true;
        this.getOrderSummary();
      });
    } else {
      this.submitted = true;
    }
  }
  // add new address and edit mode
  setCustomerNewAddress() {
    this.submitted = true;
    if (this.editAddressMode == true) {
      let obj = {
        client_id: this.CoustomerId,
        country_id: this.countryId,
        first_name: this.newAddressForm.get(ControlKeys.first_name)?.value,
        last_name: this.newAddressForm.get(ControlKeys.last_name)?.value,
        phone:
          this.newAddressForm.get(ControlKeys.phoneCode)?.value +
          this.newAddressForm.get(ControlKeys.phoneNumber)?.value,
        governorate_id: this.newAddressForm.get(ControlKeys.governorate_id)
          ?.value,
        address_details: this.newAddressForm.get(ControlKeys.address_details)
          ?.value,
        city_id: this.newAddressForm.get(ControlKeys.city_id)?.value,
        is_default_shipping:
          this.newAddressForm.get(ControlKeys.setAddress)?.value == true
            ? 1
            : 0,
        additonalNumber: this.newAddressForm.get(ControlKeys.additonalNumber)
          ?.value,
      };

      if (this.newAddressForm.valid) {
        this.submitted = false;
        this._orderService
          .updatCustomerAddress(this.addressId, obj)
          .subscribe((res) => {
            this.customerDetails[this.customerDetailsIndex] = res.data;
            this._orderService
              .getCustomerAddress(this.CoustomerId)
              .subscribe((Details: any) => {
                Details.data.map((address: any) => {
                  if (address.is_default_shipping == 1) {
                    this.selectedAddressId = address.id;
                  }

                  this.customerDetails = Details.data;
                });
              });
            this.addressId = res.data.id;
            this.newAddressForm.reset();
            this.newAddrssMode = false;
          });
      } else {
        this.submitted = true;
      }
    } else {
      let obj = {
        client_id: this.CoustomerId,
        country_id: this.countryId,
        first_name: this.newAddressForm.get(ControlKeys.first_name)?.value,
        last_name: this.newAddressForm.get(ControlKeys.last_name)?.value,
        phone:
          this.newAddressForm.get(ControlKeys.phoneCode)?.value +
          this.newAddressForm.get(ControlKeys.phoneNumber)?.value,
        governorate_id: this.newAddressForm.get(ControlKeys.governorate_id)
          ?.value,
        city_id: this.newAddressForm.get(ControlKeys.city_id)?.value,
        additonalNumber: this.newAddressForm.get(ControlKeys.additonalNumber)
          ?.value,
        is_default_shipping:
          this.newAddressForm.get(ControlKeys.setAddress)?.value == true
            ? 1
            : 0,
        address_details: this.newAddressForm.get(ControlKeys.address_details)
          ?.value,
      };
      if (this.newAddressForm.valid) {
        this.submitted = false;

        this._orderService.setCustomerAddress(obj).subscribe((res) => {
          if (res.data.is_default_shipping == 1) {
            this.selectedAddressId = res.data.id;
          }

          this.customerDetails.push(res.data);
          this.addressId = res.data.id;
          this._orderService
            .getCustomerAddress(this.CoustomerId)
            .subscribe((Details: any) => {
              Details.data.map((address: any) => {
                if (address.is_default_shipping == 1) {
                  this.selectedAddressId = address.id;
                }
              });
              this.customerDetails = Details.data;
            });
          this.newAddressForm.reset();
          this.newAddrssMode = false;
        });
      } else {
        this.submitted = true;
      }
    }
  }
  // set value in form new address
  handleEditAddressCustomer(data: any, index: number) {
    this.submitted = false;
    this.addressId = data.id;
    this.customerDetailsIndex = index;
    this.newAddrssMode = true;
    this.editAddressMode = true;
    this.getGovern();
    this.newAddressForm
      .get(ControlKeys.governorate_id)
      ?.setValue(data.governorate_id);
    this.newAddressForm.get(ControlKeys.city_id)?.setValue(data.city_id);

    this.newAddressForm.get(ControlKeys.first_name)?.setValue(data.first_name);
    this.newAddressForm.get(ControlKeys.last_name)?.setValue(data.last_name);
    this.newAddressForm
      .get(ControlKeys.phoneCode)
      ?.setValue(data.formatted_phone?.code);
    this.newAddressForm
      .get(ControlKeys.phoneNumber)
      ?.setValue(data.formatted_phone?.number);
    this.newAddressForm
      .get(ControlKeys.setAddress)
      ?.setValue(data.is_default_shipping == 1 ? true : false);
    this.newAddressForm
      .get(ControlKeys.address_details)
      ?.setValue(data.address_details);
    this.newAddressForm
      .get(ControlKeys.additonalNumber)
      ?.setValue(data.additonalNumber);
  }

  // Delete Address Clients
  deleteAddressClient(data: any) {
    this.confirmationService.confirm({
      message: 'do you want to delete this Address ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._orderService.deleteAddress(data.id).subscribe((data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Address is Deleted successfully',
          });

          this._orderService
            .getCustomerAddress(this.CoustomerId)
            .subscribe((Details: any) => {
              this.customerDetails = Details.data;
              if (Details.data.length > 0) {
                this.customerDetails = Details.data;
              } else {
                this.changeAddressMode = false;
                this.addressForm.reset();
                this.addressMode = false;
              }
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

  // get all Clients
  getAllCustomer() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 5);
    return this._orderService.getCustomers(this.paginationParams).pipe(
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
              Client.date_modified,
              'E  d  MMM  h:mm'
            ),
            wallet: Client.wallet,
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
    if (value === '') {
      this.paginationParams = this.paginationParams.delete('search_key');
      this.Costomersdata$ = this.getAllCustomer();
    }
  }
  // reset value search of customer
  reset() {
    this.searchValue = '';
    this.paginationParams = this.paginationParams.delete('search_key');
    this.Costomersdata$ = this.getAllCustomer();
  }

  allIdProductSelected: any[] = [];
  allProductSelected: any[] = [];
  changeChecked(product: any) {
    let flag = 0;
    if (this.allIdProductSelected.includes(product?.id)) {
      let index = this.allIdProductSelected.indexOf(product.id);
      this.allIdProductSelected.splice(index, 1);
    } else this.allIdProductSelected.push(product?.id);

    this.allProductSelected.forEach((e: any, index: any) => {
      if (e.id == product?.id) {
        ++flag;
        this.allProductSelected.splice(index, 1);
      }
    });
    if (flag == 0) this.allProductSelected.push(product);

    this.selectedProducts = this.allProductSelected.map((Product: any) => {
      return {
        sku: Product.sku,
        image: Product.image.url,
        name: Product.name,
        brand: Product.brand,
        minPrice: Product.minPrice,
        sale_price: Product.sale_price,
        stock: Product.stock,
        variation: Product.variation,
        quantity: +Product.quantity,
        id: Product.id,
      };
    });

    if (this.paymentId !== 0 && this.selectedProducts.length !== 0) {
      this.getOrderSummary();
    }
  }

  onSelectionChange(products: any) {
    // if (products.length == 0) {
    //   this.productData$.subscribe((data: any) => {
    //     data?.map((product: any) => {
    //       if (this.allIdProductSelected.includes(product?.id)) {
    //         let index = this.allIdProductSelected.indexOf(product?.id);
    //         this.allIdProductSelected.splice(index, 1);
    //         this.allProductSelected.splice(index, 1);
    //       }
    //     });
    //     this.selectedProducts = this.allProductSelected.map((Product: any) => {
    //       return {
    //         sku: Product.sku,
    //         image: Product.image.url,
    //         name: Product.name,
    //         brand: Product.brand,
    //         minPrice: Product.minPrice,
    //         sale_price: Product.sale_price,
    //         stock: Product.stock,
    //         variation: Product.variation,
    //         quantity: +Product.quantity,
    //         id: Product.id,
    //       };
    //     });
    //   });
    // } else {
    //   products?.map((product: any) => {
    //     if (!this.allIdProductSelected.includes(product?.id)) {
    //       this.allIdProductSelected.push(product?.id);
    //       this.allProductSelected.push(product);
    //     }
    //   });
    //   this.selectedProducts=[...this.allProductSelected]
    // }
    // if (this.paymentId !== 0 && this.selectedProducts.length !== 0) {
    //   this.getOrderSummary();
    // }
  }
  addProductToReview() {
    // this.selectedProducts = this.Products.map((Product: any) => {
    //   return {
    //     sku: Product.sku,
    //     image: Product.image.url,
    //     name: Product.name,
    //     brand: Product.brand,
    //     minPrice: Product.minPrice,
    //     sale_price: Product.sale_price,
    //     stock: Product.stock,
    //     variation: Product.variation,
    //     quantity: +Product.quantity,
    //     id: Product.id,
    //   };
    // });
    // if (this.paymentId !== 0 && this.selectedProducts.length !== 0) {
    //   this.getOrderSummary();
    // }
  }
  //

  // plus Quantity Product
  PlusQuantityProduct(index: number) {
    this.selectedProducts[index].quantity++;
    if (this.selectedProducts.length > 0 && this.paymentId !== 0) {
      this.getOrderSummary();
    }
  }
  //
  // minus Quantity Product
  minusQuantityProduct(product: any, index: number) {
    if (product.quantity > 1) {
      product.quantity--;
      if (this.selectedProducts.length > 0 && this.paymentId !== 0) {
        this.getOrderSummary();
      }
    }
  }
  //

  // Remove product from Review
  RemoveProduct(index: any, product: any) {
    this.selectedProducts.splice(index, 1);
    if (this.selectedProducts.length > 0 && this.paymentId !== 0) {
      this.getOrderSummary();
    }

    if (this.allIdProductSelected.includes(product?.id)) {
      let index = this.allIdProductSelected.indexOf(product.id);
      this.allIdProductSelected.splice(index, 1);
    }
    this.allProductSelected.forEach((e: any, index: any) => {
      if (e.id == product?.id) {
        this.allProductSelected.splice(index, 1);
      }
    });
  }
  // get payment methods
  getPaymentMethods() {
    // paymentMethods
    this._orderService.getPaymentMethod().subscribe((res) => {
      this.paymentMethods = res.data.filter((pay: any) => {
        if (
          (pay.key == 'cash' || pay.key == 'visa_on_delivery') &&
          pay.is_enabled
        ) {
          return {
            id: pay.id,
            name_en: pay.name_en,
            is_enabled: pay.is_enabled,
          };
        } else return;
      });
    });
  }
  //
  // check if the credit true or false
  checkCredit(check: any) {
    this.checkCredits = this.checkCredits ? 1 : 0;
  }
  // get payment id
  getPaymentId(id: number) {
    this.paymentId = id;
    if (this.selectedProducts.length !== 0) {
      this.getOrderSummary();
    }
  }
  //

  // get order summary
  getOrderSummary() {
    let data = this.selectedProducts.map((ele: any) => {
      return {
        id: ele.id,
        quantity: ele.quantity,
      };
    });
    let obj = {
      client_id: this.CoustomerId,
      address_id: this.selectedAddressId,
      payment_method_id: this.paymentId,
      use_credit: this.checkCredits ? 1 : 0,
      seller_variations: data,
      promo_code: this.promoCodeVal,
    };

    if (
      (this.selectedProducts.length &&
        this.paymentId &&
        this.selectedAddressId !== 0) ||
      this.promoCodeVal !== ''
    ) {
      this._orderService.getOrderSummary(obj).subscribe(
        (res) => {
          if (!res.data.coupon_code_discount) this.promoCode = true;
          else this.promoCode = false;

          this.orderSummaryDetails = res.data;
          this.shippingDetails = res.data.shipping_fees;
          this.msgPromoVal = '';
        },
        (err) => {
          // this.msgPromoVal='This promo code is invalid'
          this.msgPromoVal = '';
        }
      );
    }
  }
  // send order and finsh choose products
  placeOrder() {
    let data = this.selectedProducts.map((ele: any) => {
      return {
        id: ele.id,
        quantity: ele.quantity,
      };
    });
    let obj = {
      client_id: this.CoustomerId,
      address_id: this.selectedAddressId,
      payment_method_id: this.paymentId,
      use_credit: this.checkCredits ? 1 : 0,
      seller_variations: data,
      promo_code: this.promoCodeVal,
    };

    this.confirmationService.confirm({
      message: 'do you want to place Order ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._orderService.placeOrder(obj).subscribe((data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The order has already been followed',
          });
          this.params = this.params.set('page', 1);
          this.params = this.params.set('per_page', 5);
          this.placeOrderLoading = true;
          this._orderService.getListOrders(this.params).subscribe((res) => {
            this.placeOrderLoading = false;
          });
          setTimeout(() => {
            this._Router.navigate(['Dashboard/order']);
          }, 1500);
        });
      },
      reject: () => {
        this.placeOrderLoading = false;
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
  // back to orders screen
  backToOrder() {
    this._Router.navigate(['Dashboard/order']);
  }
  CreateCustomer() {
    this._Router.navigate(['Dashboard/users']);
  }
  // check cupon
  checkCupon() {
    if (this.promoCodeVal !== '') {
      this.getOrderSummary();
    }
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
    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize
    );
    this.loadingIndicator = true;
    this.Costomersdata$ = this._orderService
      .paginateCustomer(this.paginationParams)
      .pipe(
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
                Client.date_modified,
                'E  d  MMM  h:mm'
              ),
              wallet: Client.wallet,
            };
          });
        }),
        finalize(() => (this.loadingIndicator = false))
      );
  }
  // get products
  serachCustomersWithParams(value: any) {
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
              Client.date_modified,
              'E  d  MMM  h:mm'
            ),
            wallet: Client.wallet,
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
      this.paginationParams = this.paginationParams.delete('search_key');
      this.handleCustomersPageSize(data);
    } else {
      this.paginationParams = this.paginationParams.set(`search_key`, value);
      this.serachCustomersWithParams(this.paginationParams);
    }
  }
  // get all products and show in table
  getproducts() {
    this.loadingIndicator = true;
    let data: any;
    this.params = this.params.set('page', 1);
    this.params = this.params.set('per_page', 5);
    this.params = this.params.set('product_name', this.ProductNameValue);
    this.params = this.params.set('sku', this.ProductSKUValue);
    this.params = this.params.set('brand_id', this.ProductBrandValue);
    return this._orderService.getProducts(this.params).pipe(
      map((Products) => {
        this.totalItems = Products.meta.total;
        return Products?.data.map((pro: any) => {
          let sizes = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
          let colors = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );

          data = {
            variation: [...sizes, ...colors],
            sku: pro.variation.sku,
            image: pro.variation.product.images[0]
              ? pro.variation.product.images[0]
              : '',
            name: pro.variation.product.title_en,
            brand: pro.variation.product.brand_id,
            sale_price: pro.sale_price,
            minPrice: pro.price,
            stock: pro?.in_stock,
            quantity: 1,
            id: pro.id,
          };
          return data;
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }
  // handle Products PageSize
  handleProductsPageSize(value: any) {
    let data: any;
    let currentPage = value.first / value.rows + 1;
    let paginator = {
      page: currentPage,
      size: value.rows,
    };
    this.pageProductSize = paginator.size;
    this.pageProductNumber = paginator.page;

    this.params = this.params.set('page', this.pageProductNumber);
    this.params = this.params.set('per_page', 5);
    this.params = this.params.set('product_name', this.ProductNameValue);
    this.params = this.params.set('sku', this.ProductSKUValue);
    this.params = this.params.set('brand_id', this.ProductBrandValue);
    this.productData$ = this._orderService.paginateProducts(this.params).pipe(
      map((Products) => {
        this.totalItems = Products.meta.total;
        return Products?.data?.map((pro: any) => {
          let sizes = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
          let colors = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );
          data = {
            variation: [...sizes, ...colors],
            sku: pro.variation.sku,
            image: pro.variation.product.images[0]
              ? pro.variation.product.images[0]
              : '',
            name: pro.variation.product.title_en,
            brand: pro.variation.product.brand_id,
            minPrice: pro.price,
            sale_price: pro.sale_price,
            stock: pro?.in_stock,
            quantity: 1,
            id: pro.id,
          };
          return data;
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }
  // search products by value
  serachProductsWithParams(value: any) {
    let data: any;
    this.params = this.params.set('page', 1);
    this.params = this.params.set('per_page', 5);
    this.params = this.params.set('product_name', this.ProductNameValue);
    this.params = this.params.set('sku', this.ProductSKUValue);
    this.params = this.params.set('brand_id', this.ProductBrandValue);

    this.productData$ = this._orderService.paginateProducts(value).pipe(
      map((Products) => {
        this.pageProductNumber = Products.meta.last_page;
        this.totalItems = Products.meta.total;
        return Products?.data?.map((pro: any) => {
          let sizes = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
          let colors = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );
          data = {
            variation: [...sizes, ...colors],
            sku: pro.variation.sku,
            image: pro.variation.product.images[0]
              ? pro.variation.product.images[0]
              : '',
            name: pro.variation.product.title_en,
            brand: pro.variation.product.brand_id,
            minPrice: pro.price,
            sale_price: pro.sale_price,
            stock: pro?.in_stock,
            quantity: 1,
            id: pro.id,
          };
          return data;
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }
  // check search products by value   if value is empty or not
  searchInProducts(productName: any, SKU: any, Brand: any) {
    let data = {
      page: this.pageProductNumber,
      size: this.pageProductSize,
    };
    if (productName === '' && SKU === '' && Brand === '') {
      this.params = this.params.delete('page', this.pageProductNumber);
      this.params = this.params.delete('per_page', 5);
      this.params = this.params.delete('product_name', this.ProductNameValue);
      this.params = this.params.delete('sku', this.ProductSKUValue);
      this.params = this.params.delete('brand_id', this.ProductBrandValue);

      this.handleProductsPageSize(data);
    } else {
      this.params = this.params.set('page', 1);
      this.params = this.params.set('per_page', 5);
      this.params = this.params.set('product_name', this.ProductNameValue);
      this.params = this.params.set('sku', this.ProductSKUValue);
      this.params = this.params.set('brand_id', this.ProductBrandValue);
      this.serachProductsWithParams(this.params);
    }
  }

  // check values search products
  checkProductSearchValue() {
    if (
      this.ProductNameValue === '' &&
      this.ProductSKUValue == '' &&
      this.ProductBrandValue == 0
    ) {
      this.params = this.params.delete('product_name', this.ProductNameValue);
      this.params = this.params.delete('sku', this.ProductSKUValue);
      this.params = this.params.delete('brand_id', this.ProductBrandValue);
      this.productData$ = this.getproducts();
    }
  }
  // clear all value search products
  ClearAllValueSearch() {
    this.ProductNameValue = '';
    this.ProductSKUValue = '';
    this.ProductBrandValue = 0;
    this.params = this.params.delete('product_name', this.ProductNameValue);
    this.params = this.params.delete('sku', this.ProductSKUValue);
    this.params = this.params.delete('brand_id', this.ProductBrandValue);
    this.productData$ = this.getproducts();
  }

  ngOnInit(): void {
    // get all payment methods
    this.getPaymentMethods();
    this._openDialog.visible$.subscribe((visible: any) => this.visible = visible);


    if (sessionStorage.getItem('clientInRowData') !== null) {
      let customer = JSON.parse(sessionStorage.getItem('clientInRowData')!)
      // this.customerSelect = JSON.parse(JSON.stringify(sessionStorage.getItem('clientInRowData')))
      this.customerSelect = customer
      console.log('this.customerSelect', this.customerSelect);

      // this fn ************************
      this.onRowSelectCustomer2()

    }



    // this._orderService.getCustomerAddress(this.customerSelect).subscribe((Details) => {
    //   // console.log(Details);
    //   if (Details.data.length) {
    //     this.customerDetails2 = Details.data
    //     console.log('this.customerDetails2', this.customerDetails2);
    //     this.addressMode = true;
    //     this.display = false;
    //   } else {
    //     this.addressMode = false;
    //     this.display = false;
    //   }

    // })
  }

  onRowSelectCustomer2() {
    // this.customerSelect = value.data;
    // this.addressForm.patchValue({
    //   first_name: this.customerSelect.Name.slice(
    //     0,
    //     this.customerSelect.Name.indexOf(' ')
    //   ),
    //   last_name: this.customerSelect.Name.slice(
    //     this.customerSelect.Name.indexOf(' ') + 1
    //   ),
    //   phoneNumber: this.customerSelect.number,
    //   phoneCode: this.customerSelect.phone.slice(0, 2),
    // });
    this.CoustomerId = this.customerSelect.id;

    // this.walletBalance = value.data.wallet;
    this._orderService
      .getCustomerAddress(this.customerSelect.id)
      .subscribe((Details: any) => {
        if (Details.data.length) {
          Details.data.map((address: any) => {
            if (address.is_default_shipping == 1) {
              this.selectedAddressId = address.id;
            }
          });
          this.customerDetails = Details.data;
          this.countryId = Details.data[0].country_id;

          this.addressMode = true;
          this.display = false;
        } else {
          this.display = false;
          this.addressMode = false;
        }
      });
  }

  setVisible(visible: boolean) {
    this._openDialog.setVisible(visible);
    // localStorage.setItem('visible', JSON.stringify(visible))
  }
}
