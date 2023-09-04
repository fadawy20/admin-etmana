import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ReportsService } from 'src/app/Services/reports.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
export enum controlKeys {
  date_from = 'date_from',
  date_to = 'date_to',
  type = 'type',
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  reportsType: any[] = [];
  reportForm: FormGroup;
  submitted: boolean = false;
  loadingIndicator: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _MessageService: MessageService,
    private datePipe: DatePipe,
    private ReportsService: ReportsService,
    private http: HttpClient
  ) {
    this.reportForm = this.fb.group({
      [controlKeys.date_from]: ['', [Validators.required]],
      [controlKeys.date_to]: ['', [Validators.required]],
      [controlKeys.type]: ['', [Validators.required]],
    });
    this.reportsType = [
      // {
      //   type: 'Order Report',
      //   endPoint: 'orders',
      // },
      {
        type: 'Order report summary',
        endPoint: 'orders',
      },
      {
        type: 'Shippment Report',
        endPoint: 'shipments',
      },
      {
        type: 'Store Credit Report',
        endPoint: 'store-credits',
      },
      {
        type: 'Export Sales Report',
        endPoint: 'sales',
      },
      {
        type: 'Customer Services Report',
        endPoint: 'customer-service',
      },
      // {
      //   type: 'Product Success Rate Report',
      //   endPoint: 'product-success-rate',
      // },
      // {
      //   type: 'Customer Loyalty Report',
      //   endPoint: 'customer-loyalty',
      // },
      // {
      //   type: 'Inventory Restock Analysis Report',
      //   endPoint: 'customer-loyalty',
      // },
    ];
  }

  ngOnInit(): void { }
  click() {
    console.log(this.reportForm.value.type);
  }

  testChange(value: any) {
    console.log('value', value);
    console.log(this.reportForm.value.type);

  }
  // applyReport() {
  //   // console.log();

  //   this.submitted = true;
  //   if (this.reportForm.invalid) {
  //     this.loadingIndicator = false;
  //     return;
  //   } else {
  //     this.loadingIndicator = true;
  //     let dateFrom = this.datePipe.transform(
  //       this.reportForm.value.date_from,
  //       'yyyy-MM-dd'
  //     );
  //     let dateTo = this.datePipe.transform(
  //       this.reportForm.value.date_to,
  //       'yyyy-MM-dd'
  //     );
  //     let reportType = this.reportForm.value.type.endPoint;
  //     // console.log(this.reportForm);
  //     // console.log(this.reportForm.value.type.endPoint);



  //     this.ReportsService.downloadReport(reportType, dateFrom, dateTo)
  //       .pipe(finalize(() => (this.loadingIndicator = false)))
  //       .subscribe((data) => {
  //         this._MessageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'File is downloading successfully',
  //         });
  //         this.download(data, data.type, this.reportForm.value.type.type);
  //       });
  //   }
  // }
  applyReport() {
    // console.log();

    this.submitted = true;
    if (this.reportForm.invalid) {
      this.loadingIndicator = false;
      return;
    } else {
      this.loadingIndicator = true;
      let dateFrom = this.datePipe.transform(
        this.reportForm.value.date_from,
        'yyyy-MM-dd'
      );
      let dateTo = this.datePipe.transform(
        this.reportForm.value.date_to,
        'yyyy-MM-dd'
      );
      let reportType = this.reportForm.value.type.endPoint;
      // console.log(this.reportForm);
      // console.log(this.reportForm.value.type.endPoint);

      if (this.reportForm.value.type.type === 'Order report summary') {
        // console.log('you are right now');
        this.ReportsService.downloadReportSummary('report-summary', dateFrom, dateTo)
          .pipe(finalize(() => (this.loadingIndicator = false)))
          .subscribe((data) => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'File is downloading successfully',
            });
            this.download(data, data.type, this.reportForm.value.type.type);
          });


      } else if (this.reportForm.value.type.type === 'Inventory Restock Analysis Report') {
        this.ReportsService.downloadInventoryRestock(dateFrom, dateTo)
          .pipe(finalize(() => this.loadingIndicator = false))
          .subscribe((data) => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'File is downloading successfully',
            });
            this.download(data, data.type, this.reportForm.value.type.type);

          })
      } else if (this.reportForm.value.type.type === 'Customer Loyalty Report') {
        this.ReportsService.downloadCustomerLoyalty(dateFrom, dateTo)
          .pipe(finalize(() => this.loadingIndicator = false))
          .subscribe((data) => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'File is downloading successfully',
            });
            this.download(data, data.type, this.reportForm.value.type.type);

          })
      } else if (this.reportForm.value.type.type === 'Product Success Rate Report') {
        this.ReportsService.downloadSuccessRate(dateFrom, dateTo)
          .pipe(finalize(() => this.loadingIndicator = false))
          .subscribe((data) => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'File is downloading successfully',
            });
            this.download(data, data.type, this.reportForm.value.type.type);

          })
      }
      else {
        this.ReportsService.downloadReport(reportType, dateFrom, dateTo)
          .pipe(finalize(() => (this.loadingIndicator = false)))
          .subscribe((data) => {

            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'File is downloading successfully',
            });
            this.download(data, data.type, this.reportForm.value.type.type);
          });
      }


    }
  }

  // download(data: any, type: string, fileName: string) {
  //   const blob = new Blob([data], { type });
  //   // const url = window.URL.createObjectURL(blob);
  //   // window.open(url);
  //   // const fileName = 'myfile.xlsx';
  //   saveAs(blob, `${fileName}.xlsx`);
  // }
  download(data: any, type: string, fileName: string) {
    const blob = new Blob([data], { type });
    // const url = window.URL.createObjectURL(blob);
    // window.open(url);
    // const fileName = 'myfile.xlsx';
    saveAs(blob, `${fileName}.xlsx`);
  }
}
