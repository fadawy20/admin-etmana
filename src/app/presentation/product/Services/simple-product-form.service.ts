import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum controlKeys {
  title_ar = 'title_ar',
  title_en = 'title_en',
  product_set_id = 'product_set_id',
  description_ar = 'description_ar',
  description_en = 'description_en',
  brand_id = 'brand_id',
  country_id = 'country_id',
  seller_id = 'seller_id',
  slug = 'slug',
  categories = 'categories',
  price = 'price',
  cost_price = 'cost_price',
  sku = 'sku',
  quantity = 'quantity',
  quantity_type = 'quantity_type',
  storage_conditions = 'storage_conditions',
  trucking = 'trucking',
  weight = 'weight',
  warehouse_location = 'warehouse_location',
  meta_title_ar = 'meta_title_ar',
  meta_title_en = 'meta_title_en',
  related_products = 'related_products',
  cross_sells = 'cross_sells',
  up_sells = 'up_sells',
  url = 'url',
  meta_keywords_ar = 'meta_keywords_ar',
  meta_keywords_en = 'meta_keywords_en',
  short_description_ar = 'short_description_ar',
  short_description_en = 'short_description_en',
  meta_description_en = 'meta_description_en',
  meta_description_ar = 'meta_description_ar',
  operational_description_ar = 'operational_description_ar',
  operational_description_en = 'operational_description_en',
  set_quantity = 'set_quantity',
  in_stock = 'in_stock',
  sale_price = 'sale_price',
  barcode = 'barcode',
  sale_price_start_date = 'sale_price_start_date',
  sale_price_end_date = 'sale_price_end_date',
  is_active = 'is_active'
}

@Injectable()
export class SimpleProductFormService {
  productForm: FormGroup;
  fuilfilmentForm: FormGroup;
  marketingForm: FormGroup;

  variationsObject: Object = {};
  basicInfo: Object = {};
  varationArray: any[] = [];
  baseUrl: string = environment.baseUrl;

  constructor(public fb: FormBuilder, private _HttpClient: HttpClient) {

    this.productForm = this.fb.group({
      [controlKeys.title_ar]: ['', [Validators.required]],
      [controlKeys.title_en]: ['', [Validators.required]],
      [controlKeys.brand_id]: ['', [Validators.required]],
      [controlKeys.categories]: [[], [Validators.required]],
      [controlKeys.country_id]: ['', [Validators.required]],
      [controlKeys.operational_description_ar]: ['', [Validators.required]],
      [controlKeys.operational_description_en]: ['', [Validators.required]],
      [controlKeys.price]: [
        '',
        // [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        [Validators.required, ],
      ],
      [controlKeys.sale_price]: [''],
      [controlKeys.sale_price_start_date] : [''],
      [controlKeys.sale_price_end_date] : [''],
      [controlKeys.product_set_id]: ['', [Validators.required]],
      [controlKeys.seller_id]: ['', [Validators.required]],
      [controlKeys.is_active]: ['', [Validators.required]],
      [controlKeys.sku]: ['', [Validators.required]],
      [controlKeys.cost_price]: [
        '',
        // [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        [Validators.required],
      ],
      [controlKeys.quantity_type]: ['', [Validators.required]],
      [controlKeys.quantity]: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      [controlKeys.in_stock]: ['', [Validators.required]],
      // [controlKeys.is_active]: ['', [Validators.required]],
      [controlKeys.barcode]: ['', [Validators.pattern(/^.{13}$/)]],
    });

    this.fuilfilmentForm = this.fb.group({
      [controlKeys.set_quantity]: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      [controlKeys.storage_conditions]: [''],
      [controlKeys.trucking]: [''],
      [controlKeys.weight]: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      [controlKeys.warehouse_location]: [''],
    });

    this.marketingForm = this.fb.group({
      [controlKeys.meta_title_ar]: [''],
      [controlKeys.meta_title_en]: [''],
      [controlKeys.related_products]: [''],
      [controlKeys.cross_sells]: [''],
      [controlKeys.up_sells]: [''],
      [controlKeys.url]: [''],
      [controlKeys.meta_keywords_ar]: [''],
      [controlKeys.meta_keywords_en]: [''],
      [controlKeys.meta_description_ar]: [''],
      [controlKeys.meta_description_en]: [''],
      [controlKeys.short_description_ar]: [''],
      [controlKeys.short_description_en]: [''],
      [controlKeys.description_ar]: [''],
      [controlKeys.description_en]: [''],
    });
  }



  createProduct(): Observable<any> {
    let variations = [];
    variations.push(this.variationsObject);
    let createObject = {
      ...this.basicInfo,
      variations: this.varationArray,
    };
    return this._HttpClient.post(`${this.baseUrl}admin/products`, createObject);
  }

  editConfigurable(id: any) {
    let variations = [];
    variations.push(this.variationsObject);
    let updatedObject = {
      ...this.basicInfo,
      variations: this.varationArray,
    };
    return this._HttpClient.put(
      `${this.baseUrl}admin/products/${id}`,
      updatedObject
    );
  }




  createSimpleProduct(): Observable<any> {
    let variations = [];
    // this.basicInfo = {
    //   country_id: Number(this.productForm.get('country_id')?.value),
    //   brand_id: this.productForm.get('brand_id')?.value,
    //   product_set_id: this.productForm.get('product_set_id')?.value,
    //   type: 1,
    //   seller_id: this.productForm.get('seller_id')?.value,
    //   title_ar: this.productForm.get('title_ar')?.value,
    //   title_en: this.productForm.get('title_en')?.value,
    //   operational_description_ar: this.productForm.get('operational_description_ar')?.value,
    //   operational_description_en: this.productForm.get('operational_description_en')?.value,
    //   // images: this.images.filter((img: any) => img?.id),
    //   categories: [this.productForm.get('categories')?.value],
    //   sku: this.productForm.get('sku')?.value,
    // }
    variations.push(this.variationsObject);
    console.log('this.variationsObject', this.variationsObject);

    let createObject = {
      ...this.basicInfo,
      variations: variations,
    };
    return this._HttpClient.post(`${this.baseUrl}admin/products`, createObject);
  }
  updateSimpleProduct(id: any): Observable<any> {
    let variations = [];
    variations.push(this.variationsObject);
    console.log(this.variationsObject);


    let updatedObject = {
      ...this.basicInfo,
      variations: variations,
    };
    return this._HttpClient.put(
      `${this.baseUrl}admin/products/${id}`,
      updatedObject
    );
  }

  delete(id: number) {
    return this._HttpClient.delete(`${this.baseUrl}admin/products/${id}`);
  }

  getReasons(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/reasons?filters[type]=1`);
  }
  changeStatus(productID: number, status: any) {
    return this._HttpClient.post(
      `${this.baseUrl}admin/product/status/${productID}`,
      status
    );
  }
}


