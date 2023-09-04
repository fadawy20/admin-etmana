import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { finalize, map } from 'rxjs';
import { BrandsService } from 'src/app/Services/brands.service';
import { ExportsService } from 'src/app/Services/exports.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';

export enum controlKeys {
  title_ar = 'title_ar',
  title_en = 'title_en',
  //slug = 'slug',
  is_active = 'is_active',
  is_featured = 'is_featured',
  logo = 'logo',
}

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit {
  display: boolean = false;
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  data$: any;
  length: number = 0;
  page: number = 0;
  paginationParams: any;
  editModeOn: boolean = false;
  brandForm: FormGroup;
  submitted: boolean = false;
  btnLoader: boolean = false;
  brandId: number = 0;
  showDeletDialog: boolean = false;
  msgs: Message[] = [];
  pageSize?: number = 50;
  pageNumber?: number;
  searchParams: any;
  timer: any;
  @ViewChild('table', { static: false })
  table!: any;
  editImageUrl: string = '';
  imageId: any;
  imageUrl: string = '';
  viewImage: boolean = false;
  selectedItems: any[] = [];
  imagePath1: any;
  imagePath: any;
  checkStatusFilter: boolean = false;
  allColumnFilter: any[] = [];
  searchValue!: string;
  showFilterField!: boolean;
  visibility: any[] = [];
  filterOfNames: any[] = [['title_ar', 'title_en', 'slug', 'is_active']];
  filterField!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _BrandsService: BrandsService,
    private datePipe: DatePipe,
    private _UploadImageService: UploadImageService,
    private _exportService: ExportsService
  ) {
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'title_ar', header: 'Arabic' },
      { field: 'title_en', header: 'English' },
      // { field: 'status', header: 'Status' },
    ];
    this.visibility = [
      { value: 1, name: 'Active' },
      { value: 0, name: 'In Active' },
    ];
    this.paginationParams = new HttpParams();
    this.searchParams = new HttpParams();
    this.data$ = this.getAllBrands();
    // console.log('data$', this.data$);


    this.brandForm = this.fb.group({
      [controlKeys.title_ar]: ['', [Validators.required]],
      [controlKeys.title_en]: ['', [Validators.required]],
      [controlKeys.is_active]: ['', [Validators.required]],
      [controlKeys.is_featured]: ['', [Validators.required]],
      [controlKeys.logo]: ['', [Validators.required]],
    });
    this.filterField = this.fb.group({
      ['title_ar']: [''],
      ['title_en']: [''],
      ['is_active']: [false],
    });
  }

  showFilterFieldFn(value: boolean) {
    this.showFilterField = value;
  }
  resetForm() {
    this.filterField.reset();
  }
  checkSearchVal(value: string) {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set(`page`, this.pageNumber);
    this.paginationParams = this.paginationParams.set(
      `per_page`,
      this.pageSize
    );

    this.data$ = this._BrandsService.getBrandsBySearch(value).pipe(
      map((brands) => {
        this.length = brands.meta.total;
        this.page = brands.meta.last_page;
        return brands?.data?.map((brand: any) => {
          this.editImageUrl = brand?.logo;
          return {
            title_ar: brand.title_ar,
            title_en: brand.title_en,
            is_featured: brand.is_featured,
            id: brand.id,
            status: brand.is_active,
            cover: brand?.logo,
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
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
      this.paginationParams = this.paginationParams.set(`search_key`, value);
      this.checkSearchVal(this.paginationParams);
    }
  }

  getFilterAction() {
    if (
      this.filterField.get('title_ar')?.value !== '' ||
      this.filterField.get('title_en')?.value !== '' ||
      this.filterField.get('is_active')?.value !== ''
    ) {
      this.paginationParams = this.paginationParams.set(
        `page`,
        this.pageNumber
      );
      this.paginationParams = this.paginationParams.set(
        `per_page`,
        this.pageSize
      );
      this.paginationParams = this.paginationParams.set(
        `filters[title_ar]`,
        this.filterField.get('title_ar')?.value
      );
      this.paginationParams = this.paginationParams.set(
        `filters[title_en]`,
        this.filterField.get('title_en')?.value
      );
      this.paginationParams = this.paginationParams.set(
        `filters[is_active]`,
        this.filterField.get('is_active')?.value?.name === 'Active'
          ? 1
          : this.filterField.get('is_active')?.value?.name === 'In Active'
            ? 0
            : ''
      );

      this.loadingIndicator = true;
      this.handlePageSize(this.paginationParams);
    } else {
      this.data$ = this.getAllBrands();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.paginationParams = this.paginationParams.delete(`filters[title_ar]`);
    this.paginationParams = this.paginationParams.delete(`filters[title_en]`);
    this.paginationParams = this.paginationParams.delete(`filters[is_active]`);
    this.data$ = this.getAllBrands();
  }

  ngOnInit(): void {
    this.brandForm.get(controlKeys.is_active)?.setValue(true);
  }

  // get all brands
  getAllBrands() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    return this._BrandsService.get(this.paginationParams).pipe(
      map((brands) => {
        this.length = brands.meta.total;
        this.page = brands.meta.last_page;
        return brands?.data?.map((brand: any) => {
          this.editImageUrl = brand?.logo;
          // console.log('brands', brands);

          return {
            title_ar: brand.title_ar,
            title_en: brand.title_en,
            is_featured: brand.is_featured,
            id: brand.id,
            status: brand.is_active,
            cover: brand?.logo,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  // start CRUD operations
  openCreateDialog(flag: boolean) {
    this.display = flag;
    this.editModeOn = false;
    this.brandForm.reset();
    this.submitted = false;
    this.brandForm.get(controlKeys.is_active)?.setValue(true);
    this.brandForm.get(controlKeys.is_featured)?.setValue(true);
    this.brandForm.get(controlKeys.logo)?.setValidators([Validators.required]);
    this.brandForm.get(controlKeys.logo)?.updateValueAndValidity();
    this.viewImage = false;
  }

  uploadIamge(event: any) {
    const file: File = event.target.files[0];
    if (event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', file);
      this._UploadImageService.uploadImage(formData).subscribe((data: any) => {
        formData.delete('file');
        const reader1 = new FileReader();
        reader1.readAsDataURL(file);
        reader1.onload = (_event) => {
          this.imagePath = reader1.result;
          this.imagePath1 = event.target.value.slice(0, 28);
          this.viewImage = true;
        };
        this.imageId = data.id;
      });
    }
  }

  editImage() {
    this.viewImage = false;
  }

  submit() {
    this.btnLoader = true;
    if (!this.editModeOn) {
      this.create();
    } else {
      this.edit();
    }
  }

  create() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let createdData = {
        title_ar: this.brandForm.controls[controlKeys.title_ar].value,
        title_en: this.brandForm.controls[controlKeys.title_en].value,
        // slug: this.brandForm.controls[controlKeys.slug].value,
        logo: this.imageId,
        is_active: this.brandForm.controls[controlKeys.is_active]?.value,
      };
      this._BrandsService
        .create(createdData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
            this.imageId = null;
          })
        )
        .subscribe((data) => {
          this.data$ = this.getAllBrands();
          this.table.reset(event);
          // this.reset()
          this.display = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Brand is created successfully',
          });
        });
    }
  }

  edit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let createdData = {
        title_ar: this.brandForm.controls[controlKeys.title_ar].value,
        title_en: this.brandForm.controls[controlKeys.title_en].value,
        // slug: this.brandForm.controls[controlKeys.slug].value,
        logo: this.imageId,
        is_active: this.brandForm.controls[controlKeys.is_active]?.value,
        is_featured: this.brandForm.controls[controlKeys.is_featured]?.value,
      };
      this._BrandsService
        .update(this.brandId, createdData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
            this.imageId = null;
          })
        )
        .subscribe((data) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.display = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Brand is Updated successfully',
          });
        });
    }
  }

  EditHandler(data: any) {
    this.brandId = data.id;
    this.submitted = false;
    this.viewImage = true;
    this.editModeOn = true;
    this.display = true;
    this.imagePath1 = data.cover.slice(0, 30);
    this.imagePath = data.cover;
    // this.editImageUrl=this.imagePath1;
    this.brandForm.get(controlKeys.title_ar)?.setValue(data.title_ar);
    this.brandForm.get(controlKeys.title_en)?.setValue(data.title_en);
    this.brandForm.get(controlKeys.is_active)?.setValue(data.status);
    this.brandForm.get(controlKeys.is_featured)?.setValue(data.is_featured);

    if (data.cover === '') {
      this.viewImage = false;
    }
    if (this.brandForm.get(controlKeys.logo)?.errors?.['required']) {
      this.brandForm.get(controlKeys.logo)?.clearValidators();
      this.brandForm.get(controlKeys.logo)?.updateValueAndValidity();
    }
  }

  handleBulkDeleteBrand(value: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'Do you want to delete this brand ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let brandIDs = value.map((brand: any) => {
          return brand.id;
        });

        let deletedids = {
          ids: brandIDs,
        };

        this._BrandsService.RemoveBulk(deletedids).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.selectedItems = [];
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'These brands are deleted successfully',
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

  handleDeleteBrand(value: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this brand ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._BrandsService.delete(value.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'This brand is deleted successfully',
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
        .exportGlobal(EmptyArr, 'admin/brands/export', this.paginationParams)
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
        .exportGlobal(SelectedIds, 'admin/brands/export', this.paginationParams)
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
    this.data$ = this._BrandsService.paginate(this.paginationParams).pipe(
      map((brands) => {
        this.length = brands.meta.total;
        this.page = brands.meta.last_page;
        return brands?.data?.map((brand: any) => {
          return {
            title_ar: brand.title_ar,
            title_en: brand.title_en,
            id: brand.id,
            is_featured: brand.is_featured,
            status: brand.is_active,
            cover: brand?.logo,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  cancel() {
    this.display = false;
    this.brandForm.reset();
    this.imagePath1 = '';
    this.imagePath = '';
  }

  reset() {
    let data = {
      page: 1,
      size: this.pageSize,
    };
    this.handlePageSize(data);
    this.table.reset(event);
  }
}
