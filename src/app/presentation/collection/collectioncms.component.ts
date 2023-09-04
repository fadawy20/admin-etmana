import { Component, OnInit, ViewChild } from '@angular/core';
import { Length, LoadingIndicator, TableHeader } from '../banner/bannerinterface';
import { Router } from '@angular/router';
import { CollectionService } from 'src/app/Services/collection.service';
import { HttpParams } from '@angular/common/http';
import { Observable, finalize, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { CmsService } from 'src/app/Services/cms.service';

type Response = { message: string }


@Component({
  selector: 'app-collectioncms',
  templateUrl: './collectioncms.component.html',
  styleUrls: ['./collectioncms.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class CollectioncmsComponent implements OnInit {

  tableHeader !: TableHeader[]
  length !: Length;
  loadingIndicator !: LoadingIndicator
  // @ViewChild('table1', { static: false })
  data$: Observable<any> | undefined;
  params: any
  showConfirmDialog: boolean = false
  constructor(private _cmsService: CmsService, private _router: Router, private _collectionService: CollectionService,
    private _datePipe: DatePipe, private confirmationService: ConfirmationService, private messageService: MessageService,) {
    this.params = new HttpParams()
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'title_en', header: 'title_en' },
      { field: 'title_ar', header: 'title_ar' },
      { field: 'page_url', header: 'page_url' },
      { field: 'created_at', header: 'created_at' },
      { field: 'country', header: 'country' },
    ];
    this.length = 1000;
    this.loadingIndicator = true
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 2000);

    // this.data$ = [{
    //   Title : 1,
    //   "Page URL" : 'United',
    //   Target : 'United'
    // },{
    //   Title :2,
    //   "Page URL" : 'EGYPT',
    //   Target : 'EGYPT'
    // } ]
  }

  ngOnInit(): void {
    this.data$ = this.getAllColloctions()
  }

  // getAllCollection (){
  //   this.params = this.params.set('page', 1);
  //   this.params = this.params.set('per_page', 200);
  //  return this._collectionService.paginate(this.params)
  //  .pipe(map((collections)=> {
  //   return collections?.data?.map((collection : any)=> {
  //     return {
  //       id : collection?.id,
  //       status : collection?.is_active,
  //       products_count : collection?.products_count,
  //       title : collection?.title_en,
  //       created_at : this._datePipe.transform(collection?.created_at, 'dd-MM-YYYY')
  //     }
  //   })
  //   }),finalize(()=> this.loadingIndicator = false))
  // }
  getAllColloctions(): any {
    this.loadingIndicator = true
    return this._cmsService.getCms().pipe(map((res: any) => {
      return res?.data.filter((obj: any) => {
        return obj?.type?.name === 'PRODUCT_LIST'
      }).map((slider: any) => {
        return {
          id: slider?.id,
          title_en: slider?.title_en,
          title_ar: slider?.title_ar,
          page_url: slider?.page_url,
          location_in_page: slider?.location_in_page,
          country: slider?.country_id.name_en,
          created_at: this._datePipe.transform(slider?.country_id.created_at, 'yyyy-MM-dd')
        }
      })

    }), finalize(() => this.loadingIndicator = false))
    // .subscribe((res) => {
    //   console.log('This is a cms subscription', res.data)
    //   this.sliders = res?.data.filter((slider: any) => { return slider.type.name === "SLIDER" })
    // })
  }

  handleBulkDeleteSelectedCollection(value: any) {
    // console.log('This is value ===> ', value);
  }


  handleDeleteCollection(value: any) {
    // this.showConfirmDialog = true;
    console.log('This is value ===> ', value);
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._cmsService.deleteCms(value?.id).subscribe((response: any) => {
          console.log('This is response ===> ', response);
          this.loadingIndicator = true
          this.data$ = this.getAllColloctions()
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response?.message,
          });

        })
      }, reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    })

  }


  changeStatus(value: any) {
    // console.log('This is value is comming from ====> ' + value.checked);
    // THIS IS VALUE IS  {checked: true, id: 13}
    this.loadingIndicator = true
    this._collectionService.changeStatusCollection(value?.id, value?.checked)
      .pipe(finalize(() => this.loadingIndicator = false))
      .subscribe((response) => {
        // console.log('This is response is ' + response?.data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Status Changed Successfully',
        });
      })


  }








  openCreateDialog(path: any) {
    this._router.navigateByUrl('/Dashboard/collection/createCollection')

  }
  EditHandler(value: any) {
    this._router.navigateByUrl(`/Dashboard/collection/editCollection/${value?.id}`)

  }

}
