import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { finalize, map, Observable } from 'rxjs';
import { CreditStoreService } from 'src/app/Services/credit-store.service';
import { ExportsService } from 'src/app/Services/exports.service';

@Component({
  selector: 'app-credit-store',
  templateUrl: './credit-store.component.html',
  styleUrls: ['./credit-store.component.scss'],
})
export class CreditStoreComponent implements OnInit {
  @ViewChild('table', { static: false }) table!: any;
  display: boolean = false;
  paginationParams: any;
  loadingIndicator: boolean = false;
  length: number = 0;
  page: number = 0;
  editImageUrl: string = '';
  selectedMenu: any = '';
  tableHeader: any[] = [];
  pageSize: number = 50;
  pageNumber: number = 1;
  msgs: any[] = [];
  selectedItems: any[] = [];
  params: any;
  totalItems: number = 0;
  data$: Observable<any>;
  isEditBtnClicked: any;
  checkStatus?: boolean;
  creditId: number = 0;
  comment: string = '';
  reasons: any[] = [];
  status: any[] = [];
  type: any[] = [];
  responsibility: any[] = [];

  allColumnFilter: any[] = [];
  searchValue!: string;
  showFilterField!: boolean;
  filterOfNames: any[] = ['Name'];
  filterField!: FormGroup;

