import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';
import { OrderService } from 'src/app/Services/order.service';
import { ShippingService } from 'src/app/Services/shipping.service';
import { controlKeys } from '../../users/users.component';

export enum ControlKeys {
  name = 'name',
  shipping_fees = 'shipping_fees',
  applied_on_all_cities = 'applied_on_all_cities',
  cities = 'cities',
  country_id = 'country_id',
  platform = 'platform',
  rule_ordering = 'rule_ordering',
  minimum_type = 'minimum_type',
  minimum_value = 'minimum_value',
  customer_eligibility = 'customer_eligibility',
  customers = 'customers',
  usage_limits = 'usage_limits',
  has_date = 'has_date',
  is_active = 'is_active',
  date_from = 'date_from',
  date_to = 'date_to'
}
@Component({
  selector: 'app-create-shipping-rule',
  templateUrl: './create-shipping-rule.component.html',
  styleUrls: ['./create-shipping-rule.component.scss'],

})

export class CreateShippingRuleComponent implements OnInit {
  selectedOption: any;
  Loading: boolean = false;
  governmentSelected: any
  shippingForm!: FormGroup
  allGovern: any[] = []
  allCities: any[] = []
  citiesSelectedOfGovern: any[] = []
  // selectedGovern: any = 0
  website: any[] = []

