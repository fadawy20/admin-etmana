import { HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { AttributesService } from 'src/app/Services/attributes.service';
import { SaveFilesService } from 'src/app/Services/save-files/save-files.service';
import { SearchService } from 'src/app/Services/search.services';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @ViewChild('dataTable', { static: false }) dataTable!: any;
  //show and hide components from parent component
  @Input() tableHeaders: any[] = [];
  @Input() tableData: any;
  @Input() value: any;
  @Input() showActionCol: boolean = false;
  @Input() showEditAction: boolean = false;
  @Input() showDetailsAction: boolean = false;
  @Input() showDeleteAction: boolean = false;
  @Input() showSettingAction: boolean = false;
  @Input() loadingIndicator: boolean = false;
  @Input() Message: string = 'Loading...';
  @Input() totalItems: any;
  @Input() page: any;
  @Input() image: any;
  @Input() showImage: boolean = false;
  @Input() imageHeader?: string;
  @Input() showColor: boolean = false;
  @Input() checkValues: boolean = false;
  @Input() orderCount: boolean = false;
  @Input() isActiveStatus: boolean = false;
  @Input() showToggleStatus: boolean = false;
  // status for product screen and store credit only
  @Input() viewStatus: boolean = false;
  @Input() hidePunlishOption: boolean = true;
  @Input() hidePagintation: boolean = true;
  @Input() selectedItems: any[] = [];
  // active or in-active status
  @Input() activeStatus: boolean = false;
  @Input() activeStatusOrder: boolean = false;

  // send flag to the parent componenet to open dialogs and send data
  @Output() isEditBtnClicked: EventEmitter<object> = new EventEmitter();
  @Output() isDeleteBtnClicked: EventEmitter<object> = new EventEmitter();
  @Output() isBulkDeleteBtnClicked: EventEmitter<object> = new EventEmitter();
  @Output() isDetailsBtnClicked: EventEmitter<object> = new EventEmitter();
  @Output() isSettingBtnClicked: EventEmitter<object> = new EventEmitter();
  @Output() sendTablePageSize: EventEmitter<object> = new EventEmitter();
  @Output() handleExportFiles: EventEmitter<any> = new EventEmitter();
  @Output() handleCheckedValues: EventEmitter<any> = new EventEmitter();
  @Output() handleChangeStatus: EventEmitter<any> = new EventEmitter();
  @Output() isBulkExportBtnClicked: EventEmitter<object> = new EventEmitter();
  @Output() isStatusChanged: EventEmitter<object> = new EventEmitter();
  @Output() isOpenProfileUser: EventEmitter<object> = new EventEmitter();
  @Output() OpenNewTab: EventEmitter<object> = new EventEmitter();


  @ViewChildren('menu')
  menu!: QueryList<any>;
  @ViewChild('dataTable') content: any;
  @ViewChild('p', { static: false })
  paginator!: Paginator;
  tableValues: any[] = [];
  fileName = 'ExcelSheet.xlsx';
  item: any;
  statusList: any[] = [];
  statusName: string = 'New';
  color: string = '#0E1740';
  backGroundColor: string = '#FEEFD0';
  listItems: any[] = [];
  selectedMenu: any = '';
  deletedArray: any[] = [];
  display: boolean = false;
  imageUrl: string = '';
  @Input() tableColumn: any[] = [];
  globalFilter: any[] = [];
  searchFilter: any;
  params: any;
  constructor(private _Router: Router, private renderer: Renderer2) {
    this.params = new HttpParams();
  }
  showProfile(rowData: any) {
    this.isOpenProfileUser.emit(rowData);
    console.log('rowData', rowData);
    sessionStorage.setItem('clientInRowData', JSON.stringify(rowData))

  }
  changeStatus(statusNumber: number, id: number) {
    let statusBody = {
      statusId: statusNumber,
      productId: id,
    };
    if (this.selectedItems.length !== 0) {
      this.handleChangeStatus.emit([
        { statusId: statusNumber },
        this.selectedItems,
      ]);
    } else {
      this.handleChangeStatus.emit(statusBody);
    }
  }
  checkSelection(data: any) {
    this.selectedItems = data;
    console.log(this.selectedItems);

  }

  deleteSelected() {
    this.selectedItems;
    this.isBulkDeleteBtnClicked.emit(this.selectedItems);
  }
  exportedSelected() {
    // console.log('selected selected', this.selectedItems);

    this.selectedItems;
    this.isBulkExportBtnClicked.emit(this.selectedItems);
  }

  ngOnInit(): void {

  }



  viewOrderDetails(id: any) {
    console.log(id);
    this._Router.navigateByUrl(`Dashboard/order/view-order/${id}`)


  }

  exportexcel(): void {
    let exportData = {
      data: this.tableData,
      fileName: 'Table Data',


    };
    this.handleExportFiles.emit(exportData);
    console.log(this.tableData);

  }

  edit(data: any) {
    let editEventData = {
      editFlag: true,
      data,
    };
    this.isEditBtnClicked.emit(data);
    console.log('this.edit', data);

  }

  viewDetails(data: any) {
    let detailsEventData = {
      detailsFlag: true,
      data,
    };
    this.isDetailsBtnClicked.emit(detailsEventData);
  }

  Delete(data: any) {
    let deleteEventData = {
      deleteFlag: true,
      id: data.id,
    };
    this.isDeleteBtnClicked.emit(deleteEventData);
  }

  setting(data: any) {
    this.isSettingBtnClicked.emit(data);
  }

  setMyPagination(event: any) {
    let currentPage = event.first / event.rows + 1;
    let paginator = {
      page: currentPage,
      size: event.rows,
    };
    this.sendTablePageSize.emit(paginator);
    console.log('Pageinator', paginator);

  }

  check(data: any) {
    this.handleCheckedValues.emit(data);
  }

  reset($event: any) {
    this.paginator.changePageToFirst($event);
  }

  ExpandImage(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.display = true;
  }

  switchStatus(value: any, id: number) {
    let data = {
      checked: value.checked,
      id: id,
    };
    if (this.selectedItems.length !== 0) {
      this.isStatusChanged.emit([
        { isActive: value.checked },
        this.selectedItems,
      ]);
    } else {
      this.isStatusChanged.emit(data);
      console.log('this is data changed', data);

    }
  }
}
