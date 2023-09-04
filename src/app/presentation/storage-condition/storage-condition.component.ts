import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { finalize, map } from 'rxjs';
import { ExportsService } from 'src/app/Services/exports.service';
import { StorageConditionService } from 'src/app/Services/storage-condition.service';

export enum controlKeys {
  title_ar = 'title_ar',
  title_en = 'title_en',
}
@Component({
  selector: 'app-storage-condition',
  templateUrl: './storage-condition.component.html',
  styleUrls: ['./storage-condition.component.scss'],
})
export class StorageConditionComponent implements OnInit {
  display: boolean = false;
  filterName: string = '';
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  data$: any;
  attributesData: any[] = [];
  length: number = 0;
  page: number = 0;
  paginationParams: any;
  editModeOn: boolean = false;
  StorageForm!: FormGroup;
  submitted: boolean = false;
  btnLoader: boolean = false;
  storageSetId: number = 0;
  showDeletDialog: boolean = false;
  msgs: Message[] = [];
  pageSize?: number;
  pageNumber?: number;
  searchParams: any;
  timer: any;
  @ViewChild('table', { static: false })
  table!: any;
  next: any;
  asyncData: any[] = [];
  current: number = 1;
  selectedItems: any[] = [];
  showFilterField!:boolean;
  filterOfNames:any[]=[
    'title_ar',
    'title_en'
  ]
  filterField!:FormGroup

  constructor(
    private _StorageConditionServices: StorageConditionService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _exportService:ExportsService
  ) {
    this.paginationParams = new HttpParams();
    this.tableHeader = [
      { field: 'title_ar', header: 'Arabic' },
      { field: 'title_en', header: 'English' },
    ];
    this.filterField =this.fb.group({
      ['title_ar']:[''],
      ['title_en']:[''],
    })
    this.data$ = this.getAllStorage();
    this.StorageForm = this.fb.group({
      [controlKeys.title_ar]: ['', [Validators.required]],
      [controlKeys.title_en]: ['', [Validators.required]],
    });
  }
  getAllStorage() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 5);
    this.pageNumber = 1;
    this.pageSize = 5;
    return this._StorageConditionServices
      .get(this.paginationParams)
      .pipe(
        map((StorageContitions) => {
          this.length = StorageContitions.meta.total;
          return StorageContitions?.data?.map((StorageContition: any) => {
            return {
              id: StorageContition.id,
              title_ar: StorageContition.title_ar,
              title_en: StorageContition.title_en,
            };
          });
        }),
        finalize(() => {
          this.loadingIndicator = false;
        })
      );
  }

  showFilterFieldFn(value:boolean)
  {
    this.showFilterField=value
  }
  resetForm()
  {
    this.filterField.reset()
  }
  checkSearchVal(value: string)
  {
    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
  this.paginationParams = this.paginationParams.set('per_page', this.pageSize);
  this.paginationParams = this.paginationParams.set(`search_key`, value);

  this.loadingIndicator = true
  this.data$ = this._StorageConditionServices
  .getStorageBySearch(this.paginationParams)
  .pipe(
    map((StorageContitions) => {
      this.length = StorageContitions.meta.total;
      return StorageContitions?.data?.map((StorageContition: any) => {
        return {
          id: StorageContition.id,
          title_ar: StorageContition.title_ar,
          title_en: StorageContition.title_en,
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

  getFilterAction()
  {
    if (this.filterField.get('title_ar')?.value !== ''||this.filterField.get('title_en')?.value !== ''
    ) {
      this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set('per_page', this.pageSize);
      this.paginationParams = this.paginationParams.set(`filters[title_ar]`,this.filterField.get('title_ar')?.value?this.filterField.get('title_ar')?.value:'')
      this.paginationParams = this.paginationParams.set(`filters[title_en]`,this.filterField.get('title_en')?.value?this.filterField.get('title_en')?.value:'')
      this.paginationHandler(this.paginationParams);
    }
    else
    {
      this.data$ = this.getAllStorage();
    }
  }
  resetFormColumn()
  {
    this.filterField.reset()
    this.data$ = this.getAllStorage();
  }

  paginationHandler(value: any) {
    this.loadingIndicator = true;
    this.pageSize = value.size;
    this.pageNumber = value.page;
    this.paginationParams = this.paginationParams.set('page', this.pageNumber?this.pageNumber:1);
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize?this.pageSize:5
    );
    this.data$ = this._StorageConditionServices
      .paginate(this.paginationParams)
      .pipe(
        map((StorageContitions) => {
          this.length = StorageContitions.meta.total;
          return StorageContitions?.data?.map((StorageContition: any) => {
            return {
              id: StorageContition.id,
              title_ar: StorageContition.title_ar,
              title_en: StorageContition.title_en,
            };
          });
        }),
        finalize(() => {
          this.loadingIndicator = false;
        })
      );
  }

  // start crud operations
  openCreateDialog($event: any) {
    this.display = true;
    this.editModeOn = false;
    this.StorageForm.reset();
    this.submitted = false;
  }

  submit() {
    this.btnLoader = true;
    this.submitted = true;
    if (this.editModeOn) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    if (this.StorageForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
    } else {
      let StorageConditionObj = {
        title_ar: this.StorageForm.get(controlKeys.title_ar)?.value,
        title_en: this.StorageForm.get(controlKeys.title_en)?.value,
      };
      this._StorageConditionServices
        .create(StorageConditionObj)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data) => {
          this.display = false;
          this.data$ = this.getAllStorage();
          this.table.reset(event);
          this.StorageForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Storage Condition is created successfully',
          });
        });
    }
  }

  EditHandler(data: any) {
    this.loadingIndicator = false;
    this.display = true;
    this.editModeOn = true;
    this.storageSetId = data.id;
    this.StorageForm.get(controlKeys.title_ar)?.setValue(data.title_ar);
    this.StorageForm.get(controlKeys.title_en)?.setValue(data.title_en);
  }

  update() {
    if (this.StorageForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
    } else {
      let StorageConditionObj = {
        title_ar: this.StorageForm.get(controlKeys.title_ar)?.value,
        title_en: this.StorageForm.get(controlKeys.title_en)?.value,
      };
      this._StorageConditionServices
        .update(this.storageSetId, StorageConditionObj)
        .pipe(
          finalize(() => {
            this.btnLoader = false;
            this.loadingIndicator = false;
          })
        )
        .subscribe((data: any) => {
          this.display = false;
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.paginationHandler(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Storage Condition is Updated successfully',
          });
        });
    }
  }
  deleteHandler(data: any) {
    this.confirmationService.confirm({
      message: 'do you want to delete this Storage Condition ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._StorageConditionServices
          .delete(data.id)
          .subscribe((data: any) => {
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
        .exportBulk(EmptyArr, 'admin/storage-conditions/export')
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
        .exportBulk(SelectedIds, 'admin/brands/export')
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

  cancel() {
    this.display = false;
    this.StorageForm.reset();
  }
  ngOnInit(): void {}
}
