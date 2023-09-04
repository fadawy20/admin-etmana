import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize, map } from 'rxjs';
import { CMS, CmsService } from 'src/app/Services/cms.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  // @ViewChild('table1', {static : false})

  tableHeader: any[] = [];
  data$: any[] = [];
  length: number = 0;
  loadingIndicator = false
  constructor(private messageService: MessageService, private router: Router, private _cmsService: CmsService, private _DataPipe: DatePipe, private _confirmationService: ConfirmationService) {
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'title_en', header: 'Title English' },
      { field: 'title_ar', header: 'Title Arabic' },
      { field: 'page_url', header: 'Page Url' },
      { field: 'location_in_page', header: 'Location In Page' },
      { field: 'created_at', header: 'Created At' },
      { field: 'country', header: 'Country' },
    ];
    this.data$ = [{
      Title: 1,
      "Page URL": 'United',
      Target: 'United'
    }, {
      Title: 2,
      "Page URL": 'EGYPT',
      Target: 'EGYPT'
    }]
    // *** this is for testing purposes
    // this.data =  this.data$.map((item)=> {
    //   return {
    //     id : item.id,

    //   }
    // })
    // console.log('data', this.data);

    this.length = 1000;
    //
    // setTimeout(() => {
    //   this.loadingIndicator = false
    // }, 3000);
  }
  slidersTable: any[] = []
  ngOnInit(): void {
    this.getSLiderTable()
    console.log('This is sliders table', this.slidersTable);

  }
  getSLiderTable() {
    this.slidersTable = this.getSliders()
  }

  openCreateDialog(data: any) {
    this.router.navigateByUrl('/Dashboard/slider/Create')
  }

  EditHandler(data: any) {
    // console.log('editHandler done', data);
    this.router.navigateByUrl(`/Dashboard/slider/edit/${data?.id}`)
  }
  sliders: any[] = []
  getSliders(): any {
    this.loadingIndicator = true
    return this._cmsService.getCms().pipe(map((res: any) => {
      return res?.data.filter((obj: any) => {
        return obj?.type?.name === 'SLIDER'
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
    // .subscribe((res) => {
    //   console.log('This is a cms subscription', res.data)
    //   this.sliders = res?.data.filter((slider: any) => { return slider.type.name === "SLIDER" })
    // })
  }

  handleDeleteSlider(value: any) {
    console.log('This is value is deleted', value);
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete slider?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._cmsService.deleteCms(value?.id).subscribe((res: any) => {
          this.getSLiderTable()
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
