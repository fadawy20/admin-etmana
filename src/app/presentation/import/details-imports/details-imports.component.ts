import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  catchError,
  finalize,
  map,
  observable,
  Observable,
  throwError,
} from 'rxjs';
import { DetailsImportedService } from 'src/app/Services/details-imported.service';
import { ImportsService } from 'src/app/Services/imports.service';
import { UploadService } from 'src/app/Services/upload.service';

@Component({
  selector: 'app-details-imports',
  templateUrl: './details-imports.component.html',
  styleUrls: ['./details-imports.component.scss'],
})
export class DetailsImportsComponent implements OnInit {
  status: string = 'Success';
  statusId!: number;
  faildStatus: string =
    'color:red;backgroundColor:rgba(250, 76, 76, 0.5);borderRadius:.5rem;padding:.5rem';
  SuccessStatus: string =
    'color:green;backgroundColor:rgba(119, 196, 125, 0.5);borderRadius:.5rem;padding:.5rem';
  editModeOn: boolean = false;
  display: boolean = false;
  submitted: boolean = false;
  btnLoader: boolean = false;
  nameOfFile: any;
  details: any;
  @Input() data$: any;
  idImport!: any;
  importData: any;
  errorsMsg: any[] = [];
  Comments: any;

  constructor(
    private _router: Router,
    private _importedDetailsService: DetailsImportedService,
    private _activateRoute: ActivatedRoute,
    private _importsService: ImportsService,
    private _uploadService: UploadService,
    private _MessageService: MessageService,
    private _http: HttpClient
  ) {
    this.idImport = this._activateRoute.snapshot.paramMap.get('id');
    this.getDetailImport();
  }

  file: any;
  attributeId: number = 0;
  getDetailImport() {
    return this._importedDetailsService
      .show(this.idImport)
      .subscribe((importDetails) => {
        this.file = importDetails.data?.file;
        this.errorsMsg = importDetails.data?.errors_list;
        let detail = importDetails?.data;
        this.attributeId = detail.productSet?.id;
        this.importData = {
          id: detail?.id,
          name: detail?.name,
          status: detail?.status?.id,
          imported_by: detail?.imported_by,
          attribut_set: detail?.productSet?.title_en,
          data_modified: detail?.import_by?.last_login_at,
        };
      });
  }
  // deleteItem(id: number) {
  //   this.idImport = id;
  //   this._importedDetailsService.deleteitem(this.idImport).subscribe((res) => {
  //     this._router.navigateByUrl('Dashboard/import');
  //   });
  // }
  returnImports() {
    this._router.navigateByUrl('Dashboard/import');
  }

  downloadFile() {
    window.open(this.file);
    // this._importsService.getData(this.attributeId).subscribe((res) => {
    //   this.download(res, res.type);
    // });
  }

  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
    this.nameOfFile = url.substring(5);
  }
  loader: boolean = false;

  onFileSelect(event: any) {
    this.loader = true;

    if (event.target.files.length > 0) {
      const formData = new FormData();
      let xlsx = [...event.target.files].find((file: any) =>
        file.name.toLocaleLowerCase().endsWith('.xlsx')
      );
      let zip = [...event.target.files].find((file: any) =>
        file.name.toLocaleLowerCase().endsWith('.zip')
      );
      if (typeof xlsx !== 'undefined' || typeof zip !== 'undefined') {
        formData.append('file', xlsx);
        // formData.append('images', zip);
        this._uploadService
          .uploadFile(formData, this.idImport)
          .subscribe(
            (response) => {
              this._MessageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File is uploaded  Successfully',
              });
              console.log(response);
              
            },
            (error) => {
              this.errorsMsg = error.error.errors;
            }
          )
          .add(() => {
            this.loader = false;
            this.display = false;
          });
      }
    }
  }

  ngOnInit(): void {}
}