  constructor(
    private Router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _exportService: ExportsService,
    private _CreditStoreService: CreditStoreService,
    private fb: FormBuilder
  ) {
    this.params = new HttpParams();
    this.paginationParams = new HttpParams();
    this.tableHeader = [
      { field: 'id', header: 'Id' },
      { field: 'creditType', header: 'Credit Type' },
      { field: 'orderId', header: 'Order ID' },
      { field: 'totalAmount', header: 'Total Amount' },
      // { field: 'creditName', header: 'Credit Name' },
      { field: 'customer', header: 'Customer' },
      { field: 'responsibility', header: 'Responsibility' },
      { field: 'status', header: 'Status' },
      { field: 'date', header: 'Date' },
    ];
    this.filterField = this.fb.group({
      ['name']: [''],
      ['type']: [''],
      ['status']: [''],
      ['date_from']: [''],
      ['date_to']: [''],
      ['responsibility_type']: [''],
      ['amount_from']: [''],
      ['amount_to']: [''],
    });
    this.status = [
      { id: 1, name: 'New' },
      { id: 2, name: 'Approve' },
      { id: 3, name: 'Rejected' },
    ];
    this.type = [
      { id: 1, name: 'Refund' },
      { id: 2, name: 'Compensate' },
    ];
    this.responsibility = [
      { id: 1, name: 'Seller' },
      { id: 2, name: 'Customer Services' },
      { id: 3, name: 'Logistics' },
      { id: 4, name: 'Commercial' },
    ];

    this.data$ = this.getListCredit();
  }
  showFilterFieldFn(value: boolean) {
    this.showFilterField = value;
  }
  resetForm() {
    this.filterField.reset();
  }
  checkSearchVal(value: string) {
    this.data$ = this._CreditStoreService.getCreditBySearch(value).pipe(
      map((credits) => {
        this.length = credits.meta.total;
        this.page = credits.meta.last_page;
        this.checkStatus = false;
        return credits?.data?.map((credit: any) => {
          this.checkStatus =
            credit?.validation_status?.name === 'NEW' ? true : false;
          return {
            id: credit?.id,
            creditType: credit?.type?.name,
            creditName: credit?.name,
            totalAmount: credit?.amount,
            validation_status: credit?.validation_status?.name,
            customer: credit?.customer_type?.name
              ? credit?.customer_type?.name
              : '--',
            responsibility: credit?.responsibility_type.name,
            Status: credit?.validation_status?.name,
            date:
              credit.type.name === 'COMPENSATE'
                ? `From ${this.datePipe.transform(
                    credit?.date_from,
                    'd  MMM'
                  )} to ${this.datePipe.transform(credit?.date_to, 'd  MMM')}`
                : `--`,
            checkStatus: credit?.validation_status?.name,
            backGroundColor:
              credit.validation_status?.id === 1
                ? '#FEEFD0'
                : credit.validation_status?.id === 2
                ? '#E5F6F4'
                : credit.validation_status?.id === 4
                ? '#EFEAF1'
                : credit.validation_status?.id === 3
                ? '#FBE8EE'
                : '',
            color:
              credit.validation_status?.id === 1
                ? '#0E1740'
                : credit.validation_status?.id === 2
                ? '#00A599'
                : credit.validation_status?.id === 4
                ? '#5F2D79'
                : credit.validation_status?.id === 3
                ? '#D92059'
                : '',
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false ))
    );
  }

  searchInCredits(value: string) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize,
    };

    if (value === '') {
      this.params = this.params.delete('search_key');
      this.handleCreditPageSize(data);
    } else {
      this.params = this.params.set(`search_key`, value);
      this.params = this.params.set('page', this.pageNumber);
      this.params = this.params.set('per_page', this.pageSize);
      this.checkSearchVal(this.params);
    }
  }

  getFilterAction() {
    if (
      this.filterField.get('name')?.value !== '' ||
      this.filterField.get('amount_from')?.value !== '' ||
      this.filterField.get('amount_to')?.value !== '' ||
      this.filterField.get('date_from')?.value !== '' ||
      this.filterField.get('date_to')?.value.name !== '' ||
      this.filterField.get('type')?.value.name !== '' ||
      this.filterField.get('status')?.value?.id !== '' ||
      this.filterField.get('responsibility_type')?.value?.id !== ''
    ) {
      this.params = this.params.set('page', this.pageNumber);
      this.params = this.params.set('per_page', this.pageSize);
      this.params = this.params.set(
        `filters[name]`,
        this.filterField.get('name')?.value
      );
      this.params = this.params.set(
        `filters[amount_from]`,
        this.filterField.get('amount_from')?.value
      );
      this.params = this.params.set(
        `filters[amount_to]`,
        this.filterField.get('amount_to')?.value
      );
      this.params = this.params.set(
        `filters[date_from]`,
        this.datePipe.transform(
          this.filterField.get('date_from')?.value,
          'dd-MM-YYYY'
        )
          ? this.datePipe.transform(
              this.filterField.get('date_from')?.value,
              'dd-MM-YYYY'
            )
          : ''
      );
      this.params = this.params.set(
        `filters[date_to]`,
        this.datePipe.transform(
          this.filterField.get('date_to')?.value,
          'dd-MM-YYYY'
        )
          ? this.datePipe.transform(
              this.filterField.get('date_to')?.value,
              'dd-MM-YYYY'
            )
          : ''
      );
      this.params = this.params.set(
        `filters[type]`,
        this.filterField.get('type')?.value?.id
          ? this.filterField.get('type')?.value?.id
          : ''
      );
      this.params = this.params.set(
        `filters[status]`,
        this.filterField.get('status')?.value?.id
          ? this.filterField.get('status')?.value?.id
          : ''
      );
      this.params = this.params.set(
        `filters[responsibility_type]`,
        this.filterField.get('responsibility_type')?.value?.id
          ? this.filterField.get('responsibility_type')?.value?.id
          : ''
      );

      this.loadingIndicator = true;
      this.handleCreditPageSize(this.params);
      //     this.data$ = this._CreditStoreService.getFilterColumn(this.paginationParams).pipe(
      //   map((credits) => {
      //     this.length = credits.meta.total;
      //     this.page = credits.meta.last_page;
      //     this.checkStatus = false;
      //     return credits?.data?.map((credit: any) => {
      //       console.log('credit',credit);

      //       this.checkStatus =
      //         credit?.validation_status?.name === 'NEW' ? true : false;
      //       return {
      //         id: credit?.id,
      //         creditType: credit?.type?.name,
      //         creditName: credit?.name,
      //         totalAmount: credit?.amount,
      //         validation_status: credit?.validation_status?.name,
      //         customer: credit?.customer_type?.name
      //           ? credit?.customer_type?.name
      //           : '--',
      //         responsibility: credit?.responsibility_type.name,
      //         Status: credit?.validation_status?.name,
      //         date:
      //           credit.type.name === 'COMPENSATE'
      //             ? `From ${this.datePipe.transform(
      //                 credit?.date_from,
      //                 'd  MMM'
      //               )} to ${this.datePipe.transform(credit?.date_to, 'd  MMM')}`
      //             : `--`,
      //         checkStatus: credit?.validation_status?.name,
      //         backGroundColor:
      //           credit.validation_status?.id === 1
      //             ? '#FEEFD0'
      //             : credit.validation_status?.id === 2
      //             ? '#E5F6F4'
      //             : credit.validation_status?.id === 4
      //             ? '#EFEAF1'
      //             : credit.validation_status?.id === 3
      //             ? '#FBE8EE'
      //             : '',
      //         color:
      //           credit.validation_status?.id === 1
      //             ? '#0E1740'
      //             : credit.validation_status?.id === 2
      //             ? '#00A599'
      //             : credit.validation_status?.id === 4
      //             ? '#5F2D79'
      //             : credit.validation_status?.id === 3
      //             ? '#D92059'
      //             : '',
      //       };
      //     });
      //   }),
      //   finalize(() => {this.loadingIndicator = false
      //     this.paginationParams = this.paginationParams.delete('filters[name]')

      //   })

      // );
    } else {
      this.data$ = this.getListCredit();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.paginationParams = this.paginationParams.delete(`filters[name]`);
    this.paginationParams =
      this.paginationParams.delete(`filters[amount_from]`);
    this.paginationParams = this.paginationParams.delete(`filters[amount_to]`);
    this.paginationParams = this.paginationParams.delete(`filters[date_from]`);
    this.paginationParams = this.paginationParams.delete(`filters[date_to]`);
    this.paginationParams = this.paginationParams.delete(`filters[type]`);
    this.paginationParams = this.paginationParams.delete(`filters[status]`);
    this.paginationParams = this.paginationParams.delete(
      `filters[responsibility_type]`
    );
    this.data$ = this.getListCredit();
  }

  showCreateModal() {
    this.Router.navigate(['/Dashboard/credit/create-credit']);
    sessionStorage.removeItem('storeCreditID');
  }
  // download export
  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  // Export
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
        .exportBulk(EmptyArr, 'admin/store-credits/export')
        .subscribe((data: any) => {
          // let dataPage = {
          //   page: this.pageNumber,
          //   size: this.pageSize,
          // };
          // this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
          this.download(data, data.type);
        });
    } else {
      this._exportService
        .exportBulk(SelectedIds, 'admin/store-credits/export')
        .subscribe((data: any) => {
          this.download(data, data.type);
          // this.selectedItems = [];
          // let dataPage = {
          //   page: this.pageNumber,
          //   size: this.pageSize,
          // };
          // this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
        });
    }
  }

