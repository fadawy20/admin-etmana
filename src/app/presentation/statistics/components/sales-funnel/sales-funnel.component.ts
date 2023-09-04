import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-sales-funnel',
  templateUrl: './sales-funnel.component.html',
  styleUrls: ['./sales-funnel.component.scss'],
})
export class SalesFunnelComponent implements OnInit, OnChanges {
  salesFunnel!: any[];
  salesActive: string = 'All';
  @Input() salesFun!: any;
  @Input() sales_funnel !: any
  sessionsNum: number = 0;
  productNum: number = 0;
  addCartNum: number = 0;
  checkoutNum: number = 0;
  purchaseNum: number = 0;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // this.salesFun = changes['salesFun'].currentValue;
    // this.sales_funnel = changes['sales_funnel'].currentValue
    this.ngOnInit();
    // console.log('sales_funnel', this.sales_funnel);
    // console.log('this.salesFun', this.salesFun);

  }
  ngOnInit(): void {


    this.addCartNum =
      this.checkoutNum =
      this.productNum =
      this.purchaseNum =
      this.sessionsNum =
      0;
    this.salesFun.forEach((ele: any) => {
      if (this.salesActive == 'logged-in') {
        if (ele.userIsLogin == 1) this.allUser(ele);
      } else if (this.salesActive == 'Guest Users') {
        if (ele.userIsLogin == 0) this.allUser(ele);
      } else {
        this.allUser(ele);
      }
    });

    this.salesFunnel = [
      { id: 1, name: 'Sessions', num: this.sessionsNum },
      { id: 2, name: 'Product view', num: this.productNum },
      { id: 3, name: 'Add to Cart', num: this.addCartNum },
      { id: 4, name: 'Checkout', num: this.checkoutNum },
      { id: 5, name: 'Purchase', num: this.sales_funnel.purchase },
    ];
  }

  allUser(ele: any) {
    // console.log('all user', ele);

    this.sessionsNum = ++this.sessionsNum;
    if (ele.addToCart == 1) ++this.addCartNum;
    if (ele.checkOut == 1) ++this.checkoutNum;
    if (ele.productView == 1) ++this.productNum;
    if (ele.purchase == 1) ++this.purchaseNum;
  }
  showData(showDataNow: any) {
    this.salesActive = showDataNow;
    this.ngOnInit();
  }
}
