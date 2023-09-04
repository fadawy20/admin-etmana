import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { finalize, retry } from 'rxjs';
import { ProductsService } from 'src/app/Services/products.service';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-config-info-tap',
  templateUrl: './config-info-tap.component.html',
  styleUrls: ['./config-info-tap.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: {
      parse: {
        dateInput: 'DD/MM/YYYY',
      },
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    }},
  ],
})
export class ConfigInfoTapComponent implements OnInit {


  loadingIndicator: boolean = false
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

  // sending data to parent component
  @Output() handleAttSetValues: EventEmitter<any> = new EventEmitter();
  @Output() handleTabName: EventEmitter<any> = new EventEmitter();
  @Output() handleFormSubmission: EventEmitter<boolean> = new EventEmitter();
  @Output() onBrandScroll: EventEmitter<any> = new EventEmitter();
  @Output() onAttSetScroll: EventEmitter<any> = new EventEmitter();
  @Output() onSellerScroll: EventEmitter<any> = new EventEmitter();
  @Output() onCategoryScroll: EventEmitter<any> = new EventEmitter();
  @Output() addToGrid: EventEmitter<any> = new EventEmitter();
  @Output() getAttrSetID: EventEmitter<any> = new EventEmitter();


  constructor(
    private dateAdapter: DateAdapter<Date>,
    private _datePipe : DatePipe,
    private _ProductsService: ProductsService,
    public _SimpleProductFormService: SimpleProductFormService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) { }

  // get attributes
  getAttributes(data: any) {
    this.getAttrSetID.emit(data.value)
    this.AttributesValues = []
    let values: any[] = []
    this.variationsDisplay = []
    Object.keys(this._SimpleProductFormService.productForm.controls).forEach((value) => {
      if (value.startsWith('_')) {
        this._SimpleProductFormService.productForm.removeControl(value)
      }
    })
    this._ProductsService.getAttributes(data.value).subscribe((res: any) => {
      res.data.attributes.forEach((value: any) => {
        values.push(value)
        this._SimpleProductFormService.productForm.addControl(`_${value.id}`,
          value.is_required ?
            this._SimpleProductFormService.fb.control('', Validators.required) :
            this._SimpleProductFormService.fb.control(''))
        if (value.type.name == 'BOOLEAN') {
          this._SimpleProductFormService.productForm.get(`_${value.id}`)?.setValue(false)
        }
      })
      this.addToGrid.emit(this.variationsDisplay)
      this.handleAttSetValues.emit(values)
    })
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



  variationsDisplay: any[] = []
  createProduct() {
    let attributes: any[] = [];
    let variationsArr: any[] = []
    this.AttributesValues.forEach((value: any) => {
      let attributeValues: any
      attributes.push({
        attribute_id: value.id,
        attribute_value: this._SimpleProductFormService.productForm.get(`_${value.id}`)?.value
      })
      let formValues = this._SimpleProductFormService.productForm.get(`_${value.id}`)?.value
      formValues = Array.isArray(formValues) ? formValues : [formValues]
      if (value.type.name === 'TEXT_FIELD' || value.type.name === 'BOOLEAN') {
        attributeValues = [
          {
            value_en: this._SimpleProductFormService.productForm.get(`_${value.id}`)?.value,
            attribute_id: value.id,
            title: value.title_en,
            id: this._SimpleProductFormService.productForm.get(`_${value.id}`)?.value,
          }
        ]
      } else {
        attributeValues = value.attribute_values.filter((values: any) => formValues.includes(values.id))
          .map((attributeValues: any) => ({ ...attributeValues, title: value.title_en }))
      }
      variationsArr.push(attributeValues)
    })
    this.variationsDisplay = this.setVariations(variationsArr, [])
    this.variationsDisplay = this.variationsDisplay.map(variation => ({
      variation,
      price: this._SimpleProductFormService.productForm.get('price')?.value,
      // categories : this._SimpleProductFormService.productForm.get('categories')?.value,
      sale_price: this._SimpleProductFormService.productForm.get('sale_price')?.value,
      sale_price_start_date: this._datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_start_date')?.value, 'YYYY-MM-dd'),
      sale_price_end_date: this._datePipe.transform(this._SimpleProductFormService.productForm.get('sale_price_end_date')?.value,'YYYY-MM-dd' ),
      cost_price: this._SimpleProductFormService.productForm.get('cost_price')?.value,
      sku: this._SimpleProductFormService.productForm.get('sku')?.value + '-' + variation.map(({ value_en }: any) => value_en).join('-'),
      quantity: Number(this._SimpleProductFormService.productForm.get('quantity')?.value),
      url: '',
      images: [],
      viewImage: false
    }))
    console.log('this.variationsDisplay in config ', this.variationsDisplay);

    this.addToGrid.emit(this.variationsDisplay)
  }


  setVariations(variationsArr: any[], arr: any[]): any[] {
    let x = variationsArr.pop()
    let y: any[] = []
    x?.forEach((value: any) => {
      if (arr.length === 0) {
        y?.push([value])
      } else {
        arr.forEach((element: any) => {
          y?.push([...element, value])
        })
      }
    })
    if (variationsArr.length === 0) {
      return y
    } else {
      return this.setVariations(variationsArr, y)
    }
  }






  ngOnInit(): void {
    this.dateAdapter.setLocale('en-GB'); // Change this to your desired locale
  }

}
