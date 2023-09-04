import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ProductsService } from 'src/app/Services/products.service';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';

@Component({
  selector: 'app-fulfilment-tap',
  templateUrl: './fulfilment-tap.component.html',
  styleUrls: ['./fulfilment-tap.component.scss']
})
export class FulfilmentTapComponent implements OnInit {

  storageData: any[] = []
  submitted: boolean = false
  @Input() productId?: number
  @Output() handleTabName: EventEmitter<any> = new EventEmitter();
  @Output() handleFormSubmission: EventEmitter<boolean> = new EventEmitter();
  msgs: Message[] = [];
  btnLoader: boolean = false

  constructor(
    public _SimpleProductFormService: SimpleProductFormService,
    private _ProductsService: ProductsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this._ProductsService.getStorageConditions().subscribe((res: any) => {
      this.storageData = res.data
    })
  }

  ngOnInit(): void {
  }

  submit() {
    if (this.productId) {
      this.updateFulfilment()
    } else {
      this.saveFulfilment()
    }
  }

  saveFulfilment() {
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
          this.handleTabName.emit('marketing')
          this.handleFormSubmission.emit(true)
        },
      });
    }
  }

  updateFulfilment() {
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
          this.handleTabName.emit('marketing')
          this.handleFormSubmission.emit(true)
        },
      });
    }
  }

  createObject() {
    this._SimpleProductFormService.basicInfo = {
      ...this._SimpleProductFormService.basicInfo,
      trucking: this._SimpleProductFormService.fuilfilmentForm.get('trucking')?.value,
      set_quantity: this._SimpleProductFormService.fuilfilmentForm.get('set_quantity')?.value,
      warehouse_location: this._SimpleProductFormService.fuilfilmentForm.get('warehouse_location')?.value,
      storage_conditions: this._SimpleProductFormService.fuilfilmentForm.get('storage_conditions')?.value,
    }
    this._SimpleProductFormService.variationsObject = {
      ...this._SimpleProductFormService.variationsObject,
      weight: this._SimpleProductFormService.fuilfilmentForm.get('weight')?.value,
    }
  }

  reset() {
    this._SimpleProductFormService.fuilfilmentForm.reset()
  }

}
