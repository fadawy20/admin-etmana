import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-custom-data-table',
  templateUrl: './custom-data-table.component.html',
  styleUrls: ['./custom-data-table.component.scss'],
})
export class CustomDataTableComponents implements OnInit {
  @Input() tableHeaders: any[] = [];
  @Input() tableData: any;
  @Input() loadingIndicator: boolean = false;
  @Input() Message: string = 'Loading...';
  @Input() totalItems: any;
  @Input() page: any;
  @Input() imageHeader?: string;
  @Input() hidePagintation: boolean = true;
  @Input() selectedItems: any[] = [];

  // send flag to the parent componenet to open dialogs and send data
  @Output() sendTablePageSize: EventEmitter<object> = new EventEmitter();
  @Output() handleSelectedProduct: EventEmitter<any> = new EventEmitter();

  @ViewChildren('menu')
  menu!: QueryList<any>;

  @ViewChild('dataTable') content: any;

  @ViewChild('p', { static: false })
  paginator!: Paginator;
  selectedProducts: any[] = [];
  Products: any[] = [];
  tableValues: any[] = [];
  item: any;
  statusList: any[] = [];
  statusName: string = 'New';
  color: string = '#0E1740';
  backGroundColor: string = '#FEEFD0';
  listItems: any[] = [];
  selectedMenu: any = '';
  constructor() {
    this.addItem();
  }

  ngOnInit(): void {}

  setMyPagination(event: any) {
    // console.log();
console.log('this.myPagination', event);

    let currentPage = event.first / event.rows + 1; // this is the current page
    let paginator = {
      page: currentPage,
      size: event.rows,
    };
    this.sendTablePageSize.emit(paginator);
  }
  addItem() {
    this.selectedProducts = this.Products.map((Product: any) => {
      return {
        sku: Product.sku,
        image: Product.image,
        name: Product.name,
        brand: Product.brand,
        minPrice: Product.minPrice,
        stock: Product.stock,
        variation: Product.variation,
        quantity: +Product.quantity,
        id: Product.id,
        productId:Product.productId
      };
    });
    this.handleSelectedProduct.emit(this.selectedProducts);
  }
}
