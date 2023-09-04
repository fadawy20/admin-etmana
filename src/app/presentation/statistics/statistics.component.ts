import { DashboardService } from './../../Services/all-dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from './../../Services/firebase.service';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  isShowData: boolean = false;
  filterOptions: any[] = [];
  filterID: number = 3;
  showCalender: boolean;
  status: any;
  statusSales: any;
  dateNow: any = new Date().getMonth();
  unsubsribe: Subscription[] = [];
  filterYear: any;
  firstTImeFilter: any = 0;
  secondTImeFilter: any = 0;

  highPerformingCategories: any;
  highPerformingSellers: any;
  inventoryLevels: any;
  orderStatus: any;
  promotions: any;
  platform: any;

  oneWeek: any;
  oneMonth: any;
  filterByDateFrom: any;
  filterByDateTo: any;
  statusFunnel: any[] = []

  constructor(
    private FirebaseService: FirebaseService,
    private dashboard: DashboardService
  ) {
    this.showCalender = false;
    let permissions: any = localStorage.getItem('permissions');
    let arr: any = JSON.parse(permissions);
    arr = arr.filter((data: any) => {
      if (data.name == 'dashboard') return data;
    });
    if (arr.length >= 1) this.isShowData = true;

    this.filterOptions = [
      {
        name: 'Today',
        id: 1,
      },
      {
        name: 'This Week',
        id: 2,
      },
      {
        name: 'This Month',
        id: 3,
      },
    ];
  }

  // ** This is first **
  // getDateFilter() {
  //   const datepipe: DatePipe = new DatePipe('en-US');
  //   const now = new Date();
  //   this.filterByDateFrom = datepipe.transform(now, 'YYYY-MM-dd');
  //   const sevenDaysAgo = new Date(now);

  //   if (this.filterID == 1) {
  //     sevenDaysAgo.setDate(now.getDate() - 1);
  //     // console.log();

  //     // console.log(sevenDaysAgo.setDate(now.getDate() - 1));
  //     this.filterByDateTo = datepipe.transform(sevenDaysAgo.setDate(now.getDate() + 1), 'YYYY-MM-dd');
  //     // console.log('filterByDateTo', this.filterByDateTo);
  //     this.filterByDateFrom = datepipe.transform(sevenDaysAgo.setDate(now.getDate()), 'YYYY-MM-dd');
  //     // console.log('filterByDateFrom', this.filterByDateFrom);
  //     return {
  //       start_date: this.filterByDateFrom,
  //       end_date: this.filterByDateTo,
  //     };

  //   }

  //   else if (this.filterID == 2) sevenDaysAgo.setDate(now.getDate() - 7);
  //   else if (this.filterID == 3) sevenDaysAgo.setMonth(now.getMonth() - 1);
  //   else if (this.filterID == 4) {
  //     this.filterByDateFrom = datepipe.transform(
  //       this.filterYear[0],
  //       'YYYY-MM-dd'
  //     );
  //     this.filterByDateTo = datepipe.transform(
  //       this.filterYear[1],
  //       'YYYY-MM-dd'
  //     );
  //     // console.log(this.filterByDateFrom);
  //     // console.log(this.filterByDateTo);
  //     return {
  //       end_date: this.filterByDateTo,
  //       start_date: this.filterByDateFrom,
  //     };
  //   }
  //   this.filterByDateTo = datepipe.transform(sevenDaysAgo, 'YYYY-MM-dd');



  //   return {
  //     start_date: this.filterByDateTo,
  //     end_date: this.filterByDateFrom,
  //   };
  // }

  // ** This is updated **
  getDateFilter() {
    const datepipe: DatePipe = new DatePipe('en-US');
    const now = new Date();
    this.filterByDateFrom = datepipe.transform(now, 'YYYY-MM-dd');
    const sevenDaysAgo = new Date(now);

    if (this.filterID == 1) {
      sevenDaysAgo.setDate(now.getDate() - 1);
      // console.log();

      // console.log(sevenDaysAgo.setDate(now.getDate() - 1));
      // ** This is with pipe
      this.filterByDateTo = datepipe.transform(sevenDaysAgo.setDate(now.getDate() + 1), 'YYYY-MM-dd');
      this.filterByDateFrom = datepipe.transform(sevenDaysAgo.setDate(now.getDate()), 'YYYY-MM-dd');
      this.filterByDateTo = datepipe.transform(sevenDaysAgo.setDate(now.getDate() + 1), 'YYYY-MM-dd ');
      console.log('filterByDateFrom', new Date(this.filterByDateFrom));
      console.log('filterByDateTo', new Date(this.filterByDateTo));
      console.log('filterByDateFrom With iso', new Date(this.filterByDateFrom).toISOString());
      console.log('filterByDateTo with iso', new Date(this.filterByDateTo).toISOString());
      // ** This is with pipe
      // ** This is without pipe


      // this.filterByDateFrom = datepipe.transform(sevenDaysAgo.setDate(now.getDate()), "YYYY-MM-dd")
      // this.filterByDateTo = datepipe.transform(sevenDaysAgo.setDate(now.getDate() + 1), "YYYY-MM-dd")
      // console.log(new Date(this.filterByDateFrom), 'this.filterByDateFrom');
      // console.log(new Date(this.filterByDateTo), 'this.filterByDateTo');

      // console.log('filterByDateFrom', new Date(this.filterByDateFrom));
      // console.log('filterByDateTo', new Date(this.filterByDateTo));
      // console.log('filterByDateFrom with iso', new Date(this.filterByDateFrom).toISOString());
      // console.log('filterByDateTo with iso', new Date(this.filterByDateTo).toISOString());
      // // ** This is without pipe

      return {
        start_date: new Date(this.filterByDateFrom).toISOString(),
        end_date: new Date(this.filterByDateTo).toISOString(),
      };

    }

    else if (this.filterID == 2) sevenDaysAgo.setDate(now.getDate() - 7);
    else if (this.filterID == 3) sevenDaysAgo.setMonth(now.getMonth() - 1);
    else if (this.filterID == 4) {
      this.filterByDateFrom = datepipe.transform(
        this.filterYear[0],
        'YYYY-MM-dd'
      );
      this.filterByDateTo = datepipe.transform(
        this.filterYear[1],
        'YYYY-MM-dd'
      );
      // console.log(this.filterByDateFrom);
      // console.log(this.filterByDateTo);
      return {
        end_date: new Date(this.filterByDateTo).toISOString(),
        start_date: new Date(this.filterByDateFrom).toISOString(),
      };
    }
    this.filterByDateTo = datepipe.transform(sevenDaysAgo, 'YYYY-MM-dd');

    return {
      start_date: new Date(this.filterByDateTo).toISOString(),
      end_date: new Date(this.filterByDateFrom).toISOString(),
    };
  }

  ngOnInit(): void {
    let sub1 = this.dashboard
      .allDashboard(this.getDateFilter())
      .subscribe((data: any) => {
        this.highPerformingCategories = data['High Performing Categories'];
        this.highPerformingSellers = data['High Performing Sellers'];
        // console.log(data);
        // console.log('data', data);



        this.inventoryLevels = data['Inventory Levels'];
        this.orderStatus = data['Order Status'];
        this.promotions = data.Promotions;
        this.platform = data.Platform;
        this.statusFunnel = data['Sales Funnel']
        // console.log('platform', this.platform);

      });

    this.unsubsribe.push(sub1);

    let sub = this.FirebaseService.getStatus().subscribe((data) => {
      this.status = data;
      // console.log('data', data);

      this.statusSales = [];
      data.forEach((ele: any) => {
        this.statusSales.push(ele);
        // console.log('staus sales ', this.statusSales);

      });

      // if (this.filterID == 1) {
      //   this.statusSales = [];
      //   console.log(this.dateNow);

      //   data.forEach((ele: any) => {
      //     let userDate = this.userDateNow(new Date(ele.updatedDate)).getTime();
      //     // this.statusSales.push(ele);

      //     if (this.dateNow == userDate) {
      //       this.statusSales.push(ele);
      //     }
      //   });
      // } else if (this.filterID == 2) {
      //   this.statusSales = [];

      //   this.oneWeek = new Date().getTime();
      //   data.forEach((ele: any) => {
      //     let userDate = this.userDateNow(new Date(ele.updatedDate)).getTime();
      //     // this.statusSales.push(ele);

      //     if (this.dateNow - this.oneWeek <= userDate) {
      //       this.statusSales.push(ele);
      //     }
      //   });
      // } else if (this.filterID == 3) {
      //   this.statusSales = [];
      //   this.oneMonth = new Date().getTime();
      //   console.log(this.dateNow , this.oneMonth);

      //   data.forEach((ele: any) => {
      //     let userDate = this.userDateNow(new Date(ele.updatedDate)).getTime();
      //     this.statusSales.push(ele);

      //     // if (this.dateNow - this.oneMonth <= userDate) {
      //     //   this.statusSales.push(ele);
      //     // }
      //   });
      // }
      //  else if (this.filterID == 4) {
      //   this.statusSales = [];
      //   data.forEach((ele: any) => {
      //     let userDate =  this.userDateNow(new Date(ele.updatedDate)).getTime();

      //     if (
      //       this.firstTImeFilter <= userDate &&
      //       this.secondTImeFilter >= userDate
      //     ) {
      //       this.statusSales.push(ele);
      //       console.log("true filter");

      //     }
      //   });
      // }
    });
    this.unsubsribe.push(sub);
  }

  setFilter(id: number) {
    this.filterID = id;
    let day = new Date().getDate();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    this.dateNow = new Date(`${year} ${month} ${day}`).getTime();

    this.ngOnInit();
  }

  showCa() {
    this.filterID = 4;
    if (this.filterYear) {
      if (this.filterYear[0] != null && this.filterYear[1] != null) {
        this.firstTImeFilter = new Date(this.filterYear[0]).getTime();
        this.secondTImeFilter = new Date(this.filterYear[1]).getTime();
        this.ngOnInit();
      }
    }
  }

  userDateNow(ele: any) {
    let dayUser = ele.getDate();
    let monthUser = ele.getMonth();
    let yearUser = ele.getFullYear();
    let userDate = new Date(`${yearUser} ${monthUser} ${dayUser}`);
    return userDate;
  }

  ngOnDestroy(): void {
    this.unsubsribe.forEach((unsub) => {
      unsub.unsubscribe();
    });
  }
}
