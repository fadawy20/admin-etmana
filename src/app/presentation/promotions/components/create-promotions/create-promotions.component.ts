import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, map, Observable } from 'rxjs';
import { BrandsService } from 'src/app/Services/brands.service';
import { CategoriesService } from 'src/app/Services/categories.service';
import { CollectionService } from 'src/app/Services/collection.service';
import { PromotionsService } from 'src/app/Services/promotions.service';
import {
  freeShipping,
  buyYgetX,
  numberConditions,
  specialPricing,
} from '../../models/conditions.model';

export enum controlKeys {
  condition = 'condition',
  start_date = 'start_date',
  end_date = 'end_date',
  has_date = 'has_date',
  amount = 'amount',
  x_value = 'x_value',
  y_value = 'y_value',
}

@Component({
  selector: 'app-create-promotions',
  templateUrl: './create-promotions.component.html',
  styleUrls: ['./create-promotions.component.scss'],
})
export class CreatePromotionsComponent implements OnInit {
  promotionStatus: boolean = false;
  isPromoCode: boolean = false;
  conditions: any[] = [];
  condition: any;
  conditionForm: FormGroup;
  submitted: boolean = false;
  has_date: boolean = false
  has_date1: Number = 0 | 1;
  hasSpecificItem: boolean = false;
  brands: any[] = [];
  brandsPage2: any[] = [];
  allBrands: any[] = [];

  collections: any[] = [];
  brandsParams1: any;
  brandsParams2: any;
  collectionParams: any;
  loadingIndicator: boolean = false;
  files: any;
  label: string = 'Amount';
  selectedItems: any[] = [];
  promotableType: any;
  typeName: string = '';
  conditionType: any;
  has_dateOnClick: boolean = false

  @ViewChild('generarlForm', { static: false }) generalForm: any;

  constructor(
    private fb: FormBuilder,
    private _BrandsService: BrandsService,
    private _CategoriesService: CategoriesService,
    private _CollectionService: CollectionService,
    private datePipe: DatePipe,
    private _MessageService: MessageService,
    private _PromotionsService: PromotionsService,
    private _router: Router,
    private route: ActivatedRoute
  ) {
    this.conditionForm = fb.group({
      [controlKeys.condition]: ['', [Validators.required]],
      [controlKeys.start_date]: ['', [Validators.required]],
      [controlKeys.end_date]: ['',],
      [controlKeys.has_date]: ['', []],
    });
    this.brandsParams1 = new HttpParams();
    this.brandsParams2 = new HttpParams();
    this.collectionParams = new HttpParams();
    this.getAllItems();


  }

