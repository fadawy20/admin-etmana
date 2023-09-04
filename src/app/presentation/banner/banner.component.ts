import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DATAOFTABLE, Length, LoadingIndicator, TableHeader } from './bannerinterface';
import { CmsService } from 'src/app/Services/cms.service';
import { DatePipe } from '@angular/common';
import { finalize, map } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {
  tableHeader!: TableHeader[];
  length !: Length;
  loadingIndicator: LoadingIndicator = false
  data$ !: DATAOFTABLE[]
  constructor(private messageService: MessageService, private _confirmationService: ConfirmationService, private _cmsService: CmsService, private _router: Router, private _DataPipe: DatePipe) { }

  ngOnInit(): void {


    // TABLE HEADER
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'title_en', header: 'Title English' },
      { field: 'title_ar', header: 'Title Arabic' },
      { field: 'page_url', header: 'Page Url' },
      { field: 'location_in_page', header: 'Location In Page' },
      { field: 'created_at', header: 'Created At' },
      { field: 'country', header: 'Country' },
    ];
    // LENGTH OF TABLE
    this.length = 1000;
    // setTimeout(() => {
    //   this.loadingIndicator = false
    // }, 2000);

    //  THIS IS STATIC DATA THAT OBJECT WILL BE MATCH WITH FILED OF TABLE HEADER
    this.getBannerTable();
  }

  getBannerTable() {
    this.data$ = this.getBanners()
  }
  routeToComponent(path: string) {
    (path === 'create') ? this._router.navigateByUrl(`/Dashboard/banner/${path}`) : this._router.navigateByUrl(`/Dashboard/banner/${path}/${this.bannerId}`)
  }

  // THIS NAVIGATE TO THE CREATE BANNER
  openCreateDialog(data: any) {
    this.routeToComponent('create')
  }
  bannerId !: number
  // THIS NAVIGATE TO THE CREATE BANNER BUT ROUTE EDITING
  EditHandler(data: any) {
    this.bannerId = data?.id
    this.routeToComponent('edit')

  }

  getBanners(): any {
    this.loadingIndicator = true
    return this._cmsService.getCms().pipe(map((res: any) => {
      return res?.data.filter((obj: any) => {
        return obj?.type?.name === 'BANNER'
      }).map((slider: any) => {
        return {
          id: slider?.id,
          title_en: slider?.title_en,
          title_ar: slider?.title_ar,
          page_url: slider?.page_url,
          location_in_page: slider?.location_in_page,
          country: slider?.country_id.name_en,
          created_at: this._DataPipe.transform(slider?.country_id.created_at, 'yyyy-MM-dd')

        }
      })

    }), finalize(() => this.loadingIndicator = false))
  }

  handleDeleteBanner(value: any) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete slider?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._cmsService.deleteCms(value?.id).subscribe((res: any) => {
          this.getBannerTable()
          // this.data$ = this.getSliders()
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });

        })
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
      }
    })

  }


}
