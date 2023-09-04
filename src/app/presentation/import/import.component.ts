import { DatePipe } from '@angular/common';
import { HttpEventType, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { Subscription, finalize, map, throwError } from 'rxjs';
import { AttributesService } from 'src/app/Services/attributes.service';
import { DetailsImportedService } from 'src/app/Services/details-imported.service';
import { ExportsService } from 'src/app/Services/exports.service';
import { ImportsService } from 'src/app/Services/imports.service';
import { ProductSetsService } from 'src/app/Services/product-sets.service';
import { UploadService } from 'src/app/Services/upload.service';
export enum controlKeys {
  title_en = 'title_en',
}
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit, OnDestroy {
  display: boolean = false;
  displayUpload: boolean = false;
  displayExport: boolean = false;
  editModeOn: boolean = false;
  submitted: boolean = false;
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  data$: any;
  length: number = 0;
  page: number = 0;
  paginationParams: any;
  btnLoader: boolean = false;
  table!: any;
  importForm!: FormGroup;
  next: string = '';
  pageNumber?: number;
  pageSize?: number;
  current: number = 1;
  asyncData: any;
  importSetData: any[] = [];
  ImportsForm!: FormGroup;
  fileUploadForm!: FormGroup;
  attrId: number = 0;
  selectedMenu: any = '';
  nameOfFile: string = '';
  isDisabledbtn: boolean = true;
  @ViewChild('UploadFileInput', { static: false })
  uploadedFileInput!: ElementRef;
  selectedItems: any[] = [];
  unsubscribe: Subscription[] = [];

  constructor(
    private _ProductSetsService: ProductSetsService,
    private _MessageService: MessageService,
    private fb: FormBuilder,
    private _Router: Router,
    private _importedDetailsService: DetailsImportedService,
    private _ConfirmationService: ConfirmationService,
    private _importsService: ImportsService,
    private _uploadService: UploadService,
    private _exportService: ExportsService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.tableHeader = [
      { field: 'id', header: 'ID' },
      { field: 'imported_at', header: 'Imported Name' },
      { field: 'name', header: 'Imported By' },
      { field: 'status', header: 'Status' },
      { field: 'product_count', header: 'Product Count' },
      { field: 'error_count', header: 'Error Count' },
      { field: 'Date', header: 'Date' },
    ];

    this.paginationParams = new HttpParams();
    this.data$ = this.getAllImports();
    this.getAttributeSet(1);
  }

  getAllImports() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    return this._importsService.get(this.paginationParams).pipe(
      map((imports) => {
        this.length = imports.meta.total;
        return imports?.data?.map((imports: any) => {
          return {
            id: imports.id,
            name: `${imports?.import_by?.admin?.first_name} ${imports?.import_by?.admin?.last_name}`,
            imported_at: imports.imported_at,
            error_count: imports.error_count,
            status: imports.status.name,
            Date: this.datePipe.transform(
              imports?.created_at,
              'YYYY/MM/dd hh/mm'
            ),
            product_count: imports.product_count,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  handleScrollEvent() {
    this.current++;
    let paginator = {
      page: this.current,
      size: 15,
    };
    this.getAttributeSet(this.current);
  }

  getAttributeSet(page: number) {
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 15);
    let sub = this._ProductSetsService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((attr) => {
        this.length = attr.meta.total;
        this.page = attr.meta.last_page;
        this.next = attr.links.next;
        this.asyncData = attr.data.map((imports: any) => {
          return {
            title_en: imports.title_en,
            id: imports.id,
          };
        });
        this.importSetData = [...this.importSetData, ...this.asyncData];
      });
    this.unsubscribe.push(sub);
  }

  handlePageSize(value: any) {
    this.pageSize = value.size;
    this.pageNumber = value.page;
    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize
    );
    this.loadingIndicator = true;
    this.data$ = this._importsService.get(this.paginationParams).pipe(
      map((imports) => {
        this.length = imports.meta.total;
        return imports?.data?.map((imports: any) => {
          return {
            id: imports.id,
            name: imports.name,
            imported_at: imports.imported_at,
            // attribute_set: imports,
            error_count: imports.error_count,
            status: imports.status.name,
            product_count: imports.product_count,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  displayImports(value: any) {
    this._Router.navigate([
      `/Dashboard/import/import-details/${value.data.id}`,
    ]);
  }

  // start crud operations
  showCreateModal(data: any) {
    this.display = true;
    this.editModeOn = false;
    this.submitted = false;
  }

  uploadCreateModal(data: any) {
    this.displayUpload = true;
    this.editModeOn = false;
    this.submitted = false;
  }

  EditHandler(data: any) {}
  DeleteHandler(data: any) {}

  isDisabled: boolean = false;

  getAttributes(value: any) {
    this.attrId = value.value;
    this.isDisabled = true;
    this.showError = false;
  }

  loader: boolean = false;
  showError: boolean = false;
  myFiles: any[] = [];
  onFileSelect(event: any) {
    // THIS  IS FIRST TYPE
  // this._uploadService.upload(1, '').subscribe({
  //   next : ()=> {},
  //   error : ()=> {},
  //   complete : ()=> {}
  // })
  //   // THIS  IS SECOND TYPE
  // this._uploadService.upload(1, '').subscribe(()=> {

  // })



    this.loader = true;
    const formData = new FormData();
    let xlsx = [...event.target.files].find((file: any) =>
      file.name.toLocaleLowerCase().endsWith('.xlsx')
    );
    let zip = [...event.target.files].find((file: any) =>
      file.name.toLocaleLowerCase().endsWith('.zip')
    );
    if (typeof xlsx !== 'undefined' && typeof zip !== 'undefined') {
      formData.append('file', xlsx);
      formData.append('images', zip);
      this._uploadService
        .upload( this.attrId , formData)
        .pipe(
          finalize(() => {
            this.loader = false;
            this.display = false;
            this.displayUpload = false;
          })
        )
        .subscribe((data: any) => {
          if (data.type === HttpEventType.UploadProgress) {
            const percentDone = (100 * data.loaded) / data.total;
            console.log(`File is ${percentDone}% uploaded.`);
          } else if (data.type === HttpEventType.Response) {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'File is uploaded successfully',
            });

            this.data$ = this.getAllImports();
            console.log('File upload complete.');
          }
          this.data$ = this.getAllImports();
          console.log('File upload complete.');
        });
    } else {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid files',
      });
      console.log('File upload faled');

      this.loader = false;
    }
  }

  downloadFileForUpload() {
    this._uploadService.downloadFileone().subscribe((res) => {
      this.download(res, res.type);
    });
  }

  onFileSelectForUplaod(event: any) {
    // this.loader = true;
    // const formData = new FormData();
    // let xlsx = [...event.target.files].find((file: any) =>
    //   file.name.toLocaleLowerCase().endsWith('.xlsx')
    // );
    this.loader = true;
    const formData = new FormData();
    let xlsx = [...event.target.files].find((file: any) =>
      file.name.toLocaleLowerCase().endsWith('.xlsx')
    );
    console.log('xlsx', xlsx);

    let zip = [...event.target.files].find((file: any) =>
      file.name.toLocaleLowerCase().endsWith('.zip')
    );
    // let zip = [...event.target.files].find((file: any) =>
    //   file.name.toLocaleLowerCase().endsWith('.zip')
    // );
    // if (typeof xlsx !== 'undefined' && typeof zip !== 'undefined') {
    if (typeof xlsx !== 'undefined' || typeof zip !== 'undefined') {
      xlsx?formData.append('file', xlsx):'';
      zip?formData.append('images', zip):'';
      this._uploadService
        .uploadFileone(formData)
        .pipe(
          finalize(() => {
            this.loader = false;
            this.display = false;
            this.displayUpload = false;
          })
        )
        .subscribe((data: any) => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File is uploaded successfully',
          });
          this.data$ = this.getAllImports();
          console.log('File upload complete.');

        });
    } else {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid files',
      });
      console.log('File upload faled');
      this.loader = false;
    }
  }

  cancelAction() {
    this.display = false;
    this.displayUpload = false;
    this.nameOfFile = '';
    this.attrId = 0;
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
        .exportBulk(EmptyArr, 'admin/products/import_logs/export')
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
        .exportBulk(SelectedIds, 'admin/products/import_logs/export')
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

  downloadFile() {
    if (this.attrId === 0) {
      this.showError = true;
    } else {
      this.showError = false;
      this._importsService.getData(this.attrId).subscribe((res) => {
        this.download(res, res.type);
      });
    }
  }

  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);

    this.nameOfFile = url.substring(5);
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscribe.forEach((e) => {
      e.unsubscribe();
    });
  }
}
