import { RoleService } from './../../Services/permissionRole/role.service';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { finalize, map, Observable, pipe } from 'rxjs';
import { UserService } from 'src/app/Services/systemUser/user.service';

import { Clipboard } from '@angular/cdk/clipboard';
import { ExportsService } from 'src/app/Services/exports.service';

export enum controlKeys {
  first_name = 'first_name',
  last_name = 'last_name',
  email = 'email',
  password = 'password',
  permissionGroup = 'permissionGroup',
  active = 'active',
  change_password = 'change_password',
}

@Component({
  selector: 'app-system-user',
  templateUrl: './system-user.component.html',
  styleUrls: ['./system-user.component.scss'],
})
export class SystemUserComponent implements OnInit {
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  allUsers: any[] = [];
  length: number = 0;
  page: number = 0;
  paginationParams: any;
  data$: Observable<any>;
  UserForm: FormGroup;
  submitted: boolean = false;
  editModeOn: boolean = false;
  display: boolean = false;
  pageSize?: number;
  pageNumber?: number;
  //  totalItems: number = 0;
  btnLoader: boolean = false;
  Status: boolean = false;
  msgs: any[] = [];
  showFilterField: boolean = false;
  searchValue: string = '';
  filterField!: FormGroup;
  visibility: any[] = [];
  constructor(
    private systemUser: UserService,
    private _ConfirmationService: ConfirmationService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private roleSer: RoleService,
    private clipboard: Clipboard,
    private _exportService: ExportsService
  ) {
    this.paginationParams = new HttpParams();
    this.filterField = this.fb.group({
      ['name']: [''],
      ['email']: [''],
      ['phone']: [''],
      ['is_active']: [''],
    });
    this.visibility = [
      { value: 1, name: 'Active' },
      { value: 0, name: 'In Active' },
    ];
    this.UserForm = this.fb.group({
      [controlKeys.first_name]: ['', [Validators.required]],
      [controlKeys.last_name]: ['', [Validators.required]],
      [controlKeys.email]: ['', [Validators.required, Validators.email]],
      [controlKeys.permissionGroup]: ['', [Validators.required]],
      [controlKeys.active]: [''],
      [controlKeys.password]: ['', [Validators.required]],
      [controlKeys.change_password]: [''],
    });

    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'name', header: 'User Name' },
      { field: 'email', header: 'Email' },
      { field: 'status', header: 'Status' },
      { field: 'permissioGroup', header: 'Permission Group' },
      { field: 'activeDate', header: 'Create Date' },
    ];
    this.data$ = this.getAllUser();
  }

  getAllUser() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    this.pageNumber = 1;
    this.pageSize = 50;
    return this.systemUser.systemUsers(this.paginationParams).pipe(
      map((users: any) => {
        this.allUsers = users.data;
        this.length = users.meta.total;
        this.page = users.meta.last_page;
        return users?.data?.map((user: any) => {
          return {
            id: user.id,
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            status: user?.is_active ? 'Active' : 'Inactive',
            permissioGroup: user.roles[0].name,
            change_password: user.change_password,
            activeDate: this.datePipe.transform(
              user?.created_at,
              'E  d  MMM  h:mm'
            ),
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  handleBulkExportedData(value: any) {
    let SelectedIds = value.map((item: any) => {
      return item.id;
    });
    let IDS: any = {
      ids: SelectedIds,
    };
    if (value.length === 0) {
      // let EmptyArr: any = this.selectedItems;
      this._exportService
        .exportBulk(SelectedIds, 'admin/admins/export')
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
        .exportBulk(SelectedIds, 'admin/admins/export')
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

  getSearchColumn(value: any) {
    this.searchValue = value;
  }

  switchStatus(status: boolean) {}

  resetForm() {
    this.filterField.reset();
  }
  checkSearchVal(value: string) {
    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize
    );
    this.paginationParams = this.paginationParams.set('search_key', value);
    this.loadingIndicator = true;
    this.data$ = this.systemUser.getClientsBySearch(this.paginationParams).pipe(
      map((users: any) => {
        this.allUsers = users.data;
        this.length = users.meta.total;
        this.page = users.meta.last_page;
        return users?.data?.map((user: any) => {
          return {
            id: user.id,
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            status: user?.is_active ? 'Active' : 'Inactive',
            permissioGroup: user.roles[0].name,
            change_password: user.change_password,
            activeDate: this.datePipe.transform(
              user?.created_at,
              'E  d  MMM  h:mm'
            ),
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
      this.filterField.get('email')?.value !== '' ||
      this.filterField.get('phone')?.value !== '' ||
      this.filterField.get('is_active')?.value.name !== ''
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
        `filters[name]`,
        this.filterField.get('name')?.value
          ? this.filterField.get('first_name')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[email]`,
        this.filterField.get('email')?.value
          ? this.filterField.get('email')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[phone]`,
        this.filterField.get('phone')?.value
          ? this.filterField.get('phone')?.value
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
      this.handlePageSize(this.paginationParams);
    } else {
      this.data$ = this.getAllUser();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.data$ = this.getAllUser();
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
    this.data$ = this.systemUser.systemUsers(this.paginationParams).pipe(
      map((users: any) => {
        this.allUsers = users.data;
        this.length = users.meta.total;
        this.page = users.meta.last_page;
        return users?.data?.map((user: any) => {
          return {
            id: user.id,
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            status: user?.is_active ? 'Active' : 'Inactive',
            permissioGroup: user.roles[0].name,
            change_password: user.change_password,
            activeDate: this.datePipe.transform(
              user?.created_at,
              'E  d  MMM  h:mm'
            ),
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }
  ngOnInit(): void {
    this.roleSer.getRoles().subscribe((data: any) => {
      this.role = data.data;
    });
  }

  openCreateDialog(flag: boolean) {
    this.display = true;
    this.UserForm.addControl(
      controlKeys.password,
      this.fb.control('', Validators.required)
    );
    this.UserForm.reset();
    this.editModeOn = false;
    this.submitted = false;
  }

  submit() {
    this.btnLoader = true;
    this.UserForm.get(controlKeys.active)?.setValue(this.Status);
    if (this.editModeOn) {
      // this.UserForm.get(controlKeys.permissionGroup)?.setValue(this.roleName);
      // let roleId = this.role.find((ele: any) => {
      //   return ele.name == this.UserForm.get('permissionGroup')?.value;
      // });
      this.UserForm.get(controlKeys.permissionGroup)?.setValue(
        this.UserForm.get('permissionGroup')?.value?.id
      );
      this.UserForm.controls['password'].clearValidators();
      this.UserForm.controls['password'].updateValueAndValidity();
      this.edit();
    } else {
      this.UserForm.controls['password'].setValidators([Validators.required]);
      this.UserForm.controls['password'].updateValueAndValidity();
      this.create();
    }
  }

  create() {
    this.submitted = true;
    if (this.UserForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      this.systemUser
        .craeteSystemUsers(this.UserForm.value)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data: any) => {
          this.display = false;
          this.btnLoader = false;
          this.data$ = this.getAllUser();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this User is created successfully',
          });
        });
    }
  }

  edit() {
    this.submitted = true;
    if (this.UserForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      this.getAllUser();
      this.systemUser
        .updateSystemUsers(this.UserForm.value, this.userId)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data) => {
          this.btnLoader = false;
          this.display = false;
          this.data$ = this.getAllUser();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this User is Updated successfully',
          });
        });
    }
  }

  cancel() {
    this.display = false;
    this.submitted = false;
    this.UserForm.reset();
  }

  createUser() {
    this.display = true;
    this.editModeOn = false;
  }

  isCopy: boolean = false;
  copyPassword() {
    this.UserForm.get('password')?.value;
    this.isCopy = true;
    this.clipboard.copy(this.UserForm.get('password')?.value);
    setTimeout(() => {
      this.isCopy = false;
    }, 1500);
  }

  genePawword() {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password: any = '';
    for (let i = 0; i < 10; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    this.UserForm.get(controlKeys.password)?.setValue(password);
  }

  userId: number = 0;
  role: any[] = [];
  roleName: any;
  checked: boolean = false;
  EditHandler(data: any) {
    let user = this.allUsers.filter((res: any) => {
      return res.id == data.id;
    });
    let rolePermmisionName = this.role.filter((res: any) => {
      return res.name == data.permissioGroup;
    });
    this.Status = user[0].is_active;
    this.userId = user[0].id;
    this.roleName = user[0].roles[0].name;
    this.editModeOn = true;
    this.display = true;
    this.submitted = false;
    this.UserForm.get(controlKeys.change_password)?.setValue(
      user[0].change_password
    );

    this.UserForm.get(controlKeys.first_name)?.setValue(user[0].first_name);
    this.UserForm.get(controlKeys.last_name)?.setValue(user[0].last_name);
    this.UserForm.get(controlKeys.email)?.setValue(user[0].email);
    this.UserForm.get(controlKeys.password)?.setValue('');
    this.UserForm.get(controlKeys.permissionGroup)?.setValue(rolePermmisionName[0]);
  }

  DeleteHandler(value: any) {
    this._ConfirmationService.confirm({
      message: 'Do you want to delete this User ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.systemUser.deleteSystemUsers(value.id).subscribe((data: any) => {
          this.data$ = this.getAllUser();
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'this User has been Deleted Successfully',
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
}
