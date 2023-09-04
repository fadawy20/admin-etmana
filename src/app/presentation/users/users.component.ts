import { Component, OnInit } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { ClientService } from 'src/app/Services/client.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  PrimeNGConfig,
  Message,
} from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { CountryService } from 'src/app/Services/country/country.service';
import { ICountries } from 'src/app/interfaces/countries.interface';
import { MultiSelectFilterOptions } from 'primeng/multiselect';
import { ExportsService } from 'src/app/Services/exports.service';
import { Router } from '@angular/router';

export enum controlKeys {
  first_name = 'first_name',
  last_name = 'last_name',
  email = 'email',
  password = 'password',
  phone = 'phone',
  birth_date = 'birth_date',
  country = 'country',
  countryCode = 'countryCode',
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  tableHeader: any[] = [];
  data$: Observable<any[]>;
  countries: ICountries[] = [];
  loadingIndicator: boolean = false;
  display: boolean = false;
  dataLength: number = 0;
  clientForm: FormGroup;
  submitted: boolean = false;
  editModeOn: boolean = false;
  clientId: number = 0;
  page: any;
  length: any;
  paginationParams: any;
  // paginationParams: any
  btnLoader: boolean = false;
  switchButtonFlag: boolean = false;
  timer: any;
  statsItems: any[] = [];
  viewFilters: boolean = false;
  block: boolean = false;
  pageSize?: number;
  pageNumber?: number;
  searchValue!: string;

  searchParams: any;
  filterName?: string;
  filterEmail?: string;
  filterNumber?: string;
  msgs: Message[] = [];
  showDeletDialog: boolean = false;
  countriess: any[] = [];
  next: string = '';
  selectedItems: any[] = [];
  birthDate: any;
  selectedCountries: any[] = [];

