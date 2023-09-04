import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize, map, Observable, subscribeOn } from 'rxjs';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  PrimeNGConfig,
  Message,
} from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { SaveFilesService } from 'src/app/Services/save-files/save-files.service';
import { ProductSetsService } from 'src/app/Services/product-sets.service';
import { AttributesService } from 'src/app/Services/attributes.service';
import { ExportsService } from 'src/app/Services/exports.service';

export enum controlKeys {
  title_ar = 'title_ar',
  title_en = 'title_en',
  attributes = 'attributes',
}

@Component({
  selector: 'app-product-sets',
  templateUrl: './product-sets.component.html',
  styleUrls: ['./product-sets.component.scss']
})
export class ProductSetsComponent implements OnInit {

  display: boolean = false
  filterName: string = ''
  loadingIndicator: boolean = false
  tableHeader: any[] = [];
  data$: any
  attributesData: any[] = []
  length: number = 0
  page: number = 0
  paginationParams: any;
  editModeOn: boolean = false
  ProductSetForm: FormGroup;
  submitted: boolean = false
  btnLoader: boolean = false
  productSetId: number = 0
  showDeletDialog: boolean = false
  msgs: Message[] = [];
  pageSize?: number
  pageNumber?: number
  searchParams: any
  timer: any
  @ViewChild('table', { static: false })
  table!: any;
  next: any
  asyncData: any[] = []
  current: number = 1
  selectedItems: any[] = []
  allColumnFilter:any[] = [];
  searchValue!:string
  showFilterField!:boolean;
  filterOfNames:any[]=[
    'title_ar',
    'title_en',
  ]
  filterField!:FormGroup

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _ProductSetsService: ProductSetsService,
    private _exportService:ExportsService
  ) {
    this.tableHeader = [
      { field: 'title_ar', header: "Arabic" },
      { field: 'title_en', header: 'English' },
    ];
    this.filterField =this.fb.group({
      ['title_ar']:[''],
      ['title_en']:[''],
    })
    this.paginationParams = new HttpParams();
    this.searchParams = new HttpParams()
    this.data$ = this.getAllSets()
    this.ProductSetForm = this.fb.group({
      [controlKeys.title_ar]: ['', [Validators.required]],
      [controlKeys.title_en]: ['', [Validators.required]],
    });
  }



  // get all products sets
  getAllSets() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this.pageNumber = 1;
    this.pageSize = 50;

    return this._ProductSetsService.get(this.paginationParams).pipe(
      map((productSets) => {
        this.length = productSets.meta.total;
        this.page = productSets.meta.last_page
        return productSets?.data?.map((ProductSet: any) => {
          return {
            title_ar: ProductSet.title_ar,
            title_en: ProductSet.title_en,
            id: ProductSet.id
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
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
  checkSearchVal(value: any)
  {

    this.paginationParams = this.paginationParams.set('page', this.pageNumber);

    this.paginationParams = this.paginationParams.set('per_page', this.pageSize);
    this.paginationParams = this.paginationParams.set(`search_key`, value);
    this.loadingIndicator = true
    this.data$ = this._ProductSetsService.getProductsBySearch(this.paginationParams).pipe(
      map((productSets) => {
        this.length = productSets.meta.total;
        this.page = productSets.meta.last_page
        return productSets?.data?.map((ProductSet: any) => {
          return {
            title_ar: ProductSet.title_ar,
            title_en: ProductSet.title_en,
            id: ProductSet.id
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );


  }

  searchInCredits(value: string) {
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

  getFilterAction()
  {
    if (this.filterField.get('title_ar')?.value !== ''||this.filterField.get('title_en')?.value !== ''
    ) {
      this.paginationParams = this.paginationParams.set('page', this.pageNumber );
      this.paginationParams = this.paginationParams.set('per_page', this.pageSize);
      this.paginationParams = this.paginationParams.set(`filters[title_ar]`,this.filterField.get('title_ar')?.value)
      this.paginationParams = this.paginationParams.set(`filters[title_en]`,this.filterField.get('title_en')?.value)
      this.handlePageSize(this.paginationParams)
    }
    else
    {
      this.data$ = this.getAllSets()
    }
  }
  resetFormColumn()
  {
    this.filterField.reset()
    this.data$ = this.getAllSets()
  }

  // start crud operations
  openCreateDialog(flag: boolean) {
    this.display = true
    this.editModeOn = false
    this.ProductSetForm.reset()
    this.submitted = false
  }

  submit() {
    this.submitted = true
    this.btnLoader = true
    if (this.editModeOn) {
      this.edit()
    } else {
      this.create()
    }
  }

  create() {
    if (this.ProductSetForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false
      return;
    } else {
      let attributes = this.ProductSetForm.get(controlKeys.attributes)?.value.map((atrribute: any) => {
        return {
          id: atrribute.id,
          is_required: false
        }
      })
      let createdData = {
        attributes: attributes,
        title_ar: this.ProductSetForm.get(controlKeys.title_ar)?.value,
        title_en: this.ProductSetForm.get(controlKeys.title_en)?.value,
      }
      this._ProductSetsService.create(createdData)
        .pipe(
          finalize(() => {
            this.submitted = false
            this.btnLoader = false
          })
        ).subscribe(data => {
          this.display = false
          this.data$ = this.getAllSets()
          this.reset()
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Product Set is created successfully',
          });
        })
    }
  }

  edit() {
    this.submitted = true
    if (this.ProductSetForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false
      return;
    } else {
      let attributes = this.ProductSetForm.get(controlKeys.attributes)?.value.map((atrribute: any) => {
        return {
          id: atrribute.id,
          is_required: false
        }
      })
      let updatedData = {
        attributes: attributes,
        title_ar: this.ProductSetForm.get(controlKeys.title_ar)?.value,
        title_en: this.ProductSetForm.get(controlKeys.title_en)?.value,
      }
      this._ProductSetsService.update(this.productSetId, updatedData)
        .pipe(
          finalize(() => {
            this.submitted = false
            this.btnLoader = false
          })
        ).subscribe(data => {
          this.display = false
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize
          }
          this.handlePageSize(dataPage)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Product Set is Updated successfully',
          });
        })
    }
  }

  EditHandler(data: any) {
    this.editModeOn = true
    this.display = true
    this.submitted = false
    this.ProductSetForm.get(controlKeys.title_en)?.setValue(data.title_en)
    this.ProductSetForm.get(controlKeys.title_ar)?.setValue(data.title_ar)
    this.current = 1
    this.productSetId = data.id
    // this.attributesData = this.attributesData.filter((attrs: any) => {
    //   return attrs.id !== atrribute.id
    // })

  }
  DeleteHandler(data: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'do you want to delete this Product Set ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._ProductSetsService.delete(data.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize
          }
          this.handlePageSize(dataPage)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Product Set is Deleted successfully'
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

  cancel() {
    this.display = false
  }
  // end crud operations


  handleBulkDeleteAttrSet(value: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'Do you want to delete this Attribute Sets ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        let attrSetIDs = value.map((attrSet: any) => {
          return attrSet.id
        })

        let deletedids = {
          ids: attrSetIDs
        }
        this._ProductSetsService.RemoveBulk(deletedids).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize
          }
          this.selectedItems = []
          this.handlePageSize(dataPage)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'These Attributes are deleted successfully'
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

  handlePageSize(value: any) {
    this.pageSize = value.size
    this.pageNumber = value.page
    this.paginationParams = this.paginationParams.set('page', this.pageNumber?this.pageNumber:1);
    this.paginationParams = this.paginationParams.set('per_page', this.pageSize?this.pageSize:5);
    this.loadingIndicator = true
    this.data$ = this._ProductSetsService.get(this.paginationParams).pipe(
      map((productSets) => {
        this.length = productSets.meta.total;
        this.page = productSets.meta.last_page
        return productSets?.data?.map((ProductSet: any) => {
          return {
            title_ar: ProductSet.title_ar,
            title_en: ProductSet.title_en,
            id: ProductSet.id
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }


  searchInProductSets(event: any) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize
    }
    if (event.target.value === '') {
      this.data$ = this.getAllSets()
      this.searchParams = this.searchParams.delete('search_key');
      this.reset()
    } else {
      this.searchParams = this.searchParams.set(`search_key`, event.target.value);
      this.searchWithParams(this.searchParams)
    }
  }

  searchWithParams(value: any) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.loadingIndicator = true
      this.data$ = this._ProductSetsService.get(value).pipe(
        map((productSets) => {
          this.length = productSets.meta.total;
          this.page = productSets.meta.last_page
          return productSets?.data?.map((ProductSet: any) => {
            return {
              title_ar: ProductSet.title_ar,
              title_en: ProductSet.title_en,
              id: ProductSet.id
            };
          });
        }),
        finalize(() => (this.loadingIndicator = false))
      );
    }, 1000);
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
        .exportBulk(EmptyArr, 'admin/product-sets/export')
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
        .exportBulk(SelectedIds, 'admin/brands/export')
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

  reset() {
    let data = {
      page: 1,
      size: this.pageSize
    }
    this.handlePageSize(data)
    this.table.reset(event)
    this.filterName = ''
  }

  ngOnInit(): void {
  }

}
