import { OrderService } from './../../../Services/order.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MatExpansionModule } from '@angular/material/expansion';

type TStatus = { 'orderStatus': boolean, 'itemStatus': boolean, 'rtoReason': boolean }
// class STATUS {
//   orderStatus = false
//   itemStatus = false
// }

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

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],

})
export class ViewOrderComponent implements OnInit {
  selectedItem: any
  selectedShipmentProduct: any
  image: string = '';
  ordersDetails: any[] = [];
  status: any[] = [];
  statusItem: any[] = [];
  orderId: any;
  statusVal: any;
  itemStatusVal: number = 0;
  commentVal: string = '';
  newAddressForm!: FormGroup;
  submitted: boolean = false;
  governs: any[] = [];
  cities: any[] = [];
  display: boolean = false;
  countryId: number = localStorage.getItem('Country') === 'eg' ? 1 : 2;
  CoustomerId?: number;
  customerAddress: any;
  addressId: number = 0;
  show: any = true
  currency: any
  citiesOF: City[] | undefined;
  selectedCityForTest: City | undefined;
  rtoReasons: any[] = []
  RtoReasons: any[] = []
  collectingResult: any = []
  // panelOpenState : any = true
  // panelOpenState = false
  constructor(
    private _router: Router,
    private _order: OrderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private _authService: AuthService
  ) {
    // this.citiesOF = [
    //   { name: 'New York', code: 'NY' },
    //   { name: 'Rome', code: 'RM' },
    //   { name: 'London', code: 'LDN' },
    //   { name: 'Istanbul', code: 'IST' },
    //   { name: 'Paris', code: 'PRS' }
    // ];

    this.currency = this._authService.currency



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
    this.status = [
      { id: 2, name: "PAYMENT_FAILED", label: "Payment failed" },
      { id: 1, name: "PENDING_PAYMENT", label: "Pending payment" },

      { id: 3, name: 'PENDING', label: 'Pending' },
      { id: 4, name: 'VALIDATED', label: 'Validated' },
      {
        id: 5,
        name: 'PENDING_SELLERS_CONFIRMATION',
        label: 'Pending seller confirmation',
      },
      { id: 6, name: 'READY_TO_SHIP', label: 'Ready to ship' },
      { id: 7, name: 'OUT_FOR_DELIVERY', label: 'Out For Delivery' },
      { id: 8, name: 'PARTIALLY_DELIVERED', label: 'Partially delivered' },
      { id: 9, name: 'LOGISTICS_ISSUE', label: 'Logistics issue' },
      { id: 10, name: 'SELLER_ISSUE', label: 'Seller issue' },
      { id: 11, name: 'CUSTOMER_ISSUE', label: 'Customer isseu' },
      { id: 12, name: 'DELIVERED', label: 'Delivered' },
      { id: 13, name: 'RETURN_REQUEST', label: 'Return request' },
      { id: 14, name: 'OUT_FOR_RETURN', label: 'Out for return' },
      { id: 15, name: 'PARTIALLY_RETURNED', label: 'Partially returned' },
      { id: 16, name: 'RETURNED', label: 'Returned' },
      { id: 17, name: 'WITHIN_RTO', label: 'Within rto' },
      { id: 18, name: 'RTO', label: 'Rto' },
      { id: 19, name: 'COMPLETE', label: 'Complete' },
      { id: 20, name: 'CANCELED', label: 'Canceled' },
      { id: 21, name: 'CLOSED', label: 'Closed' },
      {
        id: 22,
        name: 'COMPLETE_PARTIAL_REFUND',
        label: 'Complete partial refund',
      },
      {
        id: 25,
        name: 'REJECTED',
        label: 'Rejected',
      },
      {
        id: 26,
        name: 'READY_FOR_PICKUP',
        label: 'Ready for Pickup',
      },
      {
        id: 23,
        name: 'ON_HOLD',
        label: 'On Hold',
      },
    ];
    this.statusItem = [
      { id: 1, name: "PENDING", label: "Pending" },
      { id: 2, name: "ORDERED ", label: "Ordered" },
      { id: 3, name: "SHIPPED", label: "Shipped" },

      { id: 4, name: 'READY_TO_SHIP', label: 'Ready To Ship' },
      { id: 5, name: 'DELIVERED', label: "Delivered" },
      { id: 6, name: 'RETURNED ', label: "Returned" },
      { id: 7, name: 'REFUNDED ', label: "Refunded" },
      { id: 8, name: 'CANCELED ', label: "Canceled" },
      { id: 9, name: 'COMPLETE', label: "Complete" },
      { id: 10, name: 'CLOSED', label: "Closed" },
      { id: 11, name: 'RTO', label: "Rto" },
      { id: 12, name: 'PENDING_PAYMENT', label: "Pending Payment" },
      { id: 16, name: 'NEED_TO_ACTION', label: "Need To Action" },
      { id: 13, name: 'ON_HOLD', label: "On Hold" },
      { id: 14, name: 'READY_FOR_PICKUP ', label: "Ready For Pickup" },
      { id: 15, name: 'REJECTED ', label: "Rejected" },
    ];
    this.rtoReasons = [
      { id: 1, name: 'Out of Stock', label: 'Out of Stock ' },
      { id: 2, name: 'No Answer', label: 'No Answer' },
      { id: 3, name: 'CST Changed His Mind', label: 'CST Changed His Mind' },
      { id: 4, name: 'Fake Order', label: 'Fake Order' },
      { id: 5, name: 'Delivery SLA', label: 'Delivery SLA' },
      { id: 6, name: 'Test Order', label: 'Test Order' },
      { id: 7, name: 'Edit Order Item', label: 'Edit Order Item' },
      { id: 8, name: 'Incomplete Purchasing Process', label: 'Incomplete Purchasing Process' },
      { id: 9, name: 'Find Another offer out of Etmana', label: 'Find Another offer out of Etmana' },
      { id: 10, name: 'Find Another offer on Etmana', label: 'Find Another offer on Etmana' },
      { id: 11, name: 'Out of Zone', label: 'Out of Zone' },
      { id: 12, name: 'High Shipping Fees', label: 'High Shipping Fees' },
    ]
    this.RtoReasons = [
      { id: 1, name: 'Not allowed to open', label: 'Not allowed to open' },
      { id: 2, name: 'Rescheduled out of SLA', label: 'Rescheduled out of SLA' },
      { id: 3, name: 'Fake order', label: 'Fake order' },
      { id: 4, name: 'Customer Unreachable', label: 'Customer Unreachable' },
      { id: 5, name: 'Size issue', label: 'Size issue' },
      { id: 6, name: 'Courier Attitude', label: 'Courier Attitude' },
      { id: 7, name: 'Customer requested exchange for a different size', label: 'Customer requested exchange for a different size' },
      { id: 8, name: 'Late Delivery', label: 'Late Delivery' },
      { id: 9, name: 'Fake update', label: 'Fake update' },
      { id: 10, name: 'The customer changed his mind', label: 'The customer changed his mind' },
      { id: 11, name: 'The customer refused partial receipt', label: 'The customer refused partial receipt' },
      { id: 12, name: 'Wrong Item', label: 'Wrong Item' },
      { id: 12, name: 'Customer Bad Attitude', label: 'Customer Bad Attitude' },
      { id: 12, name: 'Cancel order', label: 'Cancel order' },
      { id: 12, name: 'Unserviced Area', label: 'Unserviced Area' },
    ]
  }
  commentsArr: any[] = [];
  client: any;
  selected_shipment_item: any

