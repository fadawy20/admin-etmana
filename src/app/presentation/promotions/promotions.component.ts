import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { Subscription, finalize, map } from 'rxjs';
import { ExportsService } from 'src/app/Services/exports.service';
import { PromotionsService } from 'src/app/Services/promotions.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit, OnDestroy {
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  data$: any;
  length: number = 0;
  page: number = 0;
  selectedItems: any[] = [];
  @ViewChild('table', { static: false })
  pageSize?: number;
  pageNumber?: number;
  msgs: Message[] = [];
  filterType: any[] = [];
  checkStatusFilter: boolean = false;
  paginationParams: any;
  filterOfNames: any[] = [];
  allColumnFilter: any[] = [];
  searchValue!: string;
  showFilterField!: boolean;
  visibility: any[] = [];
  filterField!: FormGroup;
  unsubscribe: Subscription[] = [];
  constructor(
    private datePipe: DatePipe,
    private _exportService: ExportsService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _PromotionsService: PromotionsService,
    private router: Router
  ) {
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'AssociateWebsite', header: 'Country' },
      { field: 'promotionName', header: 'Name' },
      { field: 'ruleType', header: 'Rule Type' },
      { field: 'condition', header: 'Condition' },
      { field: 'Date', header: 'Date' },
    ];
    this.filterType = [
      { id: 1, name: 'Free Shipping' },
      { id: 2, name: 'Buy X Get Y' },
      { id: 3, name: 'Flash Offer' },
      { id: 4, name: 'Special Pricing' },
      { id: 5, name: 'Discount' },
    ];
    this.visibility = [
      { value: 1, name: 'Active' },
      { value: 0, name: 'In Active' },
    ];
    this.filterField = this.fb.group({
      ['name']: [''],
      ['is_active']: [''],
      ['type']: [''],
      ['created_from']: [''],
      ['created_to']: [''],
    });
    this.paginationParams = new HttpParams();
    this.data$ = this.getAllPromorions()


  }

  ngOnInit(): void { }

  // get all pormotion
  getAllPromorions() {
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this.loadingIndicator = true;
    this.pageNumber = 1;
    this.pageSize = 50;

    return this._PromotionsService.get(this.paginationParams).pipe(
      map((promotions) => {
        console.log('Promotions', promotions);

        this.length = promotions.meta.total;
        this.page = promotions.meta.last_page;
        return promotions?.data?.map((promotion: any) => {
          // let dateFrom = this.datePipe.transform(
          //   promotion.start_date,
          //   'E  d  MMM'
          // );
          // let dateTo = this.datePipe.transform(promotion.end_date, 'E  d  MMM');
          return {
            id: promotion.id,
            promotionName: promotion.name,
            AssociateWebsite: promotion.country.name_en,
            ruleType: promotion.type.name,
            Date: `${this.datePipe.transform(
              promotion?.start_date,
              'E  d  MMM'
            )} to ${promotion.end_date === null ? '__' : this.datePipe.transform(promotion?.end_date, 'E  d  MMM')} `,
            status: promotion.is_active,
            condition: promotion.condition,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  showFilterFieldFn(value: boolean) {
    this.showFilterField = value;
  }
  resetForm() {
    this.filterField.reset();
  }
  checkSearchVal(value: string) {
    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this.paginationParams = this.paginationParams.set(`search_key`, value);

    this.loadingIndicator = true;
    this.data$ = this._PromotionsService
      .getPromotionsBySearch(this.paginationParams)
      .pipe(
        map((promotions) => {
          this.length = promotions.meta.total;
          this.page = promotions.meta.last_page;
          return promotions?.data?.map((promotion: any) => {
            return {
              id: promotion.id,
              promotionName: promotion.name,
              AssociateWebsite: promotion.country.name_en,
              ruleType: promotion.type.name,
              Date: `${this.datePipe.transform(
                promotion?.start_date,
                'E  d  MMM'
              )} to ${this.datePipe.transform(
                promotion?.end_date,
                'E  d  MMM'
              )}`,
              status: promotion.is_active,
              condition: promotion.condition,
            };
          });
        }),
        finalize(() => (this.loadingIndicator = false))
      );
  }

  search(value: string) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize,
    };
    if (value === '') {
      this.paginationParams = this.paginationParams.delete('search_key');
      this.handlePageSize(data);
    } else {
      this.checkSearchVal(value);
    }
  }

  getFilterAction() {
    if (
      this.filterField.get('name')?.value !== '' ||
      this.filterField.get('type')?.value.name !== '' ||
      this.filterField.get('created_from')?.value !== '' ||
      this.filterField.get('created_to')?.value !== '' ||
      this.filterField.get('is_active')?.value !== ''
    ) {
      this.pageNumber = 1;
      this.pageSize = 5;
      this.paginationParams = this.paginationParams.set(
        'page',
        this.pageNumber
      );
      this.paginationParams = this.paginationParams.set(
        'per_page',
        this.pageSize
      );
      this.paginationParams = this.paginationParams.set(
        `filters[name]`,
        this.filterField.get('name')?.value
          ? this.filterField.get('name')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[type]`,
        this.filterField.get('type')?.value?.id
          ? this.filterField.get('type')?.value?.id
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[is_active]`,
        this.filterField.get('is_active')?.value.name === 'Active'
          ? 1
          : this.filterField.get('is_active')?.value.name === 'In Active'
            ? 0
            : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[created_from]`,
        this.datePipe.transform(
          this.filterField.get('created_from')?.value,
          'dd-MM-YYYY'
        )
          ? this.datePipe.transform(
            this.filterField.get('created_from')?.value,
            'dd-MM-YYYY'
          )
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[created_to]`,
        this.datePipe.transform(
          this.filterField.get('created_to')?.value,
          'dd-MM-YYYY'
        )
          ? this.datePipe.transform(
            this.filterField.get('created_to')?.value,
            'dd-MM-YYYY'
          )
          : ''
      );
      this.handlePageSize(this.paginationParams);
      // this.data$ = this._PromotionsService.getFilterColumn(this.paginationParams).pipe(
      //   map((promotions) => {
      //     this.length = promotions.meta.total;
      //     this.page = promotions.meta.last_page;
      //     return promotions?.data?.map((promotion: any) => {

      //       return {
      //         id: promotion.id,
      //         promotionName: promotion.name,
      //         AssociateWebsite: promotion.country.name_en,
      //         ruleType: promotion.type.name,
      //         Date: `${this.datePipe.transform(promotion?.start_date,'E  d  MMM')} to ${this.datePipe.transform(promotion?.end_date, 'E  d  MMM')}`,
      //         status: promotion.is_active,
      //         condition: promotion.condition,
      //       };
      //     });
      //   }),
      //   finalize(() => {

      //     this.loadingIndicator = false
      //   })
      // );
    } else {
      this.data$ = this.getAllPromorions();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.paginationParams = this.paginationParams.delete(`filters[name]`);
    this.paginationParams = this.paginationParams.delete(`filters[type]`);
    this.paginationParams = this.paginationParams.delete(`filters[is_active]`);
    this.paginationParams = this.paginationParams.delete(
      `filters[created_from]`
    );
    this.paginationParams = this.paginationParams.delete(`filters[created_to]`);
    this.data$ = this.getAllPromorions();
  }

  // route to crud page
  openCreateDialog(data: any) {
    this.router.navigateByUrl('/Dashboard/promotions/Create');
  }
  EditHandler(data: any) {
    this.router.navigateByUrl('/Dashboard/promotions/edit/' + data.id);
  }

  // delete promotion
  handleDeleteBrand(value: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Promotion ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._PromotionsService.delete(value.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'This Promotion is deleted successfully',
          });
        });
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Rejected',
            detail: 'You have rejected',
          },
        ];
      },
    });
  }

  // bulk delete
  handleBulkDeletePromotion(value: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Promotion ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let brandIDs = value.map((brand: any) => {
          return brand.id;
        });

        let deletedids = {
          ids: brandIDs,
        };

        this._PromotionsService
          .RemoveBulk(deletedids)
          .subscribe((data: any) => {
            let dataPage = {
              page: this.pageNumber,
              size: this.pageSize,
            };
            this.selectedItems = [];
            this.handlePageSize(dataPage);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'These promotions are deleted successfully',
            });
          });
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Rejected',
            detail: 'You have rejected',
          },
        ];
      },
    });
  }

  // pagination and size
  handlePageSize(value: any) {
    this.pageSize = value.size;
    this.pageNumber = value.page;
    this.paginationParams = this.paginationParams.set(
      'page',
      this.pageNumber ? this.pageNumber : 1
    );
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize ? this.pageSize : 50
    );
    this.loadingIndicator = true;
    this.data$ = this._PromotionsService.paginate(this.paginationParams).pipe(
      map((promotions) => {
        this.length = promotions.meta.total;
        this.page = promotions.meta.last_page;
        return promotions?.data?.map((promotion: any) => {
          return {
            id: promotion.id,
            promotionName: promotion.name,
            AssociateWebsite: promotion.country.name_en,
            ruleType: promotion.type.name,
            Date: `${this.datePipe.transform(
              promotion?.start_date,
              'E  d  MMM'
            )} to ${this.datePipe.transform(promotion?.end_date, 'E  d  MMM')}`,
            status: promotion.is_active,
            condition: promotion.condition,
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
        // this.paginationParams = this.paginationParams.delete(`filters[name]`)
        // this.paginationParams = this.paginationParams.delete(`filters[type]`)
        // this.paginationParams = this.paginationParams.delete(`filters[is_active]`)
        // this.paginationParams = this.paginationParams.delete(`filters[created_from]`)
        // this.paginationParams = this.paginationParams.delete(`filters[created_to]`)
      })
    );
  }

  // bulk export
  handleBulkExportedData(value: any) {
    let SelectedIds = value.map((item: any) => {
      return item.id;
    });
    let IDS: any = {
      ids: SelectedIds,
    };
    if (value.length === 0) {
      let EmptyArr: any = this.selectedItems;
      this._exportService
        .exportBulk(EmptyArr, 'admin/promotions/export')
        .subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
          this.download(data, data.type);
        });
    } else {
      this._exportService
        .exportBulk(SelectedIds, 'admin/promotions/export')
        .subscribe((data: any) => {
          this.download(data, data.type);
          // this.selectedItems = [];
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
        });
    }
  }

  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  changeStatus(value: any) {
    this.loadingIndicator = true;
    this._PromotionsService
      .toggleStatus(value.id, value.checked)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((res) => {
        let dataPage = {
          page: this.pageNumber,
          size: this.pageSize,
        };
        this.handlePageSize(dataPage);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Status Changed Successfully',
        });
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((e) => {
      e.unsubscribe();
    });
  }
}
