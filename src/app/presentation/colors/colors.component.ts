import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { ColorsService } from 'src/app/Services/colors.service';
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

export enum controlKeys {
  name_ar = 'name_ar',
  name_en = 'name_en',
  value = 'value',
}


@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  display: boolean = false
  filterName: string = ''
  loadingIndicator: boolean = false
  tableHeader: any[] = [];
  data$: any
  length: number = 0
  page: number = 0
  paginationParams: any;
  editModeOn: boolean = false
  colorForm: FormGroup;
  submitted: boolean = false
  btnLoader: boolean = false
  colorId: number = 0
  showDeletDialog: boolean = false
  msgs: Message[] = [];
  pageSize?: number
  pageNumber?: number
  searchParams: any
  timer: any
  @ViewChild('table', { static: false })
  table!: any;



  constructor(
    private _ColorsService: ColorsService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private _SaveFilesService: SaveFilesService,
    private confirmationService: ConfirmationService) {
    this.tableHeader = [
      { field: 'name_ar', header: "Arabic" },
      { field: 'name_en', header: 'English' },
      { field: 'value', header: 'Code' },
    ];
    this.paginationParams = new HttpParams();
    this.searchParams = new HttpParams()
    this.data$ = this.getAllColors();
    this.colorForm = this.fb.group({
      [controlKeys.name_ar]: ['', [Validators.required]],
      [controlKeys.name_en]: ['', [Validators.required]],
      [controlKeys.value]: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  // get all colors
  getAllColors() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 10);
    return this._ColorsService.get(this.paginationParams).pipe(
      map((colors) => {
        this.length = colors.meta.total;
        this.page = colors.meta.last_page
        // this.next = colors.links.next
        return colors?.data?.map((color: any) => {
          return {
            name_ar: color.name_ar,
            name_en: color.name_en,
            value: color.value,
            id: color.id
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  // start crud operations
  showCreateModal() {
    this.display = true
    this.editModeOn = false
    this.colorForm.reset()
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
    if (this.colorForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false
      return;
    } else {
      this._ColorsService.create(this.colorForm.value)
        .pipe(
          finalize(() => {
            this.submitted = false
            this.btnLoader = false
          })
        ).subscribe(data => {
          this.display = false
          this.data$ = this.getAllColors()
          this.reset()
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Color is created successfully',
          });
        })
    }
  }

  edit() {
    this.submitted = true
    if (this.colorForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false
      return;
    } else {
      this._ColorsService.update(this.colorId, this.colorForm.value)
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
            detail: 'this Color is Updated successfully',
          });
        })
    }
  }


  EditHandler(data: any) {
    this.editModeOn = true
    this.display = true
    this.submitted = false
    this.colorForm.get(controlKeys.name_en)?.setValue(data.name_en)
    this.colorForm.get(controlKeys.name_ar)?.setValue(data.name_ar)
    this.colorForm.get(controlKeys.value)?.setValue(data.value)
    this.colorId = data.id
  }

  DeleteHandler(data: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'do you want to delete this Color ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._ColorsService.delete(data.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize
          }
          this.handlePageSize(dataPage)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Color is Deleted successfully'
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
    this.colorForm.reset()
  }
  // end crud operations

  handlePageSize(value: any) {
    this.pageSize = value.size
    this.pageNumber = value.page
    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set('per_page', this.pageSize);
    this.loadingIndicator = true
    this.data$ = this._ColorsService.paginate(this.paginationParams).pipe(
      map((colors) => {
        this.length = colors.meta.total;
        this.page = colors.meta.last_page
        return colors?.data?.map((color: any) => {
          return {
            name_ar: color.name_ar,
            name_en: color.name_en,
            value: color.value,
            id: color.id
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }



  searchInColors(event: any) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize
    }
    if (event.target.value === '') {
      this.data$ = this.getAllColors()
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
      this.data$ = this._ColorsService.paginate(value).pipe(
        map((colors) => {
          this.length = colors.meta.total;
          this.page = colors.meta.last_page
          return colors?.data?.map((color: any) => {
            return {
              name_ar: color.name_ar,
              name_en: color.name_en,
              value: color.value,
              id: color.id
            };
          });
        }),
        finalize(() => {
          this.loadingIndicator = false
        })
      );
    }, 1000);
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

}
