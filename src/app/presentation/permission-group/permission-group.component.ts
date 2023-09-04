import { Router } from '@angular/router';
import { RoleService } from './../../Services/permissionRole/role.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import {
  MessageService,
  ConfirmationService,
  PrimeNGConfig,
  Message,
} from 'primeng/api';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.scss'],
})
export class PermissionGroupComponent implements OnInit {
  tableHeader: any[] = [];
  @ViewChild('table', { static: false })
  table!: any;
  msgs: Message[] = [];
  page: number = 0;
  length: number = 0;
  data$: Observable<any>;
  showDeletDialog: boolean = false;
  loadingIndicator: boolean = false;
  params: any;
  allColumnFilter:any[] = [];
  searchValue!:string
  showFilterField:boolean=false;
  filterOfNames:any[]=[
    'title_ar',
    'title_en',
    'code',

  ]
  filterField!:FormGroup
  visibility:any[]=[]
  constructor(
    private rolesSer: RoleService,
    private datePipe: DatePipe,
    private _Router: Router,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.params = new HttpParams();
    this.filterField =this.fb.group({
      ['name']:[''],
      ['phone']:[''],
      ['is_active']:[''],
    })
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'name', header: 'Group Name' },
      { field: 'users_count', header: 'Role' },
      { field: 'permissions_count', header: 'Users' },
      { field: 'created_at', header: 'Create Date' },
      { field: 'sku', header: 'Actions' },
    ];
    this.visibility = [
      { value: 1, name: 'Active' },
      { value: 0, name: 'In Active' },
    ];
    this.data$ = this.allRole();
  }

  totalItems: any;
  allRole() {
    // this.params = this.params.set('page', 1);
    // this.params = this.params.set('per_page', 5);
    return this.rolesSer.getRoles().pipe(
      map((roles: any) => {
        this.totalItems = roles.data.length;
        return roles?.data?.map((role: any) => {
          return {
            id: role?.id,
            name: role?.name,
            users_count: role?.users_count,
            permissions_count: role?.permissions_count,
            created_at: this.datePipe.transform(
              role?.created_at,
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


  showFilterFieldFn(value:boolean)
  {
    this.showFilterField=!this.showFilterField
  }
  resetForm()
  {
    this.filterField.reset()
  }
  checkSearchVal(value: string)
  {

  this.loadingIndicator = true
  this.params = this.params.set(`search_key`, value);
      // this.params = this.params.set('page', this.pageNumber);
      // this.params = this.params.set('per_page', this.pageSize);
  this.data$ = this.rolesSer.getRolsBySearch(this.params).pipe(
    map((roles: any) => {
      this.totalItems = roles.data.length;
      return roles?.data?.map((role: any) => {
        return {
          id: role?.id,
          name: role?.name,
          users_count: role?.users_count,
          permissions_count: role?.permissions_count,
          created_at: this.datePipe.transform(
            role?.created_at,
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
    // let data = {
    //   page: this.pageNumber,
    //   size: this.pageSize,
    // };

    if (value === '') {
      this.params = this.params.delete('search_key');
      this.data$ = this.allRole();
    } else {
      // this.pageNumber=1
      // this.pageSize=5

      this.checkSearchVal(value);
    }
  }
  getFilterAction()
  {
    if (this.filterField.get('name')?.value !== ''||this.filterField.get('phone')?.value !== ''||this.filterField.get('is_active')?.value !== ''
    ) {
      // this.pageNumber=1
      // this.pageSize=5
    //   this.params = this.params.set('page', this.pageNumber);
    // this.params = this.params.set('per_page', this.pageSize);
      this.params = this.params.set(`filters[name]`,this.filterField.get('name')?.value?this.filterField.get('name')?.value:'')
      // this.params = this.params.set(`filters[phone]`,this.filterField.get('phone')?.value?this.filterField.get('phone')?.value:'')
      // this.params = this.params.set(`filters[status]`,this.filterField.get('is_active')?.value?.id?this.filterField.get('is_active')?.value?.id:'')
      this.data$ = this.rolesSer.getRolsBySearch(this.params).pipe(
        map((roles: any) => {
          this.totalItems = roles.data.length;
          return roles?.data?.map((role: any) => {
            return {
              id: role?.id,
              name: role?.name,
              users_count: role?.users_count,
              permissions_count: role?.permissions_count,
              created_at: this.datePipe.transform(
                role?.created_at,
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
    else
    {
      this.data$= this.allRole();
    }
  }
  resetFormColumn()
  {
    this.filterField.reset()
    this.data$= this.allRole();
  }

  ngOnInit(): void {}

  handleOrdersPageSize(value: any) {
    // let currentPage = value.first / value.rows + 1;
    // let paginator = {
    //   page: currentPage,
    //   size: value.rows,
    // };
    // this.pageSize = paginator.size;
    // this.pageNumber = paginator.page;
    // this.params = this.params.set('page', this.pageNumber);
    // this.params = this.params.set(
    //   'per_page',
    //   this.pageSize
    // );
    // this.loadingIndicator = true;
    // this.data$ = this._orderService.paginateOrders(this.params).pipe(
    //   map((Orders) => {
    //     this.totalItems =  Orders.meta.total;
    //     return Orders?.data?.map((Order: any) => {
    //       return {
    //         id: Order?.id,
    //         country: Order?.shipping_address?.country?.name,
    //         purchase_point: Order?.purchase_point?.label,
    //         customerName:
    //         Order?.client?.first_name + ' ' + Order?.client?.last_name,
    //         length: Order?.total_requested_quantity,
    //         grandTotal: Order?.grand_total,
    //         fees: Order?.delivery_price,
    //         Status: Order?.status?.label,
    //         city: Order?.shipping_address?.city?.name,
    //         PhoneNumber: Order?.client?.phone,
    //         PaymentInfo: Order?.payment_info,
    //         created_at: this.datePipe.transform(
    //         Order?.created_at,
    //           'E  d  MMM  h:mm'
    //         ),
    //       };
    //     });
    //   }),
    //   finalize(() => (this.loadingIndicator = false))
    // );
  }

  editHandler(data: any) {
    this._Router.navigate(['Dashboard/permissionGroup/create-Group/', data.id]);
  }

  DeleteHandler(data: any) {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'do you want to delete this Role ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rolesSer.deleteRole(data.id).subscribe((data: any) => {
          this.data$ = this.allRole();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Role is Deleted successfully',
          });
          this.loadingIndicator = false;
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

  createGroup() {
    this._Router.navigate(['Dashboard/permissionGroup/create-Group']);
  }
}
