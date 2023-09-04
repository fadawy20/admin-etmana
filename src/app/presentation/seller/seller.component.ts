import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map } from 'rxjs';
import { SellerService } from 'src/app/Services/seller.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ExportsService } from 'src/app/Services/exports.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss'],
})
export class SellerComponent implements OnInit {
  display: boolean = false;
  paginationParams: any;
  loadingIndicator: boolean = false;
  length: number = 0;
  page: number = 0;
  editImageUrl: string = '';
  selectedMenu: any = '';
  data$: Observable<any[]>;
  tableHeader: any[] = [];
  pageSize: number = 0;
  pageNumber: number = 0;
  msgs: any[] = [];
  selectedItems: any[] = [];
  showFilterField!: boolean;
  filterOfNames: any[] = ['email'];
  filterField!: FormGroup;
  constructor(
    private Router: Router,
    private _SellServices: SellerService,
    private _Router: Router,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _exportService: ExportsService,
    private fb: FormBuilder
  ) {
    this.paginationParams = new HttpParams();
    this.tableHeader = [
      { field: 'name_en', header: 'Engilsh Name' },
      { field: 'name_ar', header: 'Arabic Name' },
      { field: 'status', header: 'Status' },
      { field: 'date_modified', header: 'Date Modified' },
    ];
    this.filterField = this.fb.group({
      ['email']: [''],
    });
    this.data$ = this.get();
    // console.log(this.get);

  }

  ngOnInit(): void { }
  // Navigate to Create Seller
  CreateSeller() {
    this.Router.navigate(['Dashboard/seller/create-seller']);
  }
  // get all Sellers
  get() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);

    return this._SellServices.get(this.paginationParams).pipe(
      map((Seller) => {
        console.log(Seller, 'This is seller');

        this.length = Seller.meta.total;
        return Seller?.data?.map((seller: any) => {
          // console.log(seller, 'This is seller 2');

          // Seller.date_modified =this.datePipe.transform(Date(),)
          return {
            id: seller.id,
            name_en: seller?.seller_info?.name_en,
            name_ar: seller?.seller_info?.name_ar,
            // commercial_name_en: seller.seller_info.commercial_name_en,
            date_modified: this.datePipe.transform(
              seller.date_modified,
              'E  d  MMM  h:mm'
            ),
            status: seller.is_active,
          };

        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
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
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize
    );
    this.paginationParams = this.paginationParams.set(`search_key`, value);

    this.loadingIndicator = true;
    this.data$ = this._SellServices
      .getSellersBySearch(this.paginationParams)
      .pipe(
        map((Sellers) => {
          this.length = Sellers.meta.total;
          return Sellers?.data?.map((Seller: any) => {
            return {
              id: Seller.id,
              name_en: Seller?.seller_info?.name_en,
              name_ar: Seller?.seller_info?.name_ar,
              status: Seller.is_active === true ? 'Active' : 'In Active',
              date_modified: this.datePipe.transform(
                Seller.date_modified,
                'E  d  MMM  h:mm'
              ),
            };
          });
        }),
        finalize(() => {
          this.loadingIndicator = false;
        })
      );
  }

  search(value: string) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize,
    };

    if (value === '') {
      this.paginationParams = this.paginationParams.delete('search_key');
      this.paginationHandler(data);
    } else {
      this.checkSearchVal(value);
    }
  }

  getFilterAction() {
    if (
      this.filterField.get('title_ar')?.value !== '' ||
      this.filterField.get('title_en')?.value !== '' ||
      this.filterField.get('code')?.value !== '' ||
      this.filterField.get('is_active')?.value !== false
    ) {
      this.paginationParams = this.paginationParams.set(
        'page',
        this.pageNumber
      );
      this.paginationParams = this.paginationParams.set(
        'per_page',
        this.pageSize
      );
      this.paginationParams = this.paginationParams.set(
        `filters[email]`,
        this.filterField.get('email')?.value
          ? this.filterField.get('email')?.value
          : ''
      );
      this.paginationHandler(this.paginationParams);
    } else {
      this.data$ = this.get();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.data$ = this.get();
  }

  // handle pagination
  paginationHandler(value: any) {
    this.loadingIndicator = true;
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
    this.data$ = this._SellServices.paginate(this.paginationParams).pipe(
      map((Sellers) => {
        this.length = Sellers.meta.total;
        return Sellers?.data?.map((Seller: any) => {
          return {
            id: Seller.id,
            name_en: Seller?.seller_info?.name_en,
            name_ar: Seller?.seller_info?.name_ar,
            status: Seller.is_active === true ? 'Active' : 'In Active',
            date_modified: this.datePipe.transform(
              Seller.date_modified,
              'E  d  MMM  h:mm'
            ),
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }
  // navigate to edit seller by id
  EditHandler(data: any) {
    this._Router.navigate(['Dashboard/seller/edit-seller', data.id]);
    console.log(data);

  }
  // delete seller
  deleteHandler(data: any) {
    this.confirmationService.confirm({
      message: 'do you want to delete this Storage Condition ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._SellServices.deleteSeller(data.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.paginationHandler(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Storage Condition is Deleted successfully',
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
  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  //showExportedDialog: boolean = false

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
        .exportGlobal(EmptyArr, 'admin/sellers/export', this.paginationParams)
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
        .exportGlobal(SelectedIds, 'admin/brands/export', this.paginationParams)
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

  changeActiveStatus(value: any) {
    this.loadingIndicator = true;

    let obj = {
      is_active: value.checked,
    };
    this._SellServices
      .toggleSingleStatus(value.id, obj)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((res) => {
        let dataPage = {
          page: this.pageNumber,
          size: this.pageSize,
        };
        this.paginationHandler(dataPage);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Status Changed Successfully',
        });
      });
  }
}
