import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  PrimeNGConfig,
  Message,
} from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { SaveFilesService } from 'src/app/Services/save-files/save-files.service';
import { AttributesService } from 'src/app/Services/attributes.service';
import { ProductSetsService } from 'src/app/Services/product-sets.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';
import { ExportsService } from 'src/app/Services/exports.service';

export enum controlKeys {
  title_ar = 'title_ar',
  title_en = 'title_en',
  value_ar = 'value_ar',
  value_en = 'value_en',
  attribute_sets = 'attribute_sets',
  code = 'code',
  type = 'type',
  is_required = 'is_required',
}

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements OnInit {
  display: boolean = false;
  displayValues: boolean = false;
  filterName: string = '';
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  valuesTableHeader: any[] = [];
  data$: Observable<any>;
  attsValueData$?: Observable<any>;
  length: number = 0;
  page: number = 0;
  paginationParams: any;
  valuePaginationParams: any;
  editModeOn: boolean = false;
  AttributeForm: FormGroup;
  attValuesForm: FormGroup;
  submitted: boolean = false;
  btnLoader: boolean = false;
  Id: number = 0;
  showDeletDialog: boolean = false;
  msgs: Message[] = [];
  pageSize?: number;
  pageNumber?: number;
  searchParams: any;
  timer: any;
  editvalueModeOn: boolean = false;
  submittedValue: boolean = false;
  attId: any = 0;
  valueId: number = 0;
  types: any[] = [];
  color: string = '';
  viewImage: boolean = false;
  editImageUrl?: string;
  @ViewChild('table', { static: false })
  table!: any;
  current: number = 1;
  next: string = '';
  asyncData: any;
  attributeSetsData: any[] = [];
  checked: boolean = true;
  inputType: string = '';
  imageId: any;
  selectedItems: any[] = [];
  imageName: string = '';
  allColumnFilter: any[] = [];
  searchValue!: string;
  showFilterField!: boolean;
  filterOfNames: any[] = ['title_ar', 'title_en', 'code'];
  filterField!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private _SaveFilesService: SaveFilesService,
    private confirmationService: ConfirmationService,
    private _AttributesService: AttributesService,
    private _ProductSetsService: ProductSetsService,
    private _UploadImageService: UploadImageService,
    private _exportService: ExportsService
  ) {
    this.tableHeader = [
      { field: 'id', header: 'ID' },
      { field: 'title_ar', header: 'Arabic' },
      { field: 'title_en', header: 'English' },
      { field: 'typeName', header: 'Value Type' },
      { field: 'is_required', header: 'Required' },
    ];
    this.valuesTableHeader = [
      { field: 'value_en', header: 'English' },
      { field: 'value_ar', header: 'Arabic' },
    ];
    this.filterField = this.fb.group({
      ['title_ar']: [''],
      ['title_en']: [''],
      ['code']: [''],
    });

    this.getAllTypes();
    this.paginationParams = new HttpParams();
    this.valuePaginationParams = new HttpParams();
    this.searchParams = new HttpParams();
    this.data$ = this.getAllAttributes();
    this.AttributeForm = this.fb.group({
      [controlKeys.title_ar]: ['', [Validators.required]],
      [controlKeys.title_en]: ['', [Validators.required]],
      [controlKeys.attribute_sets]: ['', [Validators.required]],
      [controlKeys.code]: ['', [Validators.required]],
      [controlKeys.type]: ['', [Validators.required]],
      [controlKeys.is_required]: ['', [Validators.required]],
    });
    this.attValuesForm = this.fb.group({
      [controlKeys.value_ar]: ['', [Validators.required]],
      [controlKeys.value_en]: ['', [Validators.required]],
    });
    this.AttributeForm.controls[controlKeys.type].setValue(
      {
        name: 'Choose Type',
        value: '',
      },
      { onlySelf: true }
    );

    this.getAllAttributeSets(1);
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
    this.loadingIndicator = true;
    this.data$ = this._AttributesService
      .getAttributesBySearch(this.paginationParams)
      .pipe(
        map((atts) => {
          this.length = atts.meta.total;
          this.page = atts.meta.last_page;
          return atts?.data?.map((attribute: any) => {
            this.attrTypeName = attribute.type.name;
            return {
              title_ar: attribute.title_ar,
              title_en: attribute.title_en,
              id: attribute.id,
              type: attribute.type,
              typeName: attribute.type.name.replace('_', ' '),
              code: attribute.code,
              is_required: attribute.is_required ? 'Yes' : 'No',
              requiredValue: attribute.is_required,
              attribute_sets: attribute.attribute_sets,
              isCheckedType:
                this.attrTypeName == 'TEXT_FIELD' ||
                this.attrTypeName == 'BOOLEAN'
                  ? false
                  : true,
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
      this.paginationParams = this.paginationParams.set(`search_key`, value);
      this.checkSearchVal(this.paginationParams);
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
        `filters[title_ar]`,
        this.filterField.get('title_ar')?.value
      );
      this.paginationParams = this.paginationParams.set(
        `filters[title_en]`,
        this.filterField.get('title_en')?.value
      );
      this.paginationParams = this.paginationParams.set(
        `filters[code]`,
        this.filterField.get('code')?.value
      );
      this.handlePageSize(this.paginationParams);
    } else {
      this.getAllAttributeSets(1);
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.getAllAttributeSets(1);
  }

  getAllTypes() {
    this.types = [
      {
        name: 'Text Field',
        value: 'TEXT_FIELD',
        id: 1,
      },
      {
        name: 'Boolean',
        value: 'BOOLEAN',
        id: 2,
      },
      {
        name: 'Multi Select',
        value: 'MULTI_SELECT',
        id: 3,
      },
      {
        name: 'Single Select',
        value: 'SINGLE_SELECT',
        id: 4,
      },
      {
        name: 'dropDown',
        value: 'DROPDOWN',
        id: 5,
      },
      {
        name: 'Color Swatch',
        value: 'COLOR_SWATCH',
        id: 6,
      },
      {
        name: 'Image Swatch',
        value: 'IMAGE_SWATCH',
        id: 7,
      },
      {
        name: 'Size',
        value: 'SIZE',
        id: 8,
      },
    ];
  }

  handleScrollEvent() {
    this.current++;
    let paginator = {
      page: this.current,
      size: 15,
    };
    this.getAllAttributeSets(this.current);
  }

  getAllAttributeSets(page: number) {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this._ProductSetsService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((atts) => {
        this.length = atts.meta.total;
        this.page = atts.meta.last_page;
        this.next = atts.links.next;
        this.asyncData = atts.data
          .map((attribute: any) => {
            return {
              title_en: attribute.title_en,
              title_ar: attribute.title_ar,
              id: attribute.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.attributeSetsData.find(
              (atts) => atts.id === asyncedData.id
            );
          });
        this.attributeSetsData = [...this.attributeSetsData, ...this.asyncData];
      });
  }

  attrTypeName: any;
  getAllAttributes() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this.pageNumber = 1;
    this.pageSize = 5;
    return this._AttributesService.get(this.paginationParams).pipe(
      map((atts) => {
        this.length = atts.meta.total;
        this.page = atts.meta.last_page;
        // this.next = atts.links.next
        return atts?.data?.map((attribute: any) => {
          this.attrTypeName = attribute.type.name;
          return {
            title_ar: attribute.title_ar,
            title_en: attribute.title_en,
            id: attribute.id,
            type: attribute.type,
            typeName: attribute.type.name.replace('_', ' '),
            code: attribute.code,
            is_required: attribute.is_required ? 'Yes' : 'No',
            requiredValue: attribute.is_required,
            attribute_sets: attribute.attribute_sets,
            // attribute_sets: attribute.attribute_sets,
            isCheckedType:
              this.attrTypeName == 'TEXT_FIELD' ||
              this.attrTypeName == 'BOOLEAN'
                ? false
                : true,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  // start crud operations
  showCreateModal(flag: boolean) {
    this.display = true;
    this.editModeOn = false;
    this.AttributeForm.reset();
    this.submitted = false;
    if (!this.AttributeForm.get(controlKeys.type)) {
      this.AttributeForm.addControl(
        controlKeys.type,
        this.fb.control('', Validators.required)
      );
    }
    this.AttributeForm.get(controlKeys.is_required)?.setValue(true);
  }

  submit() {
    this.submitted = true;
    this.btnLoader = true;
    if (this.editModeOn) {
      this.edit();
    } else {
      this.create();
    }
  }

  create() {
    if (this.AttributeForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let createdData = {
        title_ar: this.AttributeForm.get(controlKeys.title_ar)?.value,
        title_en: this.AttributeForm.get(controlKeys.title_en)?.value,
        code: this.AttributeForm.get(controlKeys.code)?.value,
        type: this.AttributeForm.get(controlKeys.type)?.value,
        is_required: this.AttributeForm.get(controlKeys.is_required)?.value,
        attribute_sets: this.AttributeForm.get(
          controlKeys.attribute_sets
        )?.value.map((attSet: any) => attSet.id),
      };
      this._AttributesService
        .create(createdData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data) => {
          this.display = false;
          this.data$ = this.getAllAttributes();
          this.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Attribute is created successfully',
          });
        });
    }
  }

  edit() {
    this.submitted = true;
    if (this.AttributeForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let updatedData = {
        title_ar: this.AttributeForm.get(controlKeys.title_ar)?.value,
        title_en: this.AttributeForm.get(controlKeys.title_en)?.value,
        code: this.AttributeForm.get(controlKeys.code)?.value,
        is_required: this.AttributeForm.get(controlKeys.is_required)?.value,
        attribute_sets: this.AttributeForm.get(
          controlKeys.attribute_sets
        )?.value.map((attSet: any) => attSet.id),
      };
      this._AttributesService
        .update(this.Id, updatedData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data) => {
          this.display = false;
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.AttributeForm.reset();
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Attribute is Updated successfully',
          });
        });
    }
  }

  EditHandler(data: any) {
    this.editModeOn = true;
    this.display = true;
    this.submitted = false;
    this.getAllTypes();
    this.AttributeForm.get(controlKeys.title_ar)?.setValue(data.title_ar);
    this.AttributeForm.get(controlKeys.title_en)?.setValue(data.title_en);
    this.AttributeForm.get(controlKeys.code)?.setValue(data.code);
    this.AttributeForm.get(controlKeys.is_required)?.setValue(
      data.requiredValue
    );
    this.Id = data.id;
    this.AttributeForm.removeControl('type');
    if (data?.attribute_sets.length !== 0) {
      let attributeSetsLookups = data?.attribute_sets.map((attSet: any) => {
        return {
          title_en: attSet.title_en,
          title_ar: attSet.title_ar,
          id: attSet.id,
        };
      });
      let foundCategories = this.attributeSetsData.filter((lookup: any) => {
        return attributeSetsLookups.find((set: any) => set.id === lookup.id);
      });
      if (!foundCategories) {
        this.attributeSetsData = [
          ...this.attributeSetsData,
          attributeSetsLookups,
        ];
      }
      this.AttributeForm.get(controlKeys.attribute_sets)?.setValue(
        foundCategories ?? attributeSetsLookups
      );
    }
  }

  DeleteHandler(data: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'do you want to delete this Attribute ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._AttributesService.delete(data.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Attribute is Deleted successfully',
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
    this.display = false;
    this.AttributeForm.reset();
  }
  // end crud operations

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
    this.data$ = this._AttributesService.paginate(this.paginationParams).pipe(
      map((atts) => {
        this.length = atts.meta.total;
        this.page = atts.meta.last_page;
        return atts?.data?.map((attribute: any) => {
          this.attrTypeName = attribute.type.name;
          return {
            title_ar: attribute.title_ar,
            title_en: attribute.title_en,
            id: attribute.id,
            type: attribute.type,
            typeName: attribute.type.name.replace('_', ' '),
            code: attribute.code,
            is_required: attribute.is_required ? 'Yes' : 'No',
            requiredValue: attribute.is_required,
            attribute_sets: attribute.attribute_sets,
            isCheckedType:
              this.attrTypeName == 'TEXT_FIELD' ||
              this.attrTypeName == 'BOOLEAN'
                ? false
                : true,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  // reset page number to 1 and clear the filter input
  reset() {
    let data = {
      page: 1,
      size: this.pageSize,
    };
    this.handlePageSize(data);
    this.filterName = '';
    this.editImageUrl = '';
    this.table.reset(event);
  }

  ngOnInit(): void {}

  // start view attributes Value
  checkAttrValues(value: any) {
    this.loadingIndicator = true;
    this.valuePaginationParams = this.valuePaginationParams.set('page', 1);
    this.valuePaginationParams = this.valuePaginationParams.set('per_page', 15);
    this.attId = value.id;
    this.attsValueData$ = this.getAllValue(value.id);
    this._AttributesService.getAttValue(value.id).subscribe((res: any) => {
      this.inputType = res.data.type.name;
      if (res.data.type.name === 'COLOR_SWATCH') {
        if (!this.attValuesForm.get('code')) {
          this.attValuesForm.addControl(
            'code',
            this.fb.control('', Validators.required)
          );
        }
      } else if (res.data.type.name === 'PATTERN_SWATCH') {
        if (!this.attValuesForm.get('pattern')) {
          this.attValuesForm.addControl(
            'pattern',
            this.fb.control('', Validators.required)
          );
        }
      }
    });
  }

  getAllValue(AttributeId: number) {
    return this._AttributesService.getAttValue(AttributeId).pipe(
      map((atts: any) => {
        this.length = 20;
        this.page = 1;
        this.displayValues = true;
        return atts?.data?.attribute_values?.map((value: any) => {
          this.color = value?.code;
          this.editImageUrl = value?.pattern?.url;
          return {
            value_ar: value.value_ar,
            value_en: value.value_en,
            id: value.id,
            code: value?.code,
            pattern:
              !value?.pattern?.url && value?.pattern === null
                ? ''
                : value?.pattern.url,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  imagePath: any;
  imgaePathText: string = '';
  uploadIamge(event: any) {
    const file: File = event.target.files[0];
    this.imageName = file.name;
    if (event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', file);
      this._UploadImageService.uploadImage(formData).subscribe((data: any) => {
        formData.delete('file');
        const reader1 = new FileReader();
        reader1.readAsDataURL(file);
        reader1.onload = (_event) => {
          this.viewImage = true;
          this.imagePath = reader1.result;
          this.imgaePathText = event.target.value.slice(0, 28);
        };
        this.imageId = data.id;
      });
    }
  }
  editImage() {
    this.viewImage = false;
    if (!this.attValuesForm.get('pattern')) {
      this.attValuesForm.addControl(
        'pattern',
        this.fb.control('', Validators.required)
      );
    }
  }

  // start crud operations
  submitValue() {
    this.submittedValue = true;
    this.btnLoader = true;
    if (this.editvalueModeOn) {
      this.editValue();
    } else {
      this.createValue();
    }
  }
  createValue() {
    this.loadingIndicator = true;
    if (this.attValuesForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let data = {
        attribute_id: this.attId,
        value_ar: this.attValuesForm.controls[controlKeys.value_ar].value,
        value_en: this.attValuesForm.controls[controlKeys.value_en].value,
      };
      if (this.inputType === 'COLOR_SWATCH') {
        let Colordata = {
          ...data,
          code: this.attValuesForm.controls['code']?.value,
        };
        this.createRequest(Colordata);
      } else if (this.inputType === 'PATTERN_SWATCH') {
        let imageData = {
          ...data,
          pattern: this.imageId,
        };
        this.createRequest(imageData);
      } else {
        this.createRequest(data);
      }
    }
  }

  createRequest(body: any) {
    this._AttributesService
      .createValue(body)
      .pipe(
        finalize(() => {
          this.btnLoader = false;
          this.loadingIndicator = false;
          this.submittedValue = false;
        })
      )
      .subscribe((data) => {
        this.viewImage = false;
        this.editvalueModeOn = false;
        this.clearValue();
        this.imageId = null;

        this.attsValueData$ = this.getAllValue(this.attId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'this value is created successfully',
        });
      });
  }

  editValue() {
    this.loadingIndicator = true;
    if (
      this.attValuesForm.get('value_ar')?.invalid &&
      this.attValuesForm.get('value_en')?.invalid
    ) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let data = {
        attribute_id: this.attId,
        value_ar: this.attValuesForm.controls[controlKeys.value_ar].value,
        value_en: this.attValuesForm.controls[controlKeys.value_en].value,
      };
      if (this.inputType === 'COLOR_SWATCH') {
        let Colordata = {
          ...data,
          code: this.attValuesForm.controls['code']?.value,
        };
        this.editRequest(Colordata);
      } else if (this.inputType === 'PATTERN_SWATCH') {
        let Colordata = {
          ...data,
          pattern: this.imageId,
        };
        this.editRequest(Colordata);
      } else {
        this.editRequest(data);
      }
    }
  }

  clearValue() {
    this.attValuesForm.get(controlKeys.value_ar)?.setValue('');
    this.attValuesForm.get(controlKeys.value_en)?.setValue('');
    this.viewImage = false;
    if (this.attValuesForm.get('code')) {
      this.attValuesForm.get(controlKeys.code)?.setValue('');
    }
    if (this.attValuesForm.get('pattern')) {
      this.attValuesForm.get('pattern')?.setValue('');
    }
    this.editvalueModeOn = false;
    this.submittedValue = false;
    this.imagePath = '';
    this.imgaePathText = '';
  }

  editRequest(body: any) {
    this._AttributesService
      .updateValue(this.valueId, body)
      .pipe(
        finalize(() => {
          this.btnLoader = false;
          this.loadingIndicator = false;
          this.submittedValue = false;
        })
      )
      .subscribe((data) => {
        this.viewImage = false;
        if (this.inputType === 'PATTERN_SWATCH') {
          if (!this.attValuesForm.get('pattern')) {
            this.imagePath = '';
            this.imgaePathText = '';
            this.attValuesForm.addControl(
              'pattern',
              this.fb.control('', Validators.required)
            );
          }
        }
        this.editvalueModeOn = false;
        this.clearValue();
        this.attsValueData$ = this.getAllValue(this.attId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'this value is Updated successfully',
        });
      });
  }

  handleBulkDeleteAttribute(value: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'Do you want to delete this Attribute ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let attributeIDs = value.map((attribute: any) => {
          return attribute.id;
        });

        let deletedids = {
          ids: attributeIDs,
        };
        this._AttributesService
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
              detail: 'These Attributes are deleted successfully',
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
        .exportBulk(EmptyArr, 'admin/attributes/export')
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
        .exportBulk(SelectedIds, 'admin/attributes/export')
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

  editValueHandler(data: any) {
    this.AttributeForm.reset(data);
    this.attValuesForm.get(controlKeys.value_ar)?.setValue(data.value_ar);
    this.attValuesForm.get(controlKeys.value_en)?.setValue(data.value_en);
    if (this.inputType === 'COLOR_SWATCH') {
      this.attValuesForm.get('code')?.setValue(data.code);
    }
    if (this.inputType === 'PATTERN_SWATCH') {
      if (this.attValuesForm.get('pattern')) {
        this.attValuesForm.removeControl('pattern');
      }
      this.imagePath = data.pattern;
      this.imgaePathText = data.pattern;
      this.viewImage = true;
    }
    this.valueId = data.id;
    this.editvalueModeOn = true;
  }

  resetValue() {
    this.attValuesForm.get(controlKeys.value_ar)?.setValue('');
    this.attValuesForm.get(controlKeys.value_en)?.setValue('');
    if (this.attValuesForm.get('code')) {
      this.attValuesForm.removeControl('code');
    }
    if (this.attValuesForm.get('pattern')) {
      this.attValuesForm.removeControl('pattern');
    }
    this.editvalueModeOn = false;
    this.submittedValue = false;
  }

  DeleteValueHandler(data: any) {
    this.showDeletDialog = true;

    this.confirmationService.confirm({
      message: 'do you want to delete this Value ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingIndicator = true;
        this._AttributesService
          .deleteValue(data.id)
          .pipe(
            finalize(() => {
              this.loadingIndicator = false;
            })
          )
          .subscribe((data: any) => {
            this.attsValueData$ = this.getAllValue(this.attId);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'this Value is Deleted successfully',
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

  // end crud operations
}