  platform: any[] = []
  cities: any[] = []
  checkCities: boolean = false
  checkCitiesofSelectedCountry: boolean = false
  Visibility: boolean = false
  minimumValue: string = ''
  eligibilityValue: string = ''
  usageLimitValue: string = ''
  selectedIndex?: number;
  hasExpiry: boolean = false
  countryId?: number
  customers: any[] = []
  routerId: any
  loader: boolean = false
  editShippingMode: boolean = false
  submitted: boolean = false
  checkSpecificCustomer: boolean = true
  minimumArray: any[] = [
    { id: 1, name: 'None' },
    { id: 2, name: 'Minimum purchase amount' },
    { id: 3, name: 'Minimum order items' }
  ];
  eligibilityArray: any[] = [
    { id: 1, name: 'Everyone' },
    { id: 2, name: 'New Customer' },
    { id: 3, name: 'Specific Customer' }
  ];
  usageLimitsArray: any[] = [
    { id: 1, name: 'Onetime per user' },
    { id: 2, name: 'Many times' },
  ]
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private _activetedRoute: ActivatedRoute,
    private _ShippingService: ShippingService,
    private datePipe: DatePipe,
    private _OrderService: OrderService,
    // private mySubscription: Subscription = new Subscription()
  ) {

    // console.log('this is form control country id', this.shippingForm);


    // console.log('this is se');

    // get id in paramsUrl and set id in var
    this._activetedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id')) {
        this.editShippingMode = true
        this.routerId = params.get('id');
        this.handleShippingForm()
      }

    })

    this.shippingForm = this.fb.group({
      [ControlKeys.name]: ['', [Validators.required]],
      [ControlKeys.shipping_fees]: ['', [Validators.required]],
      [ControlKeys.cities]: ['', [Validators.required]],
      [ControlKeys.country_id]: ['', [Validators.required]],
      [ControlKeys.platform]: ['', [Validators.required]],
      [ControlKeys.rule_ordering]: ['', [Validators.required]],
      [ControlKeys.minimum_type]: ['', [Validators.required]],
      [ControlKeys.minimum_value]: ['', [Validators.required]],
      [ControlKeys.customer_eligibility]: ['', [Validators.required]],
      [ControlKeys.customers]: [[], [Validators.required]],
      [ControlKeys.usage_limits]: ['', [Validators.required]],
      [ControlKeys.is_active]: [false, [Validators.required]],
      [ControlKeys.date_from]: ['', [Validators.required]],
      [ControlKeys.date_to]: ['', [Validators.required]],
      [ControlKeys.applied_on_all_cities]: [false, [Validators.required]],
      // "governs": [""],
    })
    this.website = [
      { name: 'Egypt', code: 1 },
      { name: 'Saudi Arabia', code: 2 },
    ];
    this.platform = [
      { name: 'Website', code: 1 },
      { name: 'Mobile App', code: 3 },
      { name: 'All', code: 5 },
    ];
    this.getCustomers()

    // console.log(this.checkCities);

  }

  onCheckboxChange(event: any) {
    // console.log('Checkbox changed:', event.source.value);
    // this.allCities = event.source.value
    this.cities = event.source.value
    console.log(this.cities);

  }

  hideAmount: boolean = true
  checkMinimumType() {
    this.shippingForm.get(ControlKeys.minimum_type)?.valueChanges.subscribe((value: number) => {
      if (value === 1) {

        this.shippingForm.removeControl(ControlKeys.minimum_value);
        this.hideAmount = false
      }
      else {
        this.shippingForm.addControl(ControlKeys.minimum_value, this.fb.control('', [Validators.required]));
        this.hideAmount = true
      }

    })
  }
  checkCustomerType() {
    this.shippingForm.get(ControlKeys.customer_eligibility)?.valueChanges.subscribe((value: number) => {
      if (value === 1 || value === 2) {

        this.shippingForm.removeControl(ControlKeys.customers);
      }
      else {
        this.shippingForm.addControl(ControlKeys.customers, this.fb.control('', [Validators.required]));
      }

    })
  }
  checkCitiesFlag() {
    // console.log(this.checkCities);


    if (this.checkCities === true) {
      this.shippingForm.removeControl(ControlKeys.cities);
      this.shippingForm.removeControl(ControlKeys.applied_on_all_cities);
      this.shippingForm.addControl(ControlKeys.applied_on_all_cities, this.fb.control(true, [Validators.required]));
      this.shippingForm.addControl(ControlKeys.cities, this.fb.control([]));

    }
    else {
      this.shippingForm.addControl(ControlKeys.cities, this.fb.control('', [Validators.required]));
    }

  }
  checkingSpecificCustomer(value: any) {
    if (value === 3) {

      this.checkSpecificCustomer = true
    }
    else {
      this.checkSpecificCustomer = false
    }

  }
  getCountries(id: any) {
    console.log(this.shippingForm.get(ControlKeys.country_id)?.value);

    // console.log('this is id of country for drop down', id);
    // console.log('this is selected option', this.selectedOption);


    this._OrderService.geGovern(id.code).subscribe((govern) => {
      // console.log('this is govern of cities in select', govern);
      this.allGovern = govern.data
      console.log('this is all govern', this.allGovern);

    })

    this.countryId = id.code
    this.shippingForm.get("cities")?.setValue('')
    this._ShippingService.geCities(id.code).subscribe((res) => {
      this.cities = res.data
    })

  }
  // Get all Cities in Government by id
  selectedItem : any
  allCitiesOfGovern: any[] = []
  uniqueArrayOfCities : any[] = []
  uniqueIdArrayOfCities : any[] = []
  uniqueAssignControl : any[] = []
  finishedArrayOfCities : number[] = []
  newArray : any[] = []


  // onSelectionChangeGovern(id: any) {
  //   // this.checkCitiesofSelectedCountry = true


  //   //id here is coming an array
  //   // id.forEach((element : any) => {
  //   //   console.log('this is element', element);
  //   //    this.selectedItem = this.allGovern.find(item => item.id === element);
  //   //   console.log('selectedItem',  this.selectedItem);

  //   // });

  //   const mathcingArray = this.allGovern.filter(item => id.some((element : any )=> element === item.id));
  //   console.log('this is matching', mathcingArray);
  //   if (mathcingArray.length === 0) {
  //     this.uniqueAssignControl = []
  //     this.shippingForm.get(ControlKeys.cities)?.patchValue(this.uniqueAssignControl)
  //     this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()
  //   }
  //   else    if (mathcingArray.length > 0) {

  //     let observables = mathcingArray.map(city => this._OrderService.geCities(city?.id));
  //     forkJoin(observables).subscribe((responses) => {
  //       for (let res of responses) {
  //         let citiesOfGovern = res?.data;
  //         this.newArray = this.newArray.concat(citiesOfGovern);
  //         console.log('variable cities: ', citiesOfGovern);
  //       }
  //       console.log('all cities: ', this.newArray);
  //       let uniqueArrayOfCities = this.newArray.filter((city, index, array) =>
  // !array.slice(0, index).some(p => p.id === city?.id));
  //   console.log('unique array of cities: ', uniqueArrayOfCities);
  //    this.uniqueAssignControl = uniqueArrayOfCities.map((item)=> item?.id)
  //       console.log('uniqueIds', this.uniqueAssignControl);
  //        this.shippingForm.get(ControlKeys.cities)?.patchValue(this.uniqueAssignControl)
  //         this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()
  //     });
  //     // for (let city of mathcingArray) {
  //     //   this._OrderService.geCities(city?.id).subscribe((res)=> {
  //     //     // console.log('This is response of city matching', res.data);
  //     //     let citiesOfGovern = res?.data
  //     //     // let citiesOfGovernTest = [...res?.data];
  //     //     // console.log('citiesOfGovernTest', citiesOfGovernTest);



  //     //     // citiesOfGovern = [...citiesOfGovern];
  //     //     // console.log('variable cities: ', citiesOfGovern);


  //     //     // this.allCitiesOfGovern.push(...citiesOfGovern)
  //     //     // console.log('allCitiesOfGovern', this.allCitiesOfGovern);



  //     //   //    this.uniqueArrayOfCities = this.allCitiesOfGovern.filter((city, index, array) =>
  //     //   //     !array.slice(0, index).some(p => p.id === city?.id));
  //     //   // console.log('uniqueArrayOfCities', this.uniqueArrayOfCities);
  //     //   // this.uniqueAssignControl = this.uniqueArrayOfCities.map((item)=> item?.id)
  //     //   // console.log('uniqueIds',    this.uniqueAssignControl);
  //     //   // this.finishedArrayOfCities = this.uniqueAssignControl.filter(Boolean)
  //     //   // console.log('this is array ======>', this.finishedArrayOfCities);


  //     //     // for (let city of this.uniqueArrayOfCities) {
  //     //     //   this.uniqueIdArrayOfCities.push(city.id);
  //     //     //   // console.log('this is uniqueIdArrayOfCities', this.uniqueIdArrayOfCities);
  //     //     // }



  //     //     // this.shippingForm.get(ControlKeys.cities)?.patchValue(this.uniqueAssignControl)
  //     //     // this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()
  //     //   })
  //     //   // console.log('this is array vvv ======>', this.finishedArrayOfCities);

  //     // }


  //   }














  //   // if (! this.selectedItem) {
  //   //   // Perform some action when the selected value is not found
  //   //   console.log('Selected value not found:',  this.selectedItem);
  //   //   this.allCitiesOfGovern = []
  //   //   this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)

  //   //   // un subsribe on get cities observable
  //   // }

  //   // else {
  //   //   console.log('Selected value found:',  this.selectedItem);

  //   //   this._OrderService.geCities(id).subscribe((city) => {
  //   //     // console.log('this is iis is is city from shipping', city);
  //   //     this.cities = city.data
  //   //     console.log(' this.cities', this.cities);
  //   //     for (let city of this.cities) {
  //   //       this.allCitiesOfGovern.push(city?.id);
  //   //     }
  //   //     this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)
  //   //     this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()
  //   //     console.log('this.allCitiesOfGovern', this.allCitiesOfGovern);
  //   //     // ******* This is when selected government that return ids of cities that belong to this government ******
  //   //     if ( this.selectedItem && this.shippingForm.get(ControlKeys.cities)?.value === '') {
  //   //       // console.log('i will be ');

  //   //       this.allCitiesOfGovern = []
  //   //       this.cities.forEach((city) => {
  //   //       this.allCitiesOfGovern.push(city.id)
  //   //       this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)
  //   //       this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()

  //   //     })
  //   //     for (let city of this.cities) {
  //   //       this.allCitiesOfGovern.push(city?.id);
  //   //     }

  //   //   // }
  //   //   //   if ( this.selectedItem && this.shippingForm.get(ControlKeys.cities)?.value !== '') {

  //   //   //     console.log('i will be here soon');


  //   //   //     this.cities.forEach((city) => {
  //   //   //       this.allCitiesOfGovern.push(city.id)
  //   //   //       // console.log('this.allCitiesOfGovern', this.allCitiesOfGovern);
  //   //   //       this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)
  //   //   //       this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()

  //   //   //     })
  //   //   //   }

  //   //     // ******* This is when selected government that return ids of cities that belong to this government after touch one******

  //   //     // else if (this.selectedItem && this.shippingForm.get(ControlKeys.cities)?.dirty) {
  //   //     //   // console.log('you are dirty');
  //   //     //   // console.log(this.allCitiesOfGovern);
  //   //     //   // console.log(this.cities);
  //   //     //   // this.allCitiesOfGovern = []
  //   //     //   this.cities.forEach((city) => {
  //   //     //     console.log(city);
  //   //     //     this.allCitiesOfGovern.push(city.id)
  //   //     //     // console.log(' this.allCitiesOfGovern.', this.allCitiesOfGovern);
  //   //     //     this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)
  //   //     //     this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()


  //   //     //   })
  //   //     // }

  //   //   })



  //   // }




  // }




  // get Customers
  // allCitiesOfGovern: any[] = []

  onSelectionChangeGovern(id: any[]) {
    this.allCitiesOfGovern = []
    if (id.length == 0) {

      this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)
    }

    id.forEach(ele => {
      this._OrderService.geCities(ele).subscribe((city) => {
        this.setCitys(city.data)
        this.shippingForm.get(ControlKeys.cities)?.patchValue(this.allCitiesOfGovern)
        // this.shippingForm.get(ControlKeys.cities)?.updateValueAndValidity()
      })
    })
  }

  setCitys(cities: any[]) {
    cities.forEach(city => this.allCitiesOfGovern.push(city.id))
  }


  getCustomers() {
    this._ShippingService.getCustomers().subscribe((res) => {
      this.customers = res.data
    })
  }


  navigate() {
    this.router.navigate(['/Dashboard/shipping']);
  }
  CreateShipping() {
    this.loader = true
    this.submitted = true
    let obj = {
      name: this.shippingForm.get('name')?.value,
      shipping_fees: this.shippingForm.get('shipping_fees')?.value,
      applied_on_all_cities: this.checkCities === true ? true : false,
      cities: this.shippingForm.get('cities')?.value,
      country_id: this.shippingForm.get('country_id')?.value.code,
      platform: this.shippingForm.get('platform')?.value.code,
      rule_ordering: this.shippingForm.get('rule_ordering')?.value,
      minimum_type: this.shippingForm.get('minimum_type')?.value,
      minimum_value: this.shippingForm.get('minimum_value')?.value,
      customer_eligibility: this.shippingForm.get('customer_eligibility')?.value,
      customers: this.shippingForm.get('customers')?.value,
      usage_limits: this.shippingForm.get('usage_limits')?.value,
      has_date: this.hasExpiry === true ? 1 : 0,
      is_active: this.shippingForm.get('is_active')?.value === true ? 1 : 0,
      date_from: this.datePipe.transform(
        this.shippingForm.get('date_from')?.value,
        'dd-MM-YYYY'
      ),

      date_to: this.datePipe.transform(
        this.shippingForm.get('date_to')?.value,
        'dd-MM-YYYY'
      ),
    }
    // console.log('this.shippingForm', this.shippingForm.value);
    // console.log('this is obj', obj);

    if (this.shippingForm.valid) {

      // console.log(this.shippingForm.value);
      console.log('obj', obj);


      this._ShippingService.CreateShipping(obj).pipe(
        finalize(() => {
          this.loader = false
          this.submitted = false
          this.resetForm()
          this.router.navigate(['Dashboard/shipping']);
        })
      ).subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Creates Shipping added  Successfully',
        });

      })
    }

  }
  resetForm() {
    this.shippingForm.reset()
  }
  citiesSelected: any
  handleShippingForm() {
    this.editShippingMode = true
    this._ShippingService.showShipping(this.routerId).subscribe((res) => {
      // this.getCustomers()
      this._ShippingService.geCities(res.data.country_id).subscribe((res) => {
        this.cities = res.data
      })
      let citiesIds = res?.data?.cities?.map((c: any) => c.id)
      let customersIds = res?.data?.clients?.map((c: any) => c.id)
      this.shippingForm.get(ControlKeys.cities)?.setValue(citiesIds);
      this.shippingForm.get(ControlKeys.name)?.setValue(res?.data.name);
      this.shippingForm.get(ControlKeys.shipping_fees)?.setValue(res?.data.shipping_fees);
      this.shippingForm.get(ControlKeys.country_id)?.setValue(
        {
          name: res?.data.country.name_en,
          code: res?.data.country.id
        }
      );
      this.shippingForm.get(ControlKeys.platform)?.setValue(
        {
          name: res?.data.platform.id === 1 ? 'Website' : res?.data.platform.id === 3 ? 'Mobile App' : 'All',
          code: res?.data.platform.id
        }
      );
      this.shippingForm.get(ControlKeys.rule_ordering)?.setValue(res?.data.rule_ordering);
      this.shippingForm.get(ControlKeys.minimum_type)?.setValue(res?.data.minimum_type?.id);
      this.shippingForm.get(ControlKeys.minimum_value)?.setValue(res?.data.minimum_value);
      this.shippingForm.get(ControlKeys.customer_eligibility)?.setValue(res?.data.customer_eligibility?.id);
      this.shippingForm.get(ControlKeys.customers)?.setValue(customersIds);
      this.shippingForm.get(ControlKeys.usage_limits)?.setValue(res?.data.usage_limits?.id);
      this.shippingForm.get(ControlKeys.is_active)?.setValue(res?.data.is_active);
      this.shippingForm.get(ControlKeys.date_from)?.setValue(new Date(res?.data.date_from));
      this.shippingForm.get(ControlKeys.date_to)?.setValue(new Date(res?.data.date_to));
    })


  }

  editShippingRule() {
    this.loader = true
    this.submitted = true

    let obj = {
      name: this.shippingForm.get('name')?.value,
      shipping_fees: this.shippingForm.get('shipping_fees')?.value,
      applied_on_all_cities: this.checkCities === true ? true : false,
      cities: this.shippingForm.get('cities')?.value,
      country_id: this.shippingForm.get('country_id')?.value.code,
      platform: this.shippingForm.get('platform')?.value.code,
      rule_ordering: this.shippingForm.get('rule_ordering')?.value,
      minimum_type: this.shippingForm.get('minimum_type')?.value,
      minimum_value: this.shippingForm.get('minimum_value')?.value,
      customer_eligibility: this.shippingForm.get('customer_eligibility')?.value,
      customers: this.shippingForm.get('customers')?.value,
      usage_limits: this.shippingForm.get('usage_limits')?.value,
      has_date: this.hasExpiry === true ? 1 : 0,
      is_active: this.shippingForm.get('is_active')?.value === true ? 1 : 0,
      date_from: this.datePipe.transform(
        this.shippingForm.get('date_from')?.value,
        'dd-MM-YYYY'
      ),

      date_to: this.datePipe.transform(
        this.shippingForm.get('date_to')?.value,
        'dd-MM-YYYY'
      ),
    }

    if (this.shippingForm.valid) {

      this._ShippingService.updatShipping(this.routerId, obj).pipe(
        finalize(() => {
          this.submitted = false;
          this.loader = false
        })
      ).subscribe((res) => {
        this.shippingForm.reset()
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Updated Shipping added  Successfully',
        });
        this.editShippingMode = false
        this.router.navigate(['Dashboard/shipping']);
      })
    }
  }

  handleCreateOrEdit() {
    if (this.editShippingMode == true) {
      this.editShippingRule()
    }
    else {
      this.CreateShipping()
    }
  }
  ngOnInit(): void {


    const cities = this.shippingForm.get(ControlKeys.cities)?.valueChanges.subscribe((value) => {

      // console.log('cities', value);
      this.allCitiesOfGovern = value
      // console.log('this.allCitiesOfGovern', this.allCitiesOfGovern);

    });














    if (localStorage.getItem('Country') === 'eg') {
      this.selectedOption = this.website[0]
      if (this.selectedOption == this.website[0]) {
        // console.log('this is selected option', this.selectedOption);

        this._OrderService.geGovern(this.website[0].code).subscribe((govern) => {
          this.allGovern = govern.data

        })
        this._ShippingService.geCities(this.website[0].code).subscribe((res) => {
          this.cities = res.data
        })
      }

    } else if (localStorage.getItem('Country') === 'sa') {
      this.selectedOption = this.website[1]
      if (this.selectedOption == this.website[1]) {

        this._OrderService.geGovern(this.website[1].code).subscribe((govern) => {
          this.allGovern = govern.data

        })
        this._ShippingService.geCities(this.website[1].code).subscribe((res) => {
          this.cities = res.data
        })
      }

    }















    // else {
    //   this._OrderService.geGovern(this.website[1].code).subscribe((govern) => {
    //     // console.log('this is govern of cities in select', govern);
    //     this.allGovern = govern.data
    //     // console.log('this is all govern', this.allGovern);

    //   })
    // }

    // console.log('this is selectedOption', this.selectedOption);
    // console.log('this is country id', this.shippingForm.get(ControlKeys.country_id));
    this.checkCustomerType()
    this.checkMinimumType()


  }

}
