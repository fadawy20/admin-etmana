import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PromotionsService } from 'src/app/Services/promotions.service';
import { SaveFilesService } from 'src/app/Services/save-files/save-files.service';

export enum controlKeys {
  ruleType = 'ruleType',
  promoName = 'promoName',
  platform = 'platform',
  Country = 'Country',
  targetedCustomer = 'targetedCustomer',
  perOffer = 'perOffer',
  perCustomer = 'perCustomer',
  promoUses = 'promoUses',
  description = 'description',
  client_order_count = 'client_order_count'
}

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss'],
})
export class GeneralFormComponent implements OnInit, AfterViewInit {
  generalInfo: FormGroup;
  submitted: boolean = false;
  ruleTypes: any[] = [];
  platForm: any = [];
  targetClients: any[] = [];
  countries: any[] = [];
  count: any[] = [];
  promoString: string = '';
  promoCount: any;
  promos: any[] = [];
  displayPromos: boolean = false;
  clientOrderCount: boolean = false
  clientPurchasedOrderAmount: boolean = false

  // recieve data from parent component
  @Input() isPromoCode: boolean = false;
  @Input() editPromotion: any;

  // send form values to parent componenet
  @Output() sumbittedForm: EventEmitter<object> = new EventEmitter();
  @Output() sendRuleType: EventEmitter<number> = new EventEmitter();
  @Output() sendTargetCustomer: EventEmitter<any> = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private _MessageService: MessageService,
    private _SaveFilesService: SaveFilesService,
    private _PromotionsService: PromotionsService
  ) {
    this.getLookups();
    this.generalInfo = fb.group({
      [controlKeys.ruleType]: ['', [Validators.required]],
      [controlKeys.promoName]: ['', [Validators.required]],
      [controlKeys.platform]: ['', [Validators.required]],
      [controlKeys.Country]: ['', [Validators.required]],
      [controlKeys.perOffer]: [
        '1',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      [controlKeys.perCustomer]: [
        '1',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      [controlKeys.promoUses]: [''],
      [controlKeys.client_order_count]: [1],
      [controlKeys.targetedCustomer]: ['', [Validators.required]],
      [controlKeys.description]: ['', [Validators.required]],
    });
    this.generalInfo.get(controlKeys.promoUses)?.clearValidators();
    this.generalInfo.get(controlKeys.promoUses)?.updateValueAndValidity();
  }

  type: any;
  plateform: any;
  country: any;
  offer: any;
  targetCustomer: any;
  visib: any = { checked: false };
  typeOfDropDown: any

  ngAfterViewInit(): void {
    // console.log('this is edit promotion ========>', this.editPromotion);
  }
  ngOnInit(): void {

    // console.log('typeOfDropDown', this.typeOfDropDown);
    const selectedTargetCustomerType = this.generalInfo.get('targetedCustomer')
    // console.log('selectedTargetCustomerType', selectedTargetCustomerType);

    if (this.generalInfo.get('targetedCustomer')?.valueChanges.subscribe((res) => {
      if (res?.type === 4) {
        this.clientOrderCount = true
        this.clientPurchasedOrderAmount = false
        const control = new FormControl('');
        this.generalInfo.addControl('client_order_count', control);
        control.updateValueAndValidity();
        console.log('There is target customer in form', res);
      } else if (res?.type === 5) {
        this.clientOrderCount = false
        this.clientPurchasedOrderAmount = true
        const controlPurchased = new FormControl('');
        this.generalInfo.addControl('client_purchased_order_amount', controlPurchased);
        controlPurchased.updateValueAndValidity();

      }
    })) {

    }

    // if (selectedTargetCustomerType?.value?.type == 5) {
    //   this.clientPurchasedOrderAmount = true
    //   this.clientOrderCount = false

    // } else if (selectedTargetCustomerType?.value?.type == 4) {
    //   this.clientPurchasedOrderAmount = false
    //   this.clientOrderCount = true

    //   console.log('this.clientOrderCount in init render');

    //   // const control = new FormControl('');
    //   // this.generalInfo.addControl('client_order_count', control);
    //   // control.updateValueAndValidity();

    // }




    // this is benefits for update that array of drop down <obj> must match the with elle rageh6

    let clear = setInterval(() => {
      this.type = this.ruleTypes.filter((ele: any) => {
        return ele.type == this.editPromotion?.type?.id;
      })[0];
      this.plateform = this.platForm.filter((ele: any) => {
        return ele.type == this.editPromotion?.platform;
      })[0];
      this.country = this.countries.filter((ele: any) => {
        return ele.type == this.editPromotion?.country_id;
      })[0];
      this.offer = this.targetClients.filter((ele: any) => {
        return ele.type == this.editPromotion?.targeted_clients[0].type.id;
      })[0];

      if (this.editPromotion) {
        // console.log('this is edit promotion ok');
        // console.log('this is edit promotion', this.editPromotion);


        this.generalInfo.patchValue({
          ruleType: this.type,
          promoName: this.editPromotion?.name,
          platform: this.plateform,
          Country: this.country,
          perCustomer: this.editPromotion?.max_client_use,
          perOffer: this.editPromotion?.max_offer_use,
          description: this.editPromotion?.description,
          targetedCustomer: this.offer,
          promoUses: this.editPromotion?.promocodes
            ? this.editPromotion?.promocodes[0]?.max_client_use
            : 0,
        });
        // console.log('this =====> ' + this.editPromotion);
      }
      // this.isPromoCode = this.editPromotion?.has_promocode;
      // console.log('this.isPromoCode', this.isPromoCode);

      this.visib.checked = this.isPromoCode;
      this.changeValidility(this.visib);
      if (this.editPromotion?.promocodes) {
        this.promos = this.editPromotion?.promocodes;

        this.promoCount = this.editPromotion?.promocodes.length;
        this.promoString = this.editPromotion?.promocodes[0]?.code.slice(
          0,
          this.editPromotion?.promocodes[0]?.code.indexOf('-')
        );
      }
      // console.log(this.promos);

      if (this.editPromotion) {
        this.generalInfo.get('promoUses')?.patchValue(this.editPromotion?.promocodes[0]?.max_client_use)
        this.generalInfo.controls?.['promoName'].disable();
        clearInterval(clear);
      }
    }, 100);
    setTimeout(() => {
      clearInterval(clear);
    }, 5000);
  }

  submitForm() {
    this.submitted = true;
    if (this.generalInfo.invalid) {
      return;
    } else {
      if (this.isPromoDisabled) {
        if (this.promos.length === 0) {
          this._MessageService.add({
            severity: 'warn',
            summary: 'Warn',
            detail: 'Please generate Promo Code',
          });
        } else {
          this.promos = this.promos.map((promo) => {
            return {
              id: promo.id,
              // client_purchased_order_amount: this.generalInfo.get('client_purchased_order_amount')?.value,
              // client_order_count: this.generalInfo.get('client_order_count')?.value,
              code: promo.code,
              max_client_use: this.generalInfo.get(controlKeys.promoUses)
                ?.value,
            };
          });
          this.sumbittedForm.emit(this.generalInfo.value);
          this._PromotionsService.promoCodes = this.promos;
        }
      } else {
        this.sumbittedForm.emit(this.generalInfo.value);
      }
    }
  }

  getLookups() {
    this.ruleTypes = [
      { name: 'Free shipping', type: 1 },
      { name: 'Buy X Get Y', type: 2 },
      { name: 'Flash offer', type: 3 },
      { name: 'Special pricing', type: 4 },
    ];
    this.platForm = [
      { name: 'Web View', type: 1 },
      { name: 'Mobile View', type: 2 },
      { name: 'Mobile App', type: 3 },
      { name: 'All', type: 5 },
    ];
    this.countries = [
      { name: 'Egypt', type: 1 },
      { name: 'Saudi Arabia', type: 2 },
    ];
    this.targetClients = [
      { name: 'ALL', type: 1 },
      { name: 'New USers', type: 2 },
      { name: 'First Login', type: 3 },
      { name: 'Order Count', type: 4 },
      { name: 'Purchased Orders Amount', type: 5 },
    ];
    this.count = [
      { name: '1', type: 1 },
      { name: '2', type: 2 },
      { name: '3', type: 3 },
      { name: '4', type: 4 },
      { name: '5', type: 5 },
      { name: '6', type: 6 },
      { name: '7', type: 7 },
      { name: '8', type: 8 },
      { name: '9', type: 9 },
      { name: '10', type: 10 },
    ];
    this.promoCount = 1;
  }

  generatePromoCode() {
    if (this.promoString === '') {
      this.promos = [...Array(Number(this.promoCount)).keys()].map((value) => {
        console.log(value);

        return {
          code: 'etmana' + '-' + (value + 1),
        };

      });
    } else {
      this.promos = [...Array(Number(this.promoCount)).keys()].map((value) => {
        return {
          code: this.promoString + '-' + (value + 1),
        };
      });
    }
    this._MessageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Promo Codes Added successfully',
    });
    // this.promos = Array(Number(this.promoCount)).fill(this.promoString).map(c => ({ promoName: c + '-' + Math.random().toString(36).slice(2, 7), count: 1 }))
  }

  viewAllPromos() {
    this.displayPromos = true;
  }

  closeModal() {
    this.displayPromos = false;
  }

  handleRuleTypeChange(data: any) {
    this.sendRuleType.emit(data?.value?.type);
  }

  handleTargetCustomer(data: any) {
    if (data?.value?.type === 4) {
      this.clientOrderCount = true
      this.clientPurchasedOrderAmount = false

      console.log('this.clientOrderCount is online',);


      const control = new FormControl('');
      this.generalInfo.addControl('client_order_count', control);
      control.updateValueAndValidity();
      // console.lo);
      console.log('this is general info', this.generalInfo);


    }
    else if (data?.value?.type === 5) {
      this.clientPurchasedOrderAmount = true
      this.clientOrderCount = false
      const controlPurchased = new FormControl('');
      this.generalInfo.addControl('client_purchased_order_amount', controlPurchased);
      controlPurchased.updateValueAndValidity();

      console.log('this is general info', this.generalInfo);
    }

    this.sendTargetCustomer.emit(data?.value?.type)
  }

  exportPromos() {
    this._SaveFilesService.exportAsExcelFile(this.promos, 'Promo Codes');
  }

  isPromoDisabled: boolean = false;
  changeValidility(value: any) {
    console.log('isPromoCode', this.isPromoCode);

    this._PromotionsService.hasPromo = value.checked;
    this.isPromoDisabled = value.checked;
    if (value.checked) {
      if (!this.generalInfo.get(controlKeys.promoUses)) {
        this.generalInfo.addControl(
          controlKeys.promoUses,
          this.fb.control('', [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
          ])
        );
      }
    } else {
      if (this.generalInfo.get(controlKeys.promoUses)) {
        this.generalInfo.removeControl(controlKeys.promoUses);
      }
    }
  }

  reset() {
    this.isPromoDisabled = false;
    this.generalInfo.reset();
    this.isPromoCode = false;
    this.promos = [];
  }
  // get has(): boolean {
  //   return true
  // }
}