  // get list orders
  getListCredit(value:any={page:1,per_page:50}) {
    this.loadingIndicator = true;
    // console.log(value);

    this.params = this.params.set('page', value.page);
    this.params = this.params.set('per_page', value.per_page);

    return this._CreditStoreService.get(this.params).pipe(
      map((credits) => {
        this.length = credits.meta.total;
        this.checkStatus = false;
        console.log(credits);

        return credits?.data?.map((credit: any) => {
          this.checkStatus =
            credit?.validation_status?.name === 'NEW' ? true : false
          return {
            id: credit?.id,
            creditType: credit?.type?.name,
            orderId: credit?.order?.serial_number ?credit?.order?.serial_number:'--',
            status:credit?.type?.name === 'COMPENSATE' ? '--': credit?.order?.status?.label,
            creditName: credit?.name,
            totalAmount: credit?.amount,
            validation_status:credit?.type?.name === 'COMPENSATE' ? '--' :credit?.validation_status?.name  ,
            customer: credit?.order?.client?.first_name
            ? credit?.order?.client?.first_name
            : credit?.customer_type?.name,

            responsibility: credit?.responsibility_type?.name,
            Status: credit?.validation_status?.name ,
            date:
              credit.type.name === 'COMPENSATE'
                ? `From ${this.datePipe.transform(
                    credit?.date_from,
                    'd  MMM'
                  )} to ${this.datePipe.transform(credit?.date_to, 'd  MMM')}`
                :this.datePipe.transform(credit?.created_at , 'E  d  MMM  h:mm')
                ,
            checkStatus: credit?.validation_status?.name,
            backGroundColor:
              credit.validation_status?.id === 1
                ? '#FEEFD0'
                : credit.validation_status?.id === 2
                ? '#E5F6F4'
                : credit.validation_status?.id === 4
                ? '#EFEAF1'
                : credit.validation_status?.id === 3
                ? '#FBE8EE'
                : '',
            color:
              credit.validation_status?.id === 1
                ? '#0E1740'
                : credit.validation_status?.id === 2
                ? '#00A599'
                : credit.validation_status?.id === 4
                ? '#5F2D79'
                : credit.validation_status?.id === 3
                ? '#D92059'
                : '',
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }

  // getpagination(value: any) {
  //   this.dataPage = { page: value.page, size: value.size };
  // }
  //  handle page size of shipping
  dataPage: any;

  handleCreditPageSize(value: any) {

    this.data$=this.getListCredit({page:value.page ,per_page:50});
  }

  EditHandler(data: any) {
    this.Router.navigate(['Dashboard/credit/edit-credit', data.id]);
  }
  deleteHandler(data: any) {
    this.confirmationService.confirm({
      message: 'do you want to delete this Store Credit ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._CreditStoreService
          .deleteStoreCredit(data.id)
          .subscribe((data: any) => {
            let dataPage = {
              page: this.pageNumber,
              size: this.pageSize,
            };
            this.handleCreditPageSize(dataPage);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'this Store Credit  is Deleted successfully',
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
  reSonIiiid: number = 0;
  // change Status to table
  changeStatus(value: any) {
    this.creditId = value.productId;
    if (value.statusId !== 3) {
      this.loadingIndicator = true;
      let statusObject = {
        validation_status: value.statusId,
      };
      this._CreditStoreService
        .changeStatus(value.productId, statusObject)
        .pipe(finalize(() => (this.loadingIndicator = false)))
        .subscribe((res: any) => {
          this.data$ = this.getListCredit();
        });
    } else {
      this.display = true;
    }
  }
  // Save Rejections
  submitRejection() {
    this.loadingIndicator = true;
    let ReasonsIds: number;
    ReasonsIds = this.reSonIiiid;
    let statusObject = {
      validation_status: 3,
      reason_id: ReasonsIds,
      // product_note: this.comment,
    };
    this._CreditStoreService
      .changeStatus(this.creditId, statusObject)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((res: any) => {
        this.data$ = this.getListCredit();
        this.display = false;
        this.reasons = this.reasons.map((reason) => {
          return {
            description_ar: reason.description_ar,
            description_en: reason.description_en,
            id: reason.id,
          };
        });
      });
  }
  getReasonId(id: number) {
    this.reSonIiiid = id;
  }

  cancel() {
    this.display = false;
  }

  ngOnInit(): void {
    this._CreditStoreService.getReasonsForReject().subscribe((reason) => {
      this.reasons = reason.data.map((value: any) => {
        return {
          description_ar: value.description_ar,
          description_en: value.description_en,
          id: value.id,
          isSelected: false,
        };
      });
    });
  }
}