  editProm: any;
  idPomotion: number = 0;
  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      this.idPomotion = data.id;
      // .pipe(finalize(() => (this.loadingIndicator = false)))x
      if (data?.id) {
        this._PromotionsService
          .getOnePromotion(data?.id)
          .subscribe((data: any) => {
            this.editProm = data?.data;
            console.log('edit Prom in .....', this.editProm);
            console.log('this is has promo code when editing', this.editProm?.has_promocode);
            if (this.editProm?.has_promocode) {
              this.isPromoCode = this.editProm?.has_promocode;
              // console.log('This is is promo code when editing and assign value = has promo code', this.isPromoCode);

            }
            if (this.editProm?.has_date) {
              console.log('he has date');

            } else {
              console.log('he has not date');

            }
            if (this.editProm?.max_client_use) {
              // console.log('this.editProm.max_client_use', this.editProm?.max_client_use);
              // this.generalValues
            }


            if (this.editProm.end_date === null) {
              this.conditionForm.removeControl('end_date');
              // this.conditionForm.get
              console.log('sure is that null');

              const currentDate = new Date()
              this.has_dateOnClick = true
              // this.conditionForm.get([controlKeys.end_date])?.patchValue(currentDate)

              // this.conditionForm.get(controlKeys.end_date)?.valueChanges.subscribe((res) => {

              //   this.conditionForm.get(controlKeys.end_date)?.patchValue(res)
              //   console.log('this is res is coming from contro end data', res);
              // })

            }

            // if (this.editProm?.start_date && this.editProm?.end_date) {
            //     console.log('this is edit is starting date', this.editProm?.start_date);
            //   console.log('this.editProm?.end_date', this.editProm?.end_date);
            //     this.conditionForm.get(controlKeys.start_date)?.setValue(this.datePipe.transform(this.editProm?.start_date, 'dd-MM-yyyy'))
            //     this.conditionForm.get(controlKeys.start_date)?.updateValueAndValidity()
            //   console.log('this is now control start' , this.conditionForm.get(controlKeys.start_date)?.value);

            // }




            this.promotionStatus = this.editProm.is_active;
            this.sendRuleType(this.editProm?.type?.id);
            // this.has_date = this.editProm.has_date;
            // console.log('this.editProm.has_date', this.editProm.has_date);


            this.conditionForm.patchValue({
              // condition: this.editProm.condition,
              has_date: this.editProm.has_date,
              start_date: new Date(this.editProm?.start_date),
              end_date: new Date(this.editProm?.end_date),
            });

          });
        console.log('this is condition form ', this.conditionForm);
      }
    });
    setTimeout(() => {
      if (this.brands && this.brandsPage2) {

        this.allBrands = this.brandsPage2.concat(this.brands)
        // console.log('all brands ', this.allBrands);

      }
    }, 2000);
  }

  backToList() {
    this._router.navigateByUrl('Dashboard/promotions');
  }

  getAllItems() {
    // This is will return first page with brand
    this.brandsParams1 = this.brandsParams1.set('page', 1);
    this.brandsParams1 = this.brandsParams1.set('per_page', 150);
    // This is will return first page with brand
    // This is will return second page with brand
    this.brandsParams2 = this.brandsParams2.set('page', 2);
    this.brandsParams2 = this.brandsParams2.set('per_page', 50);
    // This is will return second page with brand

    this.collectionParams = this.collectionParams.set('page', 1);
    this.collectionParams = this.collectionParams.set('per_page', 50);
    this.getAllBrandsForPage1(this.brandsParams1);


    this.getAllBrandsForPage2(this.brandsParams2);
    this.getAllCategoriesParents();
    this.getCollections(this.collectionParams);
  }

  // get all brands
  getAllBrandsForPage1(params: any) {

    this._BrandsService
      .paginate(params)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands: any) => {
        this.brands = brands?.data?.map((brand: any) => {
          return {
            title: brand.title_en,
            id: brand.id,
            logo: brand?.logo,
            isSelectedBrand: false,
          };
        });
        console.log('params ========================================>', params);
        console.log('brands page 1', this.brands);

      });
  }
  getAllBrandsForPage2(params: any) {
    this._BrandsService
      .paginate(params)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands: any) => {
        this.brandsPage2 = brands?.data?.map((brand: any) => {
          return {
            title: brand.title_en,
            id: brand.id,
            logo: brand?.logo,
            isSelectedBrand: false,
          };
        });
        // console.log('Brands Page 2', this.brandsPage2);

      });
  }

  // get Collections
  getCollections(params: any) {
    this._CollectionService
      .paginate(params)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((collections: any) => {
        this.collections = collections?.data?.map((collection: any) => {
          return {
            title: collection.title_en,
            id: collection.id,
            count: collection?.products_count,
            images: collection.products.map(
              (product: any) => product.images[0]?.url
            ),
            isSelectedCollection: false,
          };
        });
      });
  }

  // get parent category
  getAllCategoriesParents() {
    this.loadingIndicator = true;
    this._CategoriesService
      .getParents()
      .then((files) => {
        this.files = files.map((file: any) => {
          return {
            label: file.title_en,
            data: file,
            expandedIcon: 'pi pi-folder-open',
            collapsedIcon: 'pi pi-folder',
            leaf: false,
            isSelectedCategoru: false,
            id: file.id,
          };
        });
        // console.log(this.files, 'files loaded');

      })
      .then(() => {
        this.loadingIndicator = false;
      });
  }
  condition_type: any;
  typeOfCondition: any;
  sendRuleType(type: number) {

    this.conditionForm.reset();
    this.hasSpecificItem = false;
    this.submitted = false;
    // free Shipping
    this.conditions = [];
    if (type === 1) {
      this.typeOfCondition = {
        free_shipping_type: this.editProm?.free_shipping?.type?.id,
      };
      this.conditions = [...freeShipping];
      this.typeName = 'FREE_SHIPPING';
      if (this.editProm) {
        this.condition_type = this.conditions.filter((e: any) => {
          return e.editPromotiomView == this.editProm?.free_shipping?.type?.id;
        });
        this.conditionForm.patchValue({
          condition: this.condition_type[0],
        });
      }
      this.addAndRemoveControls(type, 'none');
    } else if (type === 2) {
      this.typeOfCondition = {
        buy_x_get_y_type: this.editProm?.buy_x_get_y?.type?.id,
        pay_cheapest: true,
      };
      // console.log('type of condtion 2', this.typeOfCondition);

      this.conditions = [...buyYgetX];
      if (this.editProm) {
        this.condition_type = this.conditions.filter((e: any) => {
          return e.editPromotiomView == this.editProm?.buy_x_get_y?.type?.id;
        });
        this.conditionForm.patchValue({
          condition: this.condition_type[0],
        });
      }
      this.showAmount = false;
      if (this.conditionForm.get(controlKeys.amount)) {
        this.conditionForm.removeControl(controlKeys.amount);
      }
      this.typeName = 'BUY_X_GET_Y';
      this.addAndRemoveControls(type, 'XYvalue');
    } else if (type === 3 || type === 5) {
      this.typeName = type === 3 ? 'FLASH_OFFER' : '';
      this.label = 'Percentage';
      this.hasSpecificItem = true;
      this.conditions = [...numberConditions];
      this.showXYvalues = false;
      if (this.editProm) {
        this.condition_type = this.conditions.filter((e: any) => {
          return e.editPromotiomView == this.editProm?.flash_offer?.id;
        });
        console.log('condition_type', this.condition_type);

        this.conditionForm.patchValue({
          start_date: new Date(this.editProm.start_date),
          end_date: new Date(this.editProm.end_date),
          has_date: this.editProm.has_date,
          // condition: this.editProm?.condition,
        });
        // console.log('result is condition', this.conditionForm);

      }
      this.conditionForm.removeControl(controlKeys.x_value);
      this.conditionForm.removeControl(controlKeys.y_value);
      this.addAndRemoveControls(type, 'amount');
    } else if (type === 4) {
      this.typeOfCondition = {
        discount_type: this.editProm?.special_pricings?.type?.id,
      };

      this.typeName = type === 4 ? 'SPECIAL_PRICING' : '';
      this.showXYvalues = false;
      this.conditions = [...specialPricing];
      // console.log('this is condition', this.conditions);
      // console.log('this.typeOfCondition', this.typeOfCondition);

      if (this.editProm) {
        this.condition_type = this.conditions.filter((e: any) => {
          return (
            e.editPromotiomView == this.editProm?.special_pricings?.type?.id
          );
        });


        this.conditionForm.patchValue({
          condition: this.condition_type[0],
        });

        // console.log('this.condition_type', this.condition_type);
        this.addAndRemoveControls(type, 'amount');
      }
      this.conditionForm.removeControl(controlKeys.x_value);
      this.conditionForm.removeControl(controlKeys.y_value);
    } else {
      this.addAndRemoveControls(type, 'none');
    }
    if (this.editProm) {
      this.handleRuleTypeChange({ value: this.condition_type[0] });
      this.hasSpecificItem = false;
    }
  }

  sendTargetCustomer(type: any) {
    console.log('this is data from customer data', type);
    if (type === 4) {
      // this.generalForm.addControl('client_order_count', new FormControl(1))
      // this.generalForm.upda

    }



  }

  handleEndDateExpiration(data: any) {

    console.log('this.has_date', this.has_date);

    if (this.has_dateOnClick) {
      console.log('has_date', this.has_date);
      // console.log(this.has_date1);
      this.conditionForm.removeControl(controlKeys.end_date);
      this.conditionForm.removeControl(controlKeys.has_date);
      this.conditionForm.addControl(controlKeys.has_date, this.fb.control(false));
      this.conditionForm.addControl(controlKeys.end_date, this.fb.control(null));
      // this.conditionForm.addControl(controlKeys.end_date, this.fb.control('And No Expire Date'));
      console.log(this.conditionForm.value);
      // this.conditionForm.get(controlKeys.end_date)?.clearValidators();
      // this.conditionForm.get(controlKeys.end_date)?.updateValueAndValidity();
    }
    else {
      // console.log('has_date', this.has_date);


      //   // this.has_date1 = 1
      this.conditionForm.removeControl(controlKeys.has_date)
      // this.conditionForm.addControl(controlKeys.has_date, this.fb.control(1));
      this.conditionForm.addControl(controlKeys.has_date, this.fb.control(true));

      this.conditionForm.addControl(controlKeys.end_date, this.fb.control('', [Validators.required]));
      console.log(this.conditionForm.value);
      // if (this.conditionForm.get(controlKeys.end_date)?.valueChanges) {
      //   this.conditionForm.addControl(controlKeys.has_date, this.fb.control(true));

      // }

      // if (this.conditionForm.get(controlKeys.end_date)?.valueChanges.subscribe((res)=> {} )) {

      // }

      this.conditionForm.get(controlKeys.end_date)?.valueChanges.subscribe((res) => {
        if (res) {
          // console.log('this is response', res);
          this.conditionForm.addControl(controlKeys.has_date, this.fb.control(true));
          console.log('has date', this.conditionForm.get(controlKeys.has_date)?.value);



        }
      })






    }
  }

  handleRuleTypeChange(data: any) {
    // console.log('data', data);

    this.hasSpecificItem = false;
    this.conditionType = data.value.id;
    console.log('this.conditionType', this.conditionType);


    if (data.value.id === 7) {
      // specific item without any other inputs
      this.hasSpecificItem = true;
      this.addAndRemoveControls(data.value?.id, 'none');
    } else if (data.value.id === 6 || data.value.id === 8) {
      // amount only
      this.label = 'Min Amount';
      this.addAndRemoveControls(data.value?.id, 'amount');
    } else if (data.value.id === 13) {
      // specific item with x and y value inputs
      this.hasSpecificItem = true;
      this.addAndRemoveControls(2, 'XYvalue');
    } else if (data.value.id === 11) {
      // specific item and amount
      this.hasSpecificItem = true;
      this.addAndRemoveControls(11, 'amount');
    } else if (data.value.id === 14) {
      // specific item and amount and x y value
      this.hasSpecificItem = true;
      this.addAndRemoveControls(2, 'XYvalue');
      this.addAndRemoveControls(11, 'amount');
    } else if (data.value.id === 16) {
      this.label = 'Amount';
      this.addAndRemoveControls(11, 'amount');
      this.hasSpecificItem = true;
    } else if (data.value.id === 15) {
      this.label = 'Percentage';
      this.addAndRemoveControls(11, 'amount');
      this.hasSpecificItem = true;
    } else {
      // default form
      this.hasSpecificItem = false;
      this.addAndRemoveControls(data.value?.id, 'none');
    }
  }

  showAmount: boolean = false;
  showXYvalues: boolean = false;
  addAndRemoveControls(controlKeyID: any, type: string) {
    // type to seperate the conditions
    // controlKeyID for specific input to add if and else poth conditions

    if (type === 'amount') {
      //  add amount control
      if (
        controlKeyID === 3 ||
        controlKeyID === 6 ||
        controlKeyID === 4 ||
        controlKeyID === 5 ||
        controlKeyID === 8 ||
        controlKeyID === 11
      ) {
        this.showAmount = true;
        if (!this.conditionForm.get(controlKeys.amount)) {
          this.conditionForm.addControl(
            controlKeys.amount,
            this.fb.control('', [
              Validators.required,
              Validators.pattern('^[0-9]*$'),
            ])
          );
          if (this.editProm) {
            this.conditionForm.patchValue({
              amount:
                this.editProm?.buy_x_get_y?.y_discount ??
                this.editProm?.free_shipping?.amount ??
                this.editProm?.flash_offer?.discount ??
                this.editProm?.special_pricings?.amount,
            });
          }
        }
      } else {
        this.showAmount = false;
        if (this.conditionForm.get(controlKeys.amount)) {
          this.conditionForm.removeControl(controlKeys.amount);
        }
      }
    } else if (type === 'XYvalue') {
      // add X and  Y Controls
      if (controlKeyID === 2) {
        this.showXYvalues = true;
        if (
          !this.conditionForm.get(controlKeys.x_value) ||
          !this.conditionForm.get(controlKeys.y_value)
        ) {
          this.conditionForm.addControl(
            controlKeys.x_value,
            this.fb.control('', [
              Validators.required,
              Validators.pattern('^[0-9]*$'),
            ])
          );
          this.conditionForm.addControl(
            controlKeys.y_value,
            this.fb.control('', [
              Validators.required,
              Validators.pattern('^[0-9]*$'),
            ])
          );
          if (this.editProm) {
            this.conditionForm.patchValue({
              x_value: this.editProm?.buy_x_get_y?.x_value,
              y_value: this.editProm?.buy_x_get_y?.y_value,
            });
          }
        }
      } else {
        this.showXYvalues = false;
        this.conditionForm.removeControl(controlKeys.x_value);
        this.conditionForm.removeControl(controlKeys.y_value);
      }
    } else {
      // clear constrols if nothing selected
      this.showAmount = false;
      this.showXYvalues = false;
      this.conditionForm.removeControl(controlKeys.x_value);
      this.conditionForm.removeControl(controlKeys.y_value);
      this.conditionForm.removeControl(controlKeys.amount);
    }
  }

  getItems(data: any) {
    this.selectedItems = data;
    console.log('selectedItems ======> ', this.selectedItems);

  }

  selectedCategoris: any[] = [];
  getCategories(data: any) {
    this.selectedCategoris = data;
  }

  Cancel() {
    this.generalForm.reset();
    this.hasSpecificItem = false;
    this.showAmount = false;
    this.showXYvalues = false;
    this.conditionForm.reset();
    this.getAllItems();
    this.loadingIndicator = false
  }

  getPromotableTybe(value: any) {
    this.promotableType = value;
  }

  // start create promotion
  generalValues: any;
  sumbittedForm(formValues: any) {
    this.generalValues = formValues;
    // console.log('This is general values', this.generalValues);

  }
  create() {
    this.generalForm.submitForm();
    this.submitted = true;
    if (this.conditionForm.invalid) {
      return;
    } else {
      this.submitted = false;

      if (this.hasSpecificItem) {
        if (
          this.promotableType === 'collections' ||
          this.promotableType === 'brands'
        ) {
          if (this.selectedItems.length === 0) {
            this._MessageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: 'Please Select Items',
            });
          }
        } else if (this.promotableType === 'categories') {
          if (this.selectedCategoris.length === 0) {
            this._MessageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: 'Please Select Items',
            });
          }
        } else {
          this._MessageService.add({
            severity: 'warn',
            summary: 'Warn',
            detail: 'Please Select Items',
          });
        }
      }
      // create general basic data
      let condition = this.conditionForm.value;
      let generalData = {
        client_purchased_order_amount: this.generalValues.client_purchased_order_amount,
        client_order_count: this.generalValues.client_order_count,
        name: this.generalValues.promoName,
        description: this.generalValues.description,
        is_active: this.promotionStatus,
        country_id: this.generalValues.Country?.type,
        type: this.generalValues.ruleType?.type,
        platform: this.generalValues.platform.type,
        targeted_clients: [this.generalValues.targetedCustomer].map(
          (customer) => customer.type
        ),
        has_promocode: this._PromotionsService.hasPromo,
        max_offer_use: this.generalValues.perOffer,
        max_client_use: this.generalValues.perCustomer,
        // has_date: this.has_date,
        // has_date: condition.end_date ? this.has_date : condition.has_date,
        has_date: condition.end_date ? true : false,

        start_date: this.datePipe.transform(condition.start_date, 'dd-MM-yyyy'),
        end_date: condition.end_date === null ? condition.end_date : this.datePipe.transform(condition.end_date, 'dd-MM-yyyy'),
        // end_date: condition.end_date,
        promocodes: this._PromotionsService.promoCodes,
      };
      // create buy x get y object
      if (this.typeName === 'BUY_X_GET_Y') {
        if (this.selectedItems.length == 0) {
          this.selectedItems = this.selectedCategoris;
        }
        let XYvalues = {
          ...generalData,
          promotable_type: this.promotableType,
          promotable_ids: this.selectedItems.map((product) => product.id),
          y_value: this.conditionForm.get(controlKeys.y_value)?.value,
          x_value: this.conditionForm.get(controlKeys.x_value)?.value,
          buy_x_get_y_type: 1,
          pay_cheapest: true,
        };
        if (this.conditionType === 14) {
          let discount = {
            ...generalData,
            ...XYvalues,
            buy_x_get_y_type: 2,
            y_discount: this.conditionForm.get(controlKeys.amount)?.value,
          };
          this.createRequest(discount);
        } else {
          this.createRequest(XYvalues);
        }
      } else if (this.typeName === 'FLASH_OFFER') {
        // flash offer
        let flashOffer = {
          ...generalData,
          promotable_type: this.promotableType,
          promotable_ids: this.selectedItems.map((product) => product.id),
          flash_offer_discount: Number(
            this.conditionForm.get(controlKeys.amount)?.value
          ).toFixed(2),
        };
        this.createRequest(flashOffer);
      } else if (this.typeName === 'SPECIAL_PRICING') {
        let discount = {
          ...generalData,
          promotable_type: this.promotableType,
          promotable_ids: this.selectedItems.map((product) => product.id),
          discount_amount: Number(
            this.conditionForm.get(controlKeys.amount)?.value
          ),
          discount_type: this.conditionType === 15 ? 2 : this.conditionType === 16 ? 1 : '',
        };
        console.log('discount', discount);

        this.createRequest(discount);
      } else if (this.typeName === 'FREE_SHIPPING') {
        if (this.conditionType === 6) {
          let freeShippingAmount = {
            ...generalData,
            free_shipping_type: 3,
            free_shipping_amount: Number(
              this.conditionForm.get(controlKeys.amount)?.value
            ),
          };
          this.createRequest(freeShippingAmount);
        } else if (this.conditionType === 8) {
          let NoOfItemsAmount = {
            ...generalData,
            free_shipping_type: 5,
            free_shipping_no_of_items: Number(
              this.conditionForm.get(controlKeys.amount)?.value
            ),
          };
          this.createRequest(NoOfItemsAmount);
        } else if (this.conditionType === 7) {
          let specificItems = {
            ...generalData,
            free_shipping_type: 4,
            promotable_type: this.promotableType,
            promotable_ids: this.selectedItems.map((product) => product.id),
          };
          this.createRequest(specificItems);
        } else {
          let freeShippingData = {
            ...generalData,
            free_shipping_type: this.conditionType,
          };
          this.createRequest(freeShippingData);
        }
      }
    }
  }

  createRequest(data: any) {
    this.loadingIndicator = true;
    this._PromotionsService
      .create(data)
      .pipe(
        finalize(() => {
          this.loadingIndicator = false;
        })
      )
      .subscribe((res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'this promotion added successfully',
        });
        setTimeout(() => {
          this._router.navigateByUrl('/Dashboard/promotions');
        }, 1000);
      });
  }

  editPromotion() {
    this.generalForm.submitForm();
    let condition = this.conditionForm.value;
    console.log('this is condition form', this.conditionForm);

    console.log('this is general values', this.generalValues);



    let generalData = {
      ...this.typeOfCondition,
      ...condition,
      client_purchased_order_amount: this.generalValues.client_purchased_order_amount,
      client_order_count: this.generalValues.client_order_count,
      name: this.editProm.name,
      description: this.generalValues.description,
      is_active: this.promotionStatus,
      country_id: this.generalValues.Country?.type,
      type: this.generalValues.ruleType?.type,
      platform: this.generalValues.platform.type,
      targeted_clients: [this.generalValues.targetedCustomer].map(
        (customer) => customer.type
      ),
      has_promocode: this._PromotionsService.hasPromo,
      max_offer_use: this.generalValues.perOffer,
      max_client_use: this.generalValues.perCustomer,
      has_date: condition.end_date ? true : false,

      start_date: this.datePipe.transform(condition.start_date, 'dd-MM-yyyy'),
      end_date: condition.end_date === null ? condition.end_date : this.datePipe.transform(condition.end_date, 'dd-MM-yyyy'),
      // end_date: this.datePipe.transform(condition.end_date, 'dd-MM-yyyy'),
      promocodes: this._PromotionsService.promoCodes,
    };
    console.log('this is condition values', condition);

    // console.log('This is general Data', generalData);

    // if (generalData.end_date === null) {
    //   console.log('this is end_date is = null ');

    // }

    // console.log('This is general data', generalData);

    if (this.typeName === 'BUY_X_GET_Y') {
      if (this.conditionType === 14) {
        generalData = {
          ...generalData,
          y_discount: this.conditionForm.get(controlKeys.amount)?.value,
        };
      }
    } else if (this.typeName === 'FLASH_OFFER') {
      generalData = {
        ...generalData,
        flash_offer_discount: Number(
          this.conditionForm.get(controlKeys.amount)?.value
        ).toFixed(2),
      };
    } else if (this.typeName === 'SPECIAL_PRICING') {
      generalData = {
        ...generalData,
        discount_amount: Number(
          this.conditionForm.get(controlKeys.amount)?.value
        ),
        discount_type: 1,
      };
      // console.log('general data', generalData);

    } else if (this.typeName === 'FREE_SHIPPING') {
      if (this.conditionType === 6) {
        generalData = {
          ...generalData,
          free_shipping_amount: condition.amount,
        };
        console.log('this is general data', generalData);
      } else if (this.conditionType === 8) {
        generalData = {
          ...generalData,
          free_shipping_no_of_items: Number(
            this.conditionForm.get(controlKeys.amount)?.value
          ),
        };
      }
    }

    this._PromotionsService
      .update(this.editProm.id, generalData)
      .subscribe((data) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'this promotion Updated successfully',
        });
        setTimeout(() => {
          this._router.navigateByUrl('/Dashboard/promotions');
        }, 1000);
      });
  }
}