  filterValue = '';
  allColumnFilter: any[] = [];
  filterOfNames: any[] = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'is_blocked',
    'is_subscribed',
  ];
  showFilterField!: boolean;
  filterField!: FormGroup;
  country: any = localStorage.getItem('Country');
  showPassword: boolean = false;
  allData: any[] = []

  constructor(
    private _ClientService: ClientService,
    private _CountryService: CountryService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _exportService: ExportsService,
    private router: Router
  ) {
    this.countriess = [
      { name: 'Black', code: '#4e4e4e' },
      { name: 'Blue', code: '#09c' },
      { name: 'Green', code: 'green' },
    ];
    this.filterField = this.fb.group({
      ['first_name']: [''],
      ['last_name']: [''],
      ['email']: [''],
      ['phone']: [''],
      ['is_blocked']: [false],
      ['is_subscribed']: [false],
    });
    this.paginationParams = new HttpParams();
    this.searchParams = new HttpParams();
    this.clientForm = this.fb.group({
      [controlKeys.first_name]: ['', [Validators.required]],
      [controlKeys.last_name]: ['', [Validators.required]],
      [controlKeys.email]: [''],
      [controlKeys.password]: ['', [Validators.required]],
      [controlKeys.phone]: [
        '',
        [Validators.required],
        // [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      [controlKeys.birth_date]: [''],
      [controlKeys.country]: [''],
      [controlKeys.countryCode]: [''],
    });

    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'name', header: 'Name' },
      { field: 'balance', header: 'Balance' },
      { field: 'address', header: 'Address' },
      { field: 'orderDate', header: 'Last order date' },
    ];
    this.data$ = this.getAllClients();
    // console.log(this.data$.subscribe((res) => {
    //   this.allData = res
    // }));


    this.statsItems = [
      {
        title: 'total Clients',
        value: 125,
      },
      {
        title: 'total featured Clients',
        value: 100,
      },
      {
        title: 'total unfeatured Clients',
        value: 25,
      },
    ];
  }

  openProfile(ev: any) {
    this.router.navigateByUrl(`/Dashboard/users/profile/acount-info/${ev?.id}`);
  }

  myResetFunction(options: MultiSelectFilterOptions) {
    // options.reset();
    this.filterValue = '';
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getCountries();
    this.getAllClients()
  }

  getCountries() {
    this.countries = this._CountryService.getCountry();
  }

  // get all on itialize
  getAllClients() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    // this.pageNumber = 1;
    // this.pageSize = 5;
    return this._ClientService.get(this.paginationParams).pipe(
      map((clients) => {
        this.length = clients.meta.total;
        this.page = clients.meta.last_page;
        this.next = clients.links.next;
        return clients?.data?.map((client: any) => {
          return {

            first_name: client.first_name,
            last_name: client.last_name,
            id: client.id,
            name: client.first_name + ' ' + client.last_name,
            email: client.email || '-',
            phone: client.phone,
            country: client.formatted_phone,
            balance: (client?.wallet + ' EGP') || '0  EGP',
            orders_count: client?.orders_count,
            address: client?.address?.address_details
              ? client?.address?.address_details
              : '__',
            orderDate: this.datePipe.transform(
              client.created_at,
              'yyyy MM dd hh:mm'
            ),
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }
  switchStatus(status: boolean) { }
  showFilterFieldFn(value: boolean) {
    this.showFilterField = value;
  }
  resetForm() {
    this.filterField.reset();
  }
  checkSearchVal(value: string) {
    // this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    // this.paginationParams = this.paginationParams.set(
    //   'per_page',
    //   this.pageSize
    // );
    // this.paginationParams = this.paginationParams.set('search_key', value);
    this.loadingIndicator = true;
    this.data$ = this._ClientService
      .getClientsBySearch(value)
      .pipe(
        map((clients) => {
          this.length = clients.meta.total;
          // this.page = clients.meta.last_page;
          return clients?.data?.map((client: any) => {
            return {
              first_name: client?.first_name,
              last_name: client?.last_name,
              id: client?.id,
              name: client?.first_name + ' ' + client?.last_name,
              email: client?.email,
              phone: client?.phone,
              country: client?.formatted_phone,
              orderDate: client?.orderDate,
              orders_count: client?.orders_count,
              // address: client?.address,
              balance: client?.wallet || '0',
              address: client?.address?.address_details
                ? client?.address?.address_details
                : '__',

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
      this.data$ = this.getAllClients()

    } else {
      this.pageNumber = 1;
      this.pageSize = 20;
      this.paginationParams = this.paginationParams.set(`search_key`, value);
      this.paginationParams = this.paginationParams.set('page', this.pageNumber);
      this.paginationParams = this.paginationParams.set('per_page', this.pageSize);
      this.checkSearchVal(this.paginationParams);

    }
  }

  getFilterAction() {
    if (
      this.filterField.get('first_name')?.value !== '' ||
      this.filterField.get('last_name')?.value !== '' ||
      this.filterField.get('email')?.value !== '' ||
      this.filterField.get('phone')?.value !== false ||
      this.filterField.get('is_blocked')?.value !== false ||
      this.filterField.get('is_subscribed')?.value !== false
    ) {
      this.pageNumber = 1;
      this.pageSize = 5;
      this.paginationParams = this.paginationParams.set(
        'page',
        this.pageNumber
      );
      this.paginationParams = this.paginationParams.set(
        'per_page',
        this.pageSize
      );
      this.paginationParams = this.paginationParams.set(
        `filters[first_name]`,
        this.filterField.get('first_name')?.value
          ? this.filterField.get('first_name')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[last_name]`,
        this.filterField.get('last_name')?.value
          ? this.filterField.get('last_name')?.value
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
        `filters[is_blocked]`,
        this.filterField.get('is_blocked')?.value === true
          ? 1
          : this.filterField.get('is_blocked')?.value === false
            ? 0
            : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[is_subscribed]`,
        this.filterField.get('is_subscribed')?.value === true
          ? 1
          : this.filterField.get('is_subscribed')?.value === false
            ? 0
            : ''
      );
      this.handlePageSize(this.paginationParams);
    } else {
      this.data$ = this.getAllClients();
    }
  }
  resetFormColumn() {
    this.filterField.reset();
    this.data$ = this.getAllClients();
  }

  // start CRUD operations functions
  openCreateDialog(flag: boolean) {
    this.display = true;
    this.clientForm.addControl(controlKeys.password, this.fb.control(''));
    this.clientForm.reset();
    this.editModeOn = false;
    this.submitted = false;
  }

  submit() {
    this.btnLoader = true;
    if (this.editModeOn) {
      this.edit();
    } else {
      this.create();
    }
  }

  create() {
    this.clientForm
      .get(controlKeys.countryCode)
      ?.setValue(this.clientForm.get('country')?.value);
    this.submitted = true;
    if (this.clientForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let createdData = {
        first_name: this.clientForm.controls['first_name'].value,
        last_name: this.clientForm.controls['last_name'].value,
        email: this.clientForm.controls['email'].value,
        //country:this.clientForm.controls['country'].value,
        password: this.clientForm.controls['password'].value,
        phone:
          this.country == 'eg'
            ? '+2' + this.clientForm.controls['phone'].value
            : '+966' + this.clientForm.controls['phone'].value,
        birth_date: this.datePipe.transform(this.birthDate, 'yyyy-MM-dd'),
        is_subscribed: 0,
      };

      this._ClientService
        .create(createdData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data) => {
          this.display = false;
          this.data$ = this.getAllClients();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Customer is created successfully',
          });
        });
    }
  }

  edit() {
    this.submitted = true;
    if (this.clientForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let updatedData = {
        first_name: this.clientForm.controls['first_name'].value,
        last_name: this.clientForm.controls['last_name'].value,
        email: this.clientForm.controls['email'].value,
        country: this.clientForm.controls['country'].value,
        countryCode: this.clientForm.controls['countryCode']?.value?.code,
        phone:
          this.clientForm.controls[controlKeys.country].value +
          this.clientForm.controls['phone'].value,
        birth_date: this.datePipe.transform(this.birthDate, 'yyyy-MM-dd'),
        password: this.clientForm.controls['password'].value,
        is_subscribed: 0,
      };
      this._ClientService
        .update(this.clientId, updatedData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
          })
        )
        .subscribe((data) => {
          this.display = false;
          this.data$ = this.getAllClients();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Customer is Updated successfully',
          });
        });
    }
  }

  cancel() {
    this.display = false;
    this.submitted = false;
    this.clientForm.reset();
  }

  DeleteHandler(data: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'do you want to delete this Customer ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._ClientService.delete(data.id).subscribe((data: any) => {
          this.data$ = this.getAllClients();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this customer is Deleted successfully',
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

  EditHandler(data: any) {
    this.editModeOn = true;
    // console.log(data);

    this.router.navigate([`Dashboard/users/profile/acount-info/${data.id}`])


    // this.display = true;
    this.submitted = false;
    this.clientForm.get(controlKeys.first_name)?.setValue(data.first_name);
    this.clientForm.get(controlKeys.last_name)?.setValue(data.last_name);
    this.clientForm.get(controlKeys.email)?.setValue(data?.email);
    this.clientForm.get(controlKeys.country)?.setValue(data.country?.code);
    this.clientForm
      .get(controlKeys.birth_date)
      ?.setValue(new Date(this.birthDate));
    this.clientForm.get(controlKeys.password)?.clearValidators();
    this.clientForm.get(controlKeys.password)?.updateValueAndValidity();
    this.clientForm.get(controlKeys.password)?.setValue('');
    this.clientId = data.id;
    this.clientForm.get(controlKeys.phone)?.setValue(data.country?.number);
    this.clientForm.get(controlKeys.countryCode)?.setValue(data.country?.code);
    let country = {
      code: data.country?.code,
      value: data.country?.name,
    };
  }

  // end crud operation functions

  // start pagination
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
    this.data$ = this._ClientService.paginate(this.paginationParams).pipe(
      map((clients) => {
        this.length = clients.meta.total;
        this.page = clients.meta.last_page;
        return clients?.data?.map((client: any) => {
          return {
            first_name: client.first_name,
            last_name: client.last_name,
            id: client.id,
            name: client.first_name + ' ' + client.last_name,
            email: client.email,
            phone: client.phone,
            country: client.formatted_phone,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
  }

  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  //showExportedDialog: boolean = false

  handleBulkExportedData(value: any) {
    // console.log('handleBulkExportedData ===> value : ', value);

    // this is will return array of ids only from array (value)
    let SelectedIds = value.map((item: any) => {
      return item.id;
    });
    let IDS: any = {
      ids: SelectedIds,
    };
    if (value.length === 0) {
      let EmptyArr: any = this.selectedItems;
      this._exportService
        .exportBulk(EmptyArr, 'admin/clients/export')
        .subscribe((data: any) => {
          // let dataPage = {
          //   page: this.pageNumber,
          //   size: this.pageSize,
          // };
          // this.handlePageSize(dataPage);
          this.download(data, data.type);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
        });
    } else {
      this._exportService
        .exportBulk(SelectedIds, 'admin/clients/export')
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

  handleBulkDeleteUser(value: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'Do you want to delete this Customers ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let userIDs = value.map((user: any) => {
          return user.id;
        });

        let deletedids = {
          ids: userIDs,
        };
        this._ClientService.RemoveBulk(deletedids).subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.selectedItems = [];
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'These Customers are deleted successfully',
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

  reset() {
    this.data$ = this.getAllClients();
    this.filterName = '';
    this.filterEmail = '';
    this.filterNumber = '';
  }
  // end pagination and search params
}
