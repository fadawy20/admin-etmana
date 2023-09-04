import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';
import { ProductsService } from 'src/app/Services/products.service';
import { finalize } from 'rxjs';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-marketing-tap',
  templateUrl: './marketing-tap.component.html',
  styleUrls: ['./marketing-tap.component.scss']
})
export class MarketingTapComponent implements OnInit {

  submitted: boolean = false
  @Output() handleTabName: EventEmitter<any> = new EventEmitter();
  msgs: Message[] = [];
  btnLoader: boolean = false


  @Input() productData: any[] = []
  @Input() productNext: string = ''
  @Input() productId?: number
  @Output() onProductScroll: EventEmitter<any> = new EventEmitter();

  constructor(
    public _SimpleProductFormService: SimpleProductFormService,
    private _ProductsService: ProductsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) {
  }

  ngOnInit(): void {
  }


  handleScrollEvent() {
    this.onProductScroll.emit()
  }

  submit() {
    if (this.productId) {
      this.updateMarketingForm()
    } else {
      this.saveMarketingForm()
    }
  }


  saveMarketingForm() {
    this.submitted = true
    if (this._SimpleProductFormService.fuilfilmentForm.invalid) {
      return;
    } else {

      this.confirmationService.confirm({
        message: ' if you submited the product you will redirect to the main page',
        header: 'Are you Sure You want to Submit the Product ?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.createObject()
          this._SimpleProductFormService.createSimpleProduct().pipe(
            finalize(() => this.btnLoader = false)
          ).subscribe((data: any) => {
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
        },
      });
    }
  }

  updateMarketingForm() {
    this.submitted = true
    if (this._SimpleProductFormService.fuilfilmentForm.invalid) {
      return;
    } else {

      this.confirmationService.confirm({
        message: ' if you submited the product you will redirect to the main page',
        header: 'Are you Sure You want to Submit the Product ?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.createObject()
          this._SimpleProductFormService.updateSimpleProduct(this.productId).pipe(
            finalize(() => this.btnLoader = false)
          ).subscribe((data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'this Product has been Updated created',
            });
            setTimeout(() => { this.router.navigateByUrl('Dashboard/product') }, 1000)
          })
        },
        reject: () => {
          this.createObject()
        },
      });
    }
  }

  createObject() {
    this._SimpleProductFormService.basicInfo = {
      ...this._SimpleProductFormService.basicInfo,
      short_description_ar: this._SimpleProductFormService.marketingForm.get('short_description_ar')?.value,
      short_description_en: this._SimpleProductFormService.marketingForm.get('short_description_en')?.value,
      description_ar: this._SimpleProductFormService.marketingForm.get('description_ar')?.value,
      description_en: this._SimpleProductFormService.marketingForm.get('description_en')?.value,
      meta_keywords_en: this._SimpleProductFormService.marketingForm.get('meta_keywords_en')?.value,
      meta_description_ar: this._SimpleProductFormService.marketingForm.get('meta_description_ar')?.value,
      meta_keywords_ar: this._SimpleProductFormService.marketingForm.get('meta_keywords_ar')?.value,
      meta_description_en: this._SimpleProductFormService.marketingForm.get('meta_description_en')?.value,
      slug: this._SimpleProductFormService.marketingForm.get('url')?.value,
      related_products: this._SimpleProductFormService.marketingForm.get('related_products')?.value,
      meta_title_ar: this._SimpleProductFormService.marketingForm.get('meta_title_ar')?.value,
      meta_title_en: this._SimpleProductFormService.marketingForm.get('meta_title_en')?.value,
      cross_sells: this._SimpleProductFormService.marketingForm.get('cross_sells')?.value,
      up_sells: this._SimpleProductFormService.marketingForm.get('up_sells')?.value,
    }
  }

  reset() {
    this._SimpleProductFormService.marketingForm.reset()
  }

}
