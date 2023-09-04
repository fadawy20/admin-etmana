import {
  Component,
  EventEmitter,
  IterableDiffers,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from 'src/app/Services/address-users/address.service';
import { ProfileService } from 'src/app/Services/profileUser/profile.service';
import { toggleFade } from './toggle-fade';
import { ConfirmationService, MessageService } from 'primeng/api';

export enum ControlKeys {
  first_name = 'first_name',
  last_name = 'last_name',
  phoneNumber = 'phoneNumber',
  address_details = 'address_details',
  country_id = 'country_id',
  governorate_id = 'governorate_id',
  city_id = 'city_id',
  additonalNumber = 'additonalNumber',
  setAddress = 'setAddress',
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  animations: [toggleFade],
})
export class AddressComponent implements OnInit {
  hover: boolean = false;
  loader: boolean = true

  data: any[] = [];
  submitted: boolean = false;
  addressId: any;
  customerDetailsIndex: any;
  newAddrssMode: boolean = false;
  editAddressMode: boolean = false;
  params: any;
  country: any[] = [];
  governs: any[] = [];
  cities: any[] = [];
  countryId: number = 1;
  newAddressForm!: FormGroup;
  isDefault: boolean = false;
  msgs: any;
  selectedAddressId: number = 0;
  showModel: boolean = false;
  selectedLang: string = '';
  countries: any[] = [];
  countryName: any;
  constructor(
    private _Router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private iterableDiffers: IterableDiffers,
    private addressSer: AddressService,
    private _profileService: ProfileService,
    private _activateRoute: ActivatedRoute
  ) {
    setTimeout(() => {
      this.loader = false
    }, 800);
    this._profileService.observable.next(
      Number(this._activateRoute.snapshot.paramMap.get('id'))
    );
    // Form new address when add new address
    this.newAddressForm = this.fb.group({
      [ControlKeys.city_id]: ['', [Validators.required]],
      [ControlKeys.governorate_id]: ['', [Validators.required]],
      [ControlKeys.address_details]: ['', [Validators.required]],
      [ControlKeys.first_name]: ['', [Validators.required]],
      [ControlKeys.last_name]: ['', [Validators.required]],
      [ControlKeys.phoneNumber]: ['', [Validators.required]],
      [ControlKeys.additonalNumber]: [''],
      [ControlKeys.setAddress]: [false],
    });
    this.newAddressForm.valueChanges.subscribe((changes: any) => {
      if (isNaN(changes.phoneNumber)) {
        this.newAddressForm.patchValue({
          phoneNumber: changes.phoneNumber.replace(/[a-zA-Z!@#$%^&*]/g, ''),
        });
      }
    });
    this.countryName = localStorage.getItem('Country');
    this.countryId = this.countryName == 'eg' ? 1 : 2;
    // this.addressSer.geCoutries().subscribe((countries) => {
    //   this.country = countries.data;
    // });
    // this.params = new HttpParams();

    this.getGovern();
    // this.selectedLang = localStorage.getItem('LOCALIZE_DEFAULT_LANGUAGE') || '';
    this.getDefaultAddress();
  }

  getDefaultAddress() {
    this.addressSer
      .getAddresses(this._activateRoute.snapshot.paramMap.get('id'))
      .subscribe((res: any) => {
        // this.newAddressForm.get(ControlKeys.phoneNumber)?.setValue('.ankjla');
        this.data = res.data.map((address: any) => {
          return {
            ...address,
            isHovered: false,
          };
        });
      });

  }
  // Get Government in Country by id
  getGovern() {
    this.addressSer.geGovern(this.countryId).subscribe((govern) => {
      this.governs = govern.data;
    });
  }
  getCities(data: any) {
    this.addressSer.geCities(data.value.id).subscribe((city) => {
      this.cities = city.data;
    });
  }
  //
  // change content in dailog when add new address
  translateEdit: any;
  translateSave: any;
  changeNewAddressMode() {
    this.loader = true
    setTimeout(() => {
      this.loader = false
    }, 400);

    this.showModel = true;
    // this.newAddressForm.reset();
    this._profileService.getCLientProfile(Number(this._activateRoute.snapshot.paramMap.get('id'))).subscribe((res) => {
      console.log('result', res.data);
      this.newAddressForm.get(ControlKeys.first_name)?.setValue(res.data.first_name)
      this.newAddressForm.get(ControlKeys.last_name)?.setValue(res.data.last_name)
      this.newAddressForm.get(ControlKeys.phoneNumber)?.setValue(res.data.phone.slice(2))

    })

    // console.log(this.data[0]);
    // console.log(this.data[0].formatted_phone.number);







    // if (this.selectedLang == 'en') {
    //   this.translateEdit = 'Edit Address';
    //   this.translateSave = 'Add a New Address';
    // }
    // else {
    //   this.translateSave = 'اضافه عنوان جديد';
    //   this.translateEdit = 'تغير العنوان';
    // }
    this.translateEdit = 'Edit Address';
    this.translateSave = 'Add a New Address';
    this.editAddressMode = false;
    // this.getGovern();
    // this._CheckoutService.geGovern(this.countryId).subscribe((govern) => {
    //   this.governs = govern.data;
    // });
    this.submitted = false;
  }
  // cancel add new or edit address and change falg check Mode
  cancelNewAddress() {
    this.newAddressForm.reset();
    this.editAddressMode = false;
    // if (this.selectedLang == 'en') {
    //   this.translateEdit = 'Edit Address';
    //   this.translateSave = 'Add a New Address';
    // } else {
    //   this.translateSave = 'اضافه عنوان جديد';
    //   this.translateEdit = 'تغير العنوان';
    // }
    this.translateEdit = 'Edit Address';
    this.translateSave = 'Add a New Address';
    this.showModel = false;
    // this.submitted = true;
  }

  // add new address and edit mode
  setCustomerNewAddress() {
    this.submitted = true;
    // if (this.selectedLang == 'en') {
    //   this.translateEdit = 'Edit Address';
    //   this.translateSave = 'Add a New Address';
    // } else {
    //   this.translateSave = 'اضافه عنوان جديد';
    //   this.translateEdit = 'تغير العنوان';
    // }
    this.translateEdit = 'Edit Address';
    this.translateSave = 'Add a New Address';
    if (this.editAddressMode == true) {
      let obj = {

        client_id: this._activateRoute.snapshot.paramMap.get('id'),
        country_id: this.countryId,
        first_name: this.newAddressForm.get(ControlKeys.first_name)?.value,
        last_name: this.newAddressForm.get(ControlKeys.last_name)?.value,
        phone:
          this.countryName == 'eg'
            ? '+2' + this.newAddressForm.get(ControlKeys.phoneNumber)?.value
            : '+966' + this.newAddressForm.get(ControlKeys.phoneNumber)?.value,
        governorate_id: this.newAddressForm.get(ControlKeys.governorate_id)
          ?.value?.id,
        address_details: this.newAddressForm.get(ControlKeys.address_details)
          ?.value,
        city_id: this.newAddressForm.get(ControlKeys.city_id)?.value?.id,
        is_default_shipping:
          this.newAddressForm.get(ControlKeys.setAddress)?.value == true
            ? 1
            : 0,
        additonalNumber: this.newAddressForm.get(ControlKeys.additonalNumber)
          ?.value,
      };

      if (this.newAddressForm.valid) {
        this.submitted = false;
        this.addressSer
          .updatCustomerAddress(this.addressId, obj)
          .subscribe((res) => {
            this.data[this.customerDetailsIndex] = res.data;
            this.addressSer
              .getAddresses(this._activateRoute.snapshot.paramMap.get('id'))
              .subscribe((Details: any) => {
                Details.data.map((address: any) => {
                  if (address.is_default_shipping == 1) {
                    this.selectedAddressId = address.id;
                  }

                  this.data = Details.data;
                });
              });
            let severity: any, summary: any, detail: any;
            // if (this.selectedLang == 'en') {
            //   summary = 'Updated Addresses';
            //   detail = 'Your Addresses is Updated successfully';
            // } else {
            //   summary = 'تعديل العنوان';
            //   detail = 'تم تعديل العنوان بنجاح';
            // }
            summary = 'Updated Addresses';
            detail = 'Your Addresses is Updated successfully';
            this.messageService.add({
              severity: 'success',
              summary: summary,
              detail: detail,
            });
            this.addressId = res.data.id;
            this.showModel = false;
            this.newAddressForm.reset();
          });
      } else {
        this.submitted = true;
      }
    } else {
      let obj = {
        client_id: this._activateRoute.snapshot.paramMap.get('id'),
        country_id: this.countryId,
        first_name: this.newAddressForm.get(ControlKeys.first_name)?.value,
        last_name: this.newAddressForm.get(ControlKeys.last_name)?.value,
        phone:
          this.countryName == 'eg'
            ? '+2' + this.newAddressForm.get(ControlKeys.phoneNumber)?.value
            : '+966' + this.newAddressForm.get(ControlKeys.phoneNumber)?.value,
        governorate_id: this.newAddressForm.get(ControlKeys.governorate_id)
          ?.value?.id,
        city_id: this.newAddressForm.get(ControlKeys.city_id)?.value?.id,
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

        this.addressSer.setCustomerAddress(obj).subscribe((res) => {
          if (res.data.is_default_shipping == 1) {
            this.selectedAddressId = res.data.id;
          }

          this.data.push(res.data);
          this.addressId = res.data.id;
          this.addressSer
            .getAddresses(this._activateRoute.snapshot.paramMap.get('id'))
            .subscribe((Details: any) => {
              Details.data.map((address: any) => {
                if (address.is_default_shipping == 1) {
                  this.selectedAddressId = address.id;
                }
              });
              this.data = Details.data;
            });
          this.showModel = false;
          let severity: any, summary: any, detail: any;
          // if (this.selectedLang == 'en') {
          //   summary = 'Add Addresses';
          //   detail = 'Your Addresses is Adding successfully';
          // } else {
          //   summary = 'اضافع العنوان';
          //   detail = 'تم اضافه العنوان بنجاح';
          // }
          summary = 'Add Addresses';
          detail = 'Your Addresses is Adding successfully';
          this.messageService.add({
            severity: 'success',
            summary: summary,
            detail: detail,
          });
          this.newAddressForm.reset();
        });
      } else {
        this.submitted = true;
      }
    }
  }
  // set value in form new address
  handleEditAddressCustomer(data: any, index: number) {
    // console.log('data in edit', data);

    this.loader = true
    setTimeout(() => {
      this.loader = false
    }, 400);
    this.submitted = false;
    this.addressId = data.id;
    this.customerDetailsIndex = index;
    this.showModel = true;
    this.editAddressMode = true;
    // if (this.selectedLang == 'en') {
    //   this.translateEdit = 'Edit Address';
    //   this.translateSave = 'Add a New Address';
    // } else {
    //   this.translateSave = 'اضافه عنوان جديد';
    //   this.translateEdit = 'تغير العنوان';
    // }
    this.translateEdit = 'Edit Address';
    this.translateSave = 'Add a New Address';
    this.getGovern();

    this.newAddressForm
      .get(ControlKeys.governorate_id)
      ?.setValue(data.governorate);
    this.addressSer.geCities(data.governorate_id).subscribe((city) => {
      this.cities = city.data;
      this.newAddressForm.get(ControlKeys.city_id)?.setValue(data.city);
    });
    this.newAddressForm.get(ControlKeys.first_name)?.setValue(data.first_name);
    this.newAddressForm.get(ControlKeys.last_name)?.setValue(data.last_name);
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
  // deleteAddressClient(data: any) {
  //   let head: any,
  //     message: any,
  //     detail: any,
  //     success: any,
  //     severity: any,
  //     failDetail: any,
  //     summary: any;
  //   if (this.selectedLang == 'en') {
  //     head = 'Confirmation';
  //     message = 'do you want to delete this Address ? ';
  //     success = 'success';
  //     detail = 'this Address is Deleted successfully';
  //     failDetail = 'Rejected';
  //     summary = 'You have rejected';
  //   } else {
  //     head = 'التأكيد';
  //     message = 'هل تريد حذف هذا العنوان؟ ';
  //     success = 'تمت العمليه بنجاخ';
  //     detail = 'تم حذف هذا العنوان بنجاح';
  //     failDetail = 'فشلت';
  //     summary = 'فشلت العمليه';
  //   }
  //   this.confirmationService.confirm({
  //     message: message,
  //     header: head,
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.addressSer.deleteAddress(data.id).subscribe((data: any) => {
  //         this.messageService.add({
  //           severity: 'info',
  //           summary: success,
  //           detail: detail,
  //         });
  //         this.addressSer
  //           .getAddresses(this._activateRoute.snapshot.paramMap.get('id'))
  //           .subscribe((Details: any) => {
  //             this.data = Details.data;
  //             if (Details.data.length > 0) {
  //               this.data = Details.data;
  //             } else {
  //               this.showModel = false;
  //               this.newAddressForm.reset();
  //               this.isDefault = false;
  //             }
  //           });
  //       });
  //     },
  //     reject: () => {
  //       this.msgs = [
  //         {
  //           severity: 'info',
  //           summary: summary,
  //           detail: failDetail,
  //         },
  //       ];
  //     },
  //   });
  // }

  deleteAddressClient(data: any, index: any) {
    //   let head: any,
    //     message: any,
    //     detail: any,
    //     success: any,
    //     severity: any,
    //     failDetail: any,
    //     summary: any;
    //   if (this.selectedLang == 'en') {
    //     head = 'Confirmation';
    //     message = 'do you want to delete this Address ? ';
    //     success = 'success';
    //     detail = 'this Address is Deleted successfully';
    //     failDetail = 'Rejected';
    //     summary = 'You have rejected';
    //   } else {
    //     head = 'التأكيد';
    //     message = 'هل تريد حذف هذا العنوان؟ ';
    //     success = 'تمت العمليه بنجاخ';
    //     detail = 'تم حذف هذا العنوان بنجاح';
    //     failDetail = 'فشلت';
    //     summary = 'فشلت العمليه';
    //   }
    console.log('index', index);
    console.log('data', data);

    this.addressSer.deleteAddress(data.id).subscribe((data) => {
      console.log(data);



      if (data.message == 'Operation accomplished successfully !') {
        console.log('Done');
        this.data.splice(index, 1)
        localStorage.setItem('AdressOfData', JSON.stringify(this.data))
      }


    })
  }

  hoverOn(index: number) {
    this.data[index].isHovered = true;
  }
  hoverOff(index: number) {
    this.data[index].isHovered = false;
  }

  ngOnInit(): void {
    // const storedArrayAdress = localStorage.getItem('AdressOfData')
    // if (storedArrayAdress) {
    //   this.data = JSON.parse(storedArrayAdress)
    // }
    this.getAdressOfData()

  }

  getAdressOfData() {
    if ('AdressOfData' in localStorage) {
      this.data = JSON.parse(localStorage.getItem('AdressOfData')!);
    }
    console.log(this.data);

  }

}
