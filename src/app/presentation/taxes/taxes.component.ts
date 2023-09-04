import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { TaxesService } from 'src/app/Services/taxes.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss'],
})
export class TaxesComponent implements OnInit {
  data: any;
  editModeegypt: boolean = false;
  editModesudia: boolean = false;
  egypt_tax: any;
  sudai_tax: any;
  loadingIndicator: boolean = false;

  constructor(
    private _taxesService: TaxesService,
    private messageService: MessageService
  ) {
    this.getListTaxes();
  }

  ngOnInit(): void {}
  getListTaxes() {
    this._taxesService.getTaxes().subscribe((res) => {
      this.data = res;
    });
  }

  editegypt() {
    this.editModeegypt = true;
  }

  editsudia() {
    this.editModesudia = true;
  }

  create() {
    let obj = {
      egypt_tax: this.data.egypt_tax,
      saudi_arabia_tax: this.data.saudi_arabia_tax,
    };
    this.loadingIndicator = true;
    this._taxesService
      .creatTax(obj)
      .pipe(
        finalize(() => {
          this.loadingIndicator = false;
        })
      )
      .subscribe((res) => {
        this.editModeegypt = false;
        this.editModesudia = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Taxes Updated successfully',
        });
        this.getListTaxes();
      });
  }
}
