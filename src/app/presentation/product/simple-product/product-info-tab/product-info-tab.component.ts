import { HttpParams } from '@angular/common/http';

import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs';
import { ProductsService } from 'src/app/Services/products.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';






@Component({
  selector: 'app-product-info-tab',
  templateUrl: './product-info-tab.component.html',
  styleUrls: ['./product-info-tab.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    },
  ],
})
export class ProductInfoTabComponent implements OnInit {

  selectedValue: string = ''
  paginationParams: any
  loadingIndicator: boolean = false
  selectedColor: any[] = [];
  colorType: boolean = false
  test: string = ''
  msgs: Message[] = [];
  btnLoader: boolean = false


  // recieving data from parent component
  @Input() fb!: FormBuilder;
  @Input() images: any[] = []
  @Input() AttributesValues: any[] = []
  @Input() attributeSetsData: any[] = []
  @Input() next: any
  @Input() brandsData: any[] = []
  @Input() brandNext: any
  @Input() sellertNxet: any
  @Input() sellersData: any[] = []
  @Input() categoryNext: any
  @Input() categoryData: any[] = []
  @Input() submitted!: boolean;
  @Input() variations!: any[];
  @Input() productId?: number
  @Input() variationId?: number
  @Input() ProductVisibility: boolean = true

  // sending data to parent component
  @Output() handleAttSetValues: EventEmitter<any> = new EventEmitter();
  @Output() handleTabName: EventEmitter<any> = new EventEmitter();
  @Output() handleFormSubmission: EventEmitter<boolean> = new EventEmitter();
  @Output() onBrandScroll: EventEmitter<any> = new EventEmitter();
  @Output() onAttSetScroll: EventEmitter<any> = new EventEmitter();
  @Output() onSellerScroll: EventEmitter<any> = new EventEmitter();
  @Output() onCategoryScroll: EventEmitter<any> = new EventEmitter();
  @Output() emitSetID: EventEmitter<any> = new EventEmitter();