  foundReasonRto: any
  foundReasonCancellation: any
  staticArray: any[] = [1, 2, 3, 4]
  updateArrayCancelAndRto: any[] = [];
  orderLogs: any[] = []
  lastComment: any
  ngOnInit(): void {

    // ***
    // this is handle the cancellation and rto reasons that comes from the backend api and i handled this to show correctly
    // ***
    this._order.getReasonsOfCancellationAndRto().subscribe((res) => {
      this.updateArrayCancelAndRto = res.data
    })

    // *****
    // this is handle the cancellation and rto reasons that comes from the backend api and i handled this to show correctly
    // ****




    this.route.params.subscribe((data: any) => {
      this.orderId = data?.id;
      // console.log('This is order id', this.orderId);

      if (data.id) {
        this._order.showOrders(data.id).subscribe((res: any) => {

          console.log('this is order logs', res.data.order_logs);
          this.orderLogs = res.data.order_logs;
          console.log('order logs', this.orderLogs);
          let x = this.recursiveArray(res.data?.order_logs, res.data.order_logs.length)
          console.log(x);

          this.lastComment = this.recursiveArray(res.data?.order_logs, res.data.order_logs.length);
          console.log('this is last comment by user', this.lastComment);


          this.client = res.data.client;
          this.statusVal = res.data?.status;
          this.customerAddress = res?.data?.shipping_address;
          this.addressId = res?.data?.shipping_address.id;
          this.ordersDetails.push(res.data);
          // console.log('order Details', this.ordersDetails);
          // this.selectedItem = this.ordersDetails[0].status.name
          // This is for status general
          this.selectedItem = this.status.find((option) => option.name === this.ordersDetails[0].status.name);
          console.log('this.selectedItem', this.selectedItem);

          // console.log('This is shippments', this.ordersDetails[0].shipment_items);



          this.ordersDetails[0].shipment_items.forEach((item: any) => {
            // console.log(item);
            this.selectedShipmentProduct = this.statusItem.find((option) => option.id === item.status.id)
            // console.log('sseleted shipment ', this.selectedShipmentProduct);
          })

          // this.staticArray.forEach((item)=> {
          //   this.foundReasonRto = this.RtoReasons.find((option)=> option.id === item)
          //   console.log('this is found Reason RTo', this.foundReasonRto);

          // })



          // This is will update the status of the shipment item as well as  sent from backend
          // and this is 3 is static to test , and you can change this 3 to reason_id from backend

          // const matchingItems = this.RtoReasons.filter(item1 => this.staticArray.some(item2=> item2 ===item1.id))
          // console.log('this is matching items', matchingItems);

          // this.foundReasonRto = this.RtoReasons.find((reason)=> reason.id === 3 )
          // console.log('this is found reasonn for Rto', this.foundReasonRto);
          // this.foundReasonCancellation = this.rtoReasons.find((reason)=> reason.id === 3)
          // console.log('this is found reasonn for Cancellation', this.foundReasonCancellation);















          // this.itemShipmentStatus =this.statusItem.find((option)=> th)
          // this.selectedShipmentProduct = this.statusItem.find((option) => option.id === this.ordersDetails[0].shipment_items[0].status.id)
          // console.log(this.ordersDetails[0].shipment_items[0].status.name, 'name is');

          // console.log('sseleted shipment ', this.selectedShipmentProduct);

          // console.log('sssssssss', this.ordersDetails[0].shipment_items);


          const shipment_items = this.ordersDetails[0].shipment_items
          // console.log('shipment_items', shipment_items);

          // const result: any = [];

          for (const obj of shipment_items) {
            const existingObj = this.collectingResult.find((o: { seller_variation_id: number }) => o.seller_variation_id === obj.seller_variation_id)
            if (!existingObj) {
              this.collectingResult.push({
                ...obj,
                related: [],
              });
            } else {
              existingObj.related?.push({
                ...obj
              });
            }
          }

          console.log('this.collectingResult', this.collectingResult);

          // for (const obj of data) {
          //   const existingObj = result.find((o: { id: number }) => o.id === obj.id);

          //   if (!existingObj) {
          //     result.push({
          //       ...obj,
          //       related: [],
          //     });
          //   }
          //   else {
          //     existingObj.related.push({
          //       ...obj
          //     });
          //   }
          // }















          // const arr = shipment_items.map((item : any) =>({...item, 'related' : []}))
          // const newArry = [...arr]
          // console.log('NEw Array', newArry);

          // console.log('This is a shipment NEW array', arr);





          // this.selected_shipment_item = this.statusItem.find(())
          this.itemStatusVal = this.ordersDetails[0].status.id
          // console.log(this.itemStatusVal, 'this is item status id ==============> , i test here');
          this.commentsArr = res.data.order_logs;
          console.log('comments array', this.commentsArr);

          res.data.order_logs.map((ele: any) => {
            if (ele.user_type) {
              ele.user_type = ele.user_type.slice(
                ele.user_type.lastIndexOf('\\') + 1
              );
            }
          });
        });
      }
    });

    // this.selectedItem = this.ordersDetails[0].status.name
    // console.log('  this.selectedItem', this.selectedItem);

  }

