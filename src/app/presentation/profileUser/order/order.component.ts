import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/Services/order.service';
import { ProfileService } from 'src/app/Services/profileUser/profile.service';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  loader: boolean = true
  num: number = 0

  id!: number;
  orderClients: any[] = []

  summaryClients: any[] = []
  currency: any

  constructor(
    // private _OrdersService: OrdersService,
    private _OrderService: OrderService,
    private ActivatedDRoute: ActivatedRoute,
    private _Router: Router,
    private _profileService: ProfileService,
    private _authService: AuthService

  ) {

    this.currency = this._authService.currency

    setTimeout(() => {
      this.loader = false
    }, 800);
    this._profileService.observable.next(
      Number(this.ActivatedDRoute.snapshot.paramMap.get('id'))
    );


  }

  ngOnInit(): void {
    this.id = Number(this.ActivatedDRoute.snapshot.paramMap.get('id'))
    // console.log('this.id in order', this.id);
    this.getClientOrders()

  }

  getClientOrders() {
    this._OrderService.getClientOrdersById(this.id).subscribe((res) => {
      // console.log('ordersClient', res.data.orders);
      console.log(res);
      const thisNum = res.data.summary.avg_order_size_amount
      this.num = parseFloat(thisNum)
      console.log('num', typeof this.num);

      this.orderClients = res.data.orders
      this.num = res.data.orders
      // console.log('num', this.num);

      // console.log(this.orderClients);


      this.summaryClients.push({
        ...res.data.summary,
      })
      // console.log('summaryClients', this.summaryClients);

    })
  }

  viewOrderDetails(id: number) {
    console.log(id);

    this._Router.navigateByUrl(`Dashboard/order/view-order/${id}`)
    // this._Router.navigate([''])
  }


  getAllOrders() {
    // this._OrdersService.getAllOrders().subscribe((res) => {
    //   this.orders = res.data.map((data: any) => {
    //     this.allOrder.push({
    //       orderId: data.id,
    //       sendBy: data.purchase_point.name,
    //       statusOrder: data.status.name,
    //       totalOrderPrice: data.total_price,
    //     });
    //     return {
    //       ...data,
    //       formattedDate: this.datePipe.transform(
    //         data.created_at,
    //         'E  d  MMM  '
    //       ),
    //     };
    //   });

    //   let obj = {
    //     username: this.userName,
    //     order: this.allOrder,
    //     plateForm: 'Web',
    //   };

    //   this.analytics.logEvent('viewOrder', {
    //     viewOrder: JSON.stringify(obj),
    //   });
    // });
  }


}