  constructor(
    private dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    private _ProductsService: ProductsService,
    public _SimpleProductFormService: SimpleProductFormService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {
    this.paginationParams = new HttpParams();
    this._SimpleProductFormService.productForm.get('in_stock')?.setValue(true)

  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB'); // Change this to your desired locale
    // console.log('This is value of start date value', this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value);

  }




  // scroll events
  scrollAttribute() {
    this.onAttSetScroll.emit()
  }

  scrollBrand() {
    this.onBrandScroll.emit()
  }

  scrollSeller() {
    this.onSellerScroll.emit()
  }

  scrollCategory() {
    this.onCategoryScroll.emit()
  }


  // get attributes
  product_set_id: number = 0
  getAttributes(data: any) {
    this.AttributesValues = []
    let values: any[] = []
    this.product_set_id = data.value
    Object.keys(this._SimpleProductFormService.productForm.controls).forEach((value) => {
      if (value.startsWith('_')) {
        this._SimpleProductFormService.productForm.removeControl(value)
      }
    })
    this._ProductsService.getAttributes(data.value).subscribe((res: any) => {
      res.data.attributes.forEach((value: any) => {
        values.push(value)

        if (!this._SimpleProductFormService.productForm.get(`_${value.id}`)) {
          this._SimpleProductFormService.productForm.addControl(`_${value.id}`,
            value.is_required ?
              this._SimpleProductFormService.fb.control('', Validators.required) :
              this._SimpleProductFormService.fb.control(''))
          if (value.type.name == 'BOOLEAN') {
            this._SimpleProductFormService.productForm.get(`_${value.id}`)?.setValue(false)
          }
        }
        this._SimpleProductFormService.productForm.get(`_${value.id}`)?.updateValueAndValidity();
        // if (this._SimpleProductFormService.productForm.get(`_${value.id}`)) {
        // }
      })
      this.handleAttSetValues.emit(values)
      this.emitSetID.emit(this.product_set_id)
    })
  }


  reset() {
    this._SimpleProductFormService.productForm.reset()
    this.AttributesValues = []
    this.submitted = false
  }

  submit() {
    if (this.productId) {
      this.updateProduct()
    } else {
      this.createProduct()
    }
  }

  createProduct() {
    // console.log( Number(this._SimpleProductFormService.productForm.get('sale_price')?.value), 'this is value');
    // console.log('this is start date', this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value,);

    // console.log('this is after formated form date', this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value, 'YYYY-MM-dd'));
    // console.log('this is after formated form date', this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_end_date')?.value, 'YYYY-MM-dd'));
    // // console.log('this is after formated form date',typeof this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value,  'YYYY-MM-dd'));
    // console.log('this is values of selected category', this._SimpleProductFormService.productForm.get('categories')?.value);


    this.submitted = true
    if (this._SimpleProductFormService.productForm.invalid) {
      console.log('i am invalid');
      // this._SimpleProductFormService.productForm
      console.log(this._SimpleProductFormService.productForm);

      this.loadingIndicator = false;
      return;
    } else {
      console.log('i am valid');

      if (this.images.length !== 0) {
        this.btnLoader = true
        this.confirmationService.confirm({
          message: ' if you submited the product you will redirect to the main page',
          header: 'Are you Sure You want to Submit the Product ?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.createObject()
            this._SimpleProductFormService.createSimpleProduct().pipe(
              finalize(() => this.btnLoader = false)
            ).subscribe((data: any) => {
              // console.log('data in create object', data);

              this.handleFormSubmission.emit(true)
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'this Product has been successfully created',
              });
              setTimeout(() => { this.router.navigateByUrl('Dashboard/product') }, 1000)
            })
          },
          reject: () => {
            this.createObject()
            this.handleTabName.emit('fulifilment')
            this.handleFormSubmission.emit(true)
          },
        });

      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading file',
          detail: 'Please Select Cover image to upload',
        });
      }

    }
  }

  updateProduct() {
    this.submitted = true
    if (this._SimpleProductFormService.productForm.invalid) {
      this.loadingIndicator = false;
      return;
    } else {
      if (this.images.length !== 0) {
        this.btnLoader = true
        this.confirmationService.confirm({
          message: ' if you submited the product you will redirect to the main page',
          header: 'Are you Sure You want to Submit the Product ?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.createObject()
            this._SimpleProductFormService.updateSimpleProduct(this.productId).pipe(
              finalize(() => this.btnLoader = false)
            ).subscribe((data: any) => {
              this.handleFormSubmission.emit(true)
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'this Product has been successfully Updated',
              });
              setTimeout(() => { this.router.navigateByUrl('Dashboard/product') }, 1000)

            })
          },
          reject: () => {
            this.createObject()
            this.handleTabName.emit('fulifilment')
            this.handleFormSubmission.emit(true)
          },
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading file',
          detail: 'Please Select Cover image to upload',
        });
      }

    }
  }

  createObject() {
    let attributes: any[] = [];
    this.AttributesValues.forEach((value: any) => {
      attributes.push({
        attribute_id: value.id,
        attribute_value: this._SimpleProductFormService.productForm.get(`_${value.id}`)?.value
      })
    })
    this._SimpleProductFormService.basicInfo = {
      ...this._SimpleProductFormService.basicInfo,
      country_id: Number(this._SimpleProductFormService.productForm.get('country_id')?.value),
      brand_id: this._SimpleProductFormService.productForm.get('brand_id')?.value,
      product_set_id: this._SimpleProductFormService.productForm.get('product_set_id')?.value,
      type: 1,
      seller_id: this._SimpleProductFormService.productForm.get('seller_id')?.value,
      title_ar: this._SimpleProductFormService.productForm.get('title_ar')?.value,
      title_en: this._SimpleProductFormService.productForm.get('title_en')?.value,
      sale_price: this._SimpleProductFormService.productForm.get('sale_price')?.value,
      sale_price_start_date: this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value, 'YYYY-MM-dd'),
      sale_price_end_date: this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_end_date')?.value, 'YYYY-MM-dd'),
      operational_description_ar: this._SimpleProductFormService.productForm.get('operational_description_ar')?.value,
      operational_description_en: this._SimpleProductFormService.productForm.get('operational_description_en')?.value,
      images: this.images.filter((img: any) => img?.id),
      categories: this._SimpleProductFormService.productForm.get('categories')?.value,
      sku: this._SimpleProductFormService.productForm.get('sku')?.value,
      is_active: this._SimpleProductFormService.productForm.get('is_active')?.value,
    }

    console.log('this._SimpleProductFormService.basicInfo', this._SimpleProductFormService.basicInfo);

    // this.images.filter((img: any) => img)

    this._SimpleProductFormService.variationsObject = {
      ...this._SimpleProductFormService.variationsObject,
      price: this._SimpleProductFormService.productForm.get('price')?.value,
      cost_price: this._SimpleProductFormService.productForm.get('cost_price')?.value,
      sku: this._SimpleProductFormService.productForm.get('sku')?.value,
      sale_price: this._SimpleProductFormService.productForm.get('sale_price')?.value,
      sale_price_start_date: this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value, 'YYYY-MM-dd'),
      sale_price_end_date: this.datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_end_date')?.value, 'YYYY-MM-dd'),
      quantity: this._SimpleProductFormService.productForm.get('quantity')?.value,
      quantity_type: Number(this._SimpleProductFormService.productForm.get('quantity_type')?.value),
      visibility: this.ProductVisibility,
      in_stock: this._SimpleProductFormService.productForm.get('in_stock')?.value,
      id: this.variationId || null,
      attributes: [...attributes],
      // categories: this._SimpleProductFormService.productForm.get('categories')?.value,

      barcode: this._SimpleProductFormService.productForm.get('barcode')?.value,
    }
    console.log(this._SimpleProductFormService.variationsObject, 'var');

  }




}