  recursiveArray(array: any[], len: number): any {
    // console.log(len);

    if (array[len - 1]?.user)
      return array[len - 1]
    if (len - 1 === 0) return []
    if (len === 0) return []

    return this.recursiveArray(array, len - 1)
  }

  backToOrder() {
    this._router.navigate(['Dashboard/order']);
  }

  rtoReasonId !: number
  idProduct: any
  statusProductID: any
  showReason: any = true
  getRtoReason(event: any, idProduct: any, statusProductId: any) {
    // console.log('This is event bla bla', event.value);
    console.log('This is event', event.value.id, 'this is id product', idProduct, 'status product', statusProductId);
    this.idProduct = idProduct
    this.statusProductID = statusProductId

    this.rtoReasonId = event.value.id;
    console.log('This is rto reason id', this.rtoReasonId);
    this.swapSave.rtoReason = true

    this.showReason = false

  }
  // check() {
  //   if (this.getItemId === 0) {
  //     this.updateStatus();
  //   }
  //   else if (this.getItemId !== 0 && this.itemStatusVal) {
  //     // this.updateStatus();
  //     this.updateItemStatus(this.getItemId);
  //   } else {
  //     this.updateItemStatus(this.getItemId);
  //   }
  // }
  updateReasonOnly(reasonId: any, statusItem: any, idProduct: any) {
    let obj = {
      "shipment_products": [
        {
          "id": idProduct,
          "status": statusItem,
          "reason_id": reasonId
        },
      ],
      // notes: this.commentVal,
    }
    // console.log('this is obj that i was trying to sent', obj);
    this._order.updateItemStatusForRtoReason(this.orderId, obj).subscribe((res) => {
      console.log('This is rto reson is successfully', res);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Shipment product status updated',
      });
    })

  }


  updateComment() {
    this.updateStatus()
  }
  check() {
    // if (this.getItemId === 0) {
    //   this.updateStatus();
    // }
    // else if (this.getItemId !== 0) {
    //   this.updateItemStatus(this.getItemId, this.itemShipmentStatus);
    //   // this.updateStatus()


    // }

    console.log(this.swapSave);

    if (this.swapSave.orderStatus)
      this.updateStatus();
    if (this.swapSave.itemStatus && this.swapSave.rtoReason)
      this.updateItemRtoReason(this.rtoReasonId, this.itemShipmentStatus)


    else if (this.swapSave.rtoReason) {
      // console.log('this is reason =====>', this.rtoReasonId, 'this is id product ==>', this.idProduct, 'this is status ===>', this.statusProductID);
      this.updateReasonOnly(this.rtoReasonId, this.statusProductID, this.idProduct)

    }

    // if(this.swapSave.rtoReason)
    // this.updateItemRtoReason(this.rtoReasonId, this.itemShipmentStatus)

    // console.log('Thiis is saved');
    // if(this.swapSave.rtoReason)
    // this.updateItemRtoReason(this.rtoReasonId, this.itemShipmentStatus)
    else if (this.swapSave.itemStatus)
      this.updateItemStatus(this.getItemId, this.itemShipmentStatus)



    // reset
    // this.swapSave = new STATUS()
    this.swapSave.itemStatus = false
    this.swapSave.orderStatus = false
    this.swapSave.rtoReason = false

    //  else
    //   this.updateStatus()
    // this.updateItemStatus(this.getItemId, this.itemShipmentStatus);


  }

  swapSave: TStatus = { itemStatus: false, orderStatus: false, rtoReason: false }
  getItemId: number = 0;
  itemShipmentStatus: any
  // showWhenRto = false
  showWhenRto: boolean = true
  getItemsId(id: number, event: any) {
    console.log('selectedShipmentProduct', this.selectedShipmentProduct);
    console.log('event', event);


    this.show = false

    if ((event.value?.id !== 11 || event.value?.id !== 8)) {
      this.showWhenRto = false
      console.log('inside this , showWhenRto', this.showWhenRto);
    }
    // if (this.selectedShipmentProduct.id === 11 || this.selectedShipmentProduct.id === 8) {
    //   this.showWhenRto = !this.showWhenRto
    //   console.log('Show when Rto', this.showWhenRto);

    // }
    this.swapSave.itemStatus = true
    this.getItemId = id;
    console.log('This is the get itemId', this.getItemId);

    this.itemShipmentStatus = event.value.id

    console.log('this is the itemShipmentStatus', this.itemShipmentStatus);

  }
  showProductChild: boolean = false
  toggleOpenAndClose() {
    this.showProductChild = !this.showProductChild
  }
  updateStatus() {
    let obj = {};
    // مش هيدخل هنا خلاص
    if (this.itemStatusVal === 0) {
      obj = {
        shipment_id: null,
        // "status": this.itemStatusVal === 0 ? '' :this.itemStatusVal,
        notes: this.commentVal,

      };
      this._order.updateStatus(this.orderId, obj).subscribe((res) => {
        this.commentsArr = res.data.order_logs;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'this comment is created successfully',
        });
        this.commentVal = '';
        this.commentsArr.map((ele: any) => {
          if (ele.user_type) {
            ele.user_type = ele.user_type.slice(
              ele.user_type.lastIndexOf('\\') + 1
            );
          }
        });
      });
    } else if (this.itemStatusVal !== 0) {
      obj = {
        shipment_id: null,
        status: this.itemStatusVal,
        notes: this.commentVal,
      };
      console.log('updated Done');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'this is created successfully',
      });
      this._order.updateStatus(this.orderId, obj).subscribe((res) => {
        // console.log('i am here');
        // console.log(res, 'This is res');


        this.commentsArr = res.data.order_logs;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'this is created successfully',
        });
        this.commentVal = '';
        this.commentsArr.map((ele: any) => {
          if (ele.user_type) {
            ele.user_type = ele.user_type.slice(
              ele.user_type.lastIndexOf('\\') + 1
            );
          }
        });
      });

    }

  }

  getRelatedProduct(data: any) {
    console.log('This is related product', data);

  }

  getStatusValue(event: any) {
    this.itemStatusVal = event.value.id;
    this.swapSave.orderStatus = true

    console.log('status item', this.selectedItem);


  }
  updateItemStatus(id: number, itemShipmentStatus: any) {
    let obj: any = {};
    if (this.itemStatusVal === 0) {
      obj = {
        shipment_product_id: id,
        status: itemShipmentStatus === 0 ? null : itemShipmentStatus,
        notes: this.commentVal,
      };
    } else {
      obj = {
        shipment_product_id: id,
        status: itemShipmentStatus === 0 ? null : itemShipmentStatus,
        notes: this.commentVal,
      };
    }
    this._order.updateItemStatus(this.orderId, obj).subscribe((res) => {
      // console.log('res', res);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Shipment product status updated',
      });

    });
  }

  updateItemRtoReason(id: number, itemShipmentStatus: any) {
    console.log('This is id', id, 'This is status', itemShipmentStatus);
    let obj = {
      "shipment_products": [
        {
          "id": this.getItemId,
          "status": itemShipmentStatus,
          "reason_id": id
        },
      ],
      // notes: this.commentVal,
    }
    this._order.updateItemStatusForRtoReason(this.orderId, obj).subscribe((res) => {
      console.log('This is rto reson is successfully', res);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Shipment product status updated',
      });
    })


  }


  cancelNewAddress() {
    this.display = false;
    this.newAddressForm.reset();
    this.submitted = false;
  }

  // Get Government in Country by id
  getGovern() {
    this._order.geGovern(this.countryId).subscribe((govern) => {
      this.governs = govern.data;
    });
    if (this.countryId == 1) {
      this.newAddressForm.get('phoneCode')?.setValue('+2');
    } else {
      this.newAddressForm.get('phoneCode')?.setValue('+966');
    }
  }
  // Get all Cities in Government by id
  getCities(id: number) {
    // this.getGovernId = id;
    this._order.geCities(id).subscribe((city) => {
      this.cities = city.data;
    });
  }
  //

  setCustomerNewAddress() {
    this.submitted = true;
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
        // this.newAddressForm.get(ControlKeys.setAddress)?.value == true? 1: 0
        1,
      address_details: this.newAddressForm.get(ControlKeys.address_details)
        ?.value,
    };
    if (this.newAddressForm.valid) {
      this.submitted = false;

      this._order
        .updatCustomerAddressInDetails(this.addressId, obj)
        .subscribe((res) => {
          this._order.showOrders(this.orderId).subscribe((res: any) => {
            this.customerAddress = res?.data?.shipping_address;
            this.newAddressForm.reset();
            this.display = false;
          });
        });
    } else {
      this.submitted = true;
    }
  }

  // set value in form new address
  handleEditAddressCustomer() {
    this.submitted = false;
    this.display = true;
    this.getGovern();
    this.newAddressForm
      .get(ControlKeys.governorate_id)
      ?.setValue(this.customerAddress.governorate_id);
    this.newAddressForm
      .get(ControlKeys.city_id)
      ?.setValue(this.customerAddress.city_id);

    this.newAddressForm
      .get(ControlKeys.first_name)
      ?.setValue(this.customerAddress.first_name);
    this.newAddressForm
      .get(ControlKeys.last_name)
      ?.setValue(this.customerAddress.last_name);
    this.newAddressForm
      .get(ControlKeys.phoneCode)
      ?.setValue(this.customerAddress.formatted_phone?.code);
    this.newAddressForm
      .get(ControlKeys.phoneNumber)
      ?.setValue(this.customerAddress.formatted_phone?.number);
    this.newAddressForm
      .get(ControlKeys.setAddress)
      ?.setValue(this.customerAddress.is_default_shipping == 1 ? true : false);
    this.newAddressForm
      .get(ControlKeys.address_details)
      ?.setValue(this.customerAddress.address_details);
    this.newAddressForm
      .get(ControlKeys.additonalNumber)
      ?.setValue(this.customerAddress.additonalNumber);
  }
  // direct to customer orders
  directToCustomerOrders(id: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id },
      skipLocationChange: true
    };
    // console.log('id', id);
    this._router.navigate(['/Dashboard/users/profile/orders/', id])

  }
  //store crdeit
  storeCreditOrderId(itemId: number) {
    sessionStorage.setItem('storeCreditID', JSON.stringify(itemId));
    console.log(itemId);

  }
}
