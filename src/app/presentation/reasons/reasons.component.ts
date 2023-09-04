import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReasonsService } from 'src/app/Services/reasons.service';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { finalize, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';
export enum controlKeys {
  description_ar = 'description_ar',
  description_en = 'description_en',
}

@Component({
  selector: 'app-reasons',
  templateUrl: './reasons.component.html',
  styleUrls: ['./reasons.component.scss'],
})
export class REASONSComponent implements OnInit {
  shownCollection: boolean = true;
  display: boolean = false;
  editModeOn: boolean = false;
  submitted: boolean = false;
  reasonForm!: FormGroup;
  loadingIndicator: boolean = false;
  page: number = 0;
  length: number = 0;
  data$: any;
  tableHeader: any[] = [];
  reasonSetId: number = 0;
  showDeletDialog: boolean = false;
  pageNumber?: number;
  pageSize?: number;
  msgs: Message[] = [];
  btnLoader: boolean = false;
  paginationParams: any;
  @ViewChild('table', { static: false })
  table!: any;
  filterName: string = '';
  showFilterField!:boolean;
  filterOfNames:any[]=[
    'description_ar',
    'description_en',
  ]
  filterField!:FormGroup
  constructor(
    private fb: FormBuilder,
    private _Reasonservice: ReasonsService,
    private _ConfirmationService: ConfirmationService,
    private _MessageService: MessageService
  ) {
    this.tableHeader = [
      { field: 'description_ar', header: 'Arabic' },
      { field: 'description_en', header: 'English' },
    ];
    this.paginationParams = new HttpParams();

    this.data$ = this.getAllReasonsSets();

    this.reasonForm = this.fb.group({
      [controlKeys.description_ar]: ['', [Validators.required]],
      [controlKeys.description_en]: ['', [Validators.required]],
    });
    this.filterField =this.fb.group({
      ['description_ar']:[''],
      ['description_en']:['']
    })
  }
  showFilterFieldFn(value:boolean)
  {
    this.showFilterField=value
  }
  resetForm()
  {
    this.filterField.reset()
   this.data$= this.getAllReasonsSets()
  }

  ngOnInit(): void { }

  getFilterAction()
  {
    if (this.filterField.get('description_ar')?.value !== ''||this.filterField.get('description_en')?.value !== '') {
      // this.paginationParams = this.paginationParams.set('filters[description_ar]',this.filterField.get('description_ar')?.value)
      // this.paginationParams = this.paginationParams.set('filters[description_en]',this.filterField.get('description_en')?.value)
      this.loadingIndicator = true;
      this.handlePageSize(this.paginationParams)
    }
    else
    {
      this.data$= this.getAllReasonsSets()
    }
  }

  getAllReasonsSets() {
    // this.paginationParams = this.paginationParams.set('page', 1);
    // this.paginationParams = this.paginationParams.set('per_page', 10);
    return this._Reasonservice.get().pipe(
      map((ReasonsSets) => {
        // this.length = ReasonsSets.meta.total;
        return ReasonsSets?.data?.map((reasonsSet: any) => {
          return {
            description_ar: reasonsSet.description_ar,
            description_en: reasonsSet.description_en,
            id: reasonsSet.id,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  handlePageSize(value: any) {
    this.pageSize = value.size;
    this.pageNumber = value.page;
    // this.paginationParams = this.paginationParams.set('page', this.pageNumber?this.pageNumber:1);
    // this.paginationParams = this.paginationParams.set(
    //   'per_page',
    //   this.pageSize?this.pageSize:5
    // );
    this.paginationParams = this.paginationParams.set('filters[description_ar]',this.filterField.get('description_ar')?.value)
      this.paginationParams = this.paginationParams.set('filters[description_en]',this.filterField.get('description_en')?.value)
    this.loadingIndicator = true;
    this.data$ = this._Reasonservice.paginate(this.paginationParams).pipe(
      map((reasonsSets) => {
        this.length = reasonsSets?.meta?.total;
        return reasonsSets?.data?.map((reasonsSet: any) => {
          return {
            description_ar: reasonsSet?.description_ar,
            description_en: reasonsSet?.description_en,
            id: reasonsSet?.id,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  // start crud operations
  openCreateDialog(flag: boolean) {
    this.display = true;
    this.editModeOn = false;
    this.reasonForm.reset();
    this.submitted = false;
  }

  submit() {
    this.submitted = true;
    this.btnLoader = true;
    if (this.editModeOn) {
      this.edite();
    } else {
      this.create();
    }
  }

  create() {
    if (this.reasonForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let createdData = {
        description_ar: this.reasonForm.get(controlKeys.description_ar)?.value,
        description_en: this.reasonForm.get(controlKeys.description_en)?.value,
      };
      this._Reasonservice
        .create(createdData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data: any) => {
          this.display = false;
          this.data$ = this.getAllReasonsSets();
          // this.table.reset(event);
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Reason has been created Successfully',
          });
        });
    }
  }

  edite() {
    this.submitted = true;
    if (this.reasonForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let updatedData = {
        description_ar: this.reasonForm.get(controlKeys.description_ar)?.value,
        description_en: this.reasonForm.get(controlKeys.description_en)?.value,
      };
      this._Reasonservice
        .update(this.reasonSetId, updatedData)
        .pipe(
          finalize(() => {
            this.btnLoader = false;
            this.submitted = false;
          })
        )
        .subscribe((data: any) => {
          this.display = false;
          let pageData = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.data$ = this.getAllReasonsSets();
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Reason has been updated Successfully',
          });
        });
    }
  }

  EditHandler(data: any) {
    this.editModeOn = true;
    this.display = true;
    this.submitted = false;
    this.reasonForm
      .get(controlKeys.description_ar)
      ?.setValue(data.description_ar);
    this.reasonForm
      .get(controlKeys.description_en)
      ?.setValue(data.description_en);
    this.reasonSetId = data.id;
  }
  DeleteHandler(data: any) {
    this._ConfirmationService.confirm({
      message: 'Do you want to delete this Reasons ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._Reasonservice.delete(data.id).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.data$ = this.getAllReasonsSets();
          this._MessageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'this Reason Set has been Deleted Successfully',
          });
        });
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Rejected',
            detail: 'you have rejected deleted',
          },
        ];
      },
    });
  }

  cancel() {
    this.display = false;
    this.reasonForm.reset();
  }
}
