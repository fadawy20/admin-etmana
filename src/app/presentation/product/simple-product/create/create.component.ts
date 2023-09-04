import { HttpParams } from '@angular/common/http';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { finalize } from 'rxjs';
import { BrandsService } from 'src/app/Services/brands.service';
import { CategoriesService } from 'src/app/Services/categories.service';
import { ProductSetsService } from 'src/app/Services/product-sets.service';
import { ProductsService } from 'src/app/Services/products.service';
import { SellerService } from 'src/app/Services/seller.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  createItems: any[];
  public tabName: string = 'info';
  viewImage: boolean = false;
  submitted: boolean = false;
  isColor!: boolean;
  isPattern: boolean = false;
  isSingleSlect: boolean = false;
  isMutliSelect: boolean = false;
  isDropDown: boolean = false;
  isSwitch: boolean = false;
  isTextField: boolean = false;
  AttributesValues: any[] = [];
  images: any[] = [];
  isDisabled: boolean = false;

  current: number = 1;
  brandCurrent: number = 1;
  sellerCurrent: number = 1;
  categoryCurrent: number = 1;
  next: string = '';
  brandNext: string = '';
  sellertNxet: string = '';
  categoryNext: string = '';
  productNext: string = '';
  productCurrent: number = 1;
  asyncData: any;
  brandsAsyncData: any;
  sellerAsyncedData: any;
  categoryAsyncedData: any;
  productAsyncedData: any;
  productData: any[] = [];
  attributeSetsData: any[] = [];
  brandsData: any[] = [];
  sellersData: any[] = [];
  categoryData: any[] = [];
  paginationParams: any;
  loadingIndicator: boolean = false;
  hideSubImages: boolean = true;
  ProductVisibility: boolean = false;
  attributeSetId: number = 0
  @ViewChild('info', { static: false }) info: any;
  constructor(
    private router: Router,
    public _SimpleProductFormService: SimpleProductFormService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private _UploadImageService: UploadImageService,
    private _ProductSetsService: ProductSetsService,
    private _BrandsService: BrandsService,
    private _SellerService: SellerService,
    private _CategoriesService: CategoriesService,
    private _ProductsService: ProductsService
  ) {

    this._SimpleProductFormService.productForm.get('is_active')?.setValue(this.ProductVisibility)
    console.log(this._SimpleProductFormService.productForm.get('is_active')?.value);

    this.paginationParams = new HttpParams();
    this.getAllAttributeSets(1);
    this.getAllBrands(1);
    this.getAllSellers(1);
    this.getAllCategories(1);
    this.getAllProducts(1);
    this.createItems = [
      {
        label: 'Simple', icon: 'pi pi-fw pi-shopping-cart',
        command: () => {
        }
      },
      {
        label: 'Configurable', icon: 'pi pi-fw pi-qrcode',
        command: () => {
          this.router.navigateByUrl('Dashboard/product/create-configurable-product');
        }
      }
    ]
  }

  submitedForm(value: any) {
    this.isDisabled = value;
  }

  setValue(data: any) {
    this.AttributesValues = [...data];
  }


  clickTab(tabName: string) {
    this.tabName = tabName;
    this.info.createObject();
  }

  navigate() {
    this.router.navigateByUrl('Dashboard/product');
  }

  ngOnInit(): void {
    this._SimpleProductFormService.productForm.dirty;
    this._SimpleProductFormService.fuilfilmentForm.dirty;
    this._SimpleProductFormService.marketingForm.dirty;
  }


  setSetID(id: number) {
    this.attributeSetId = id
  }

  ngOnDestroy(): void {
    this._SimpleProductFormService.fuilfilmentForm.reset();
    this._SimpleProductFormService.marketingForm.reset();
    this._SimpleProductFormService.productForm.reset();
    this._SimpleProductFormService.varationArray = [];
    this._SimpleProductFormService.basicInfo = {};
    this._SimpleProductFormService.variationsObject = {};
    if (this.attributeSetId !== 0) {
      let values = []
      this._ProductsService.getAttributes(this.attributeSetId).subscribe((res: any) => {
        res.data.attributes.forEach((value: any) => {
          // values.push(value)
          this._SimpleProductFormService.productForm.removeControl(`_${value.id}`)
        })
      })
    }
  }


  // main image
  imagePath: string = '';
  url: any;
  CoverImageId: any;

  uploadCoverIamge(file: any) {
    const files = file.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error uploading file',
        detail: 'Only images are supported.',
      });
      return;
    } else {
      if (files.length > 0) {
        const File: any = file.target.files[0];
        const formData = new FormData();
        formData.append('file', File);
        this._UploadImageService
          .uploadImage(formData)
          .subscribe((data: any) => {
            formData.delete('file');
            this.CoverImageId = { id: data.id, is_new: true };
            this.hideSubImages = false;
            this.images = [
              this.CoverImageId,
              this.firstSubImgID,
              this.secondSubImgID,
              this.thirdSubImgID,
              this.fourthSubImgID,
            ];
            const reader = new FileReader();
            this.imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
              this.url = reader.result;
              this.viewImage = true;
            };
          });
      }
    }
  }

  // first sub image
  firstSubImgPath: string = '';
  firstSubUrl: any;
  viewFirstSubImage: boolean = false;
  firstSubImgID: any;

  uploadIamgeSub1(file: any) {
    const files = file.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error uploading file',
        detail: 'Only images are supported.',
      });
      return;
    } else {
      if (files.length > 0) {
        const File: any = file.target.files[0];
        const formData = new FormData();
        formData.append('file', File);
        this._UploadImageService
          .uploadImage(formData)
          .subscribe((data: any) => {
            formData.delete('file');
            this.firstSubImgID = { id: data.id, is_new: true };
            this.images = [
              this.CoverImageId,
              this.firstSubImgID,
              this.secondSubImgID,
              this.thirdSubImgID,
              this.fourthSubImgID,
            ];
            const reader1 = new FileReader();
            this.firstSubImgPath = files;
            reader1.readAsDataURL(files[0]);
            reader1.onload = (_event) => {
              this.firstSubUrl = reader1.result;
              this.viewFirstSubImage = true;
            };
          });
      }
    }
  }

  // second sub image
  SecondSubImgPath: string = '';
  secondSubUrl: any;
  viewSecondSubImage: boolean = false;
  secondSubImgID: any;

  uploadIamgeSub2(file: any) {
    const files = file.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error uploading file',
        detail: 'Only images are supported.',
      });
      return;
    } else {
      if (files.length > 0) {
        const File: any = file.target.files[0];
        const formData = new FormData();
        formData.append('file', File);
        this._UploadImageService
          .uploadImage(formData)
          .subscribe((data: any) => {
            formData.delete('file');
            this.secondSubImgID = { id: data.id, is_new: true };
            this.images = [
              this.CoverImageId,
              this.firstSubImgID,
              this.secondSubImgID,
              this.thirdSubImgID,
              this.fourthSubImgID,
            ];
            const reader1 = new FileReader();
            this.SecondSubImgPath = files;
            reader1.readAsDataURL(files[0]);
            reader1.onload = (_event) => {
              this.secondSubUrl = reader1.result;
              this.viewSecondSubImage = true;
            };
          });
      }
    }
  }

  // third sub image
  thirdSubImgPath: string = '';
  thirdSubUrl: any;
  viewThirdSubImage: boolean = false;
  thirdSubImgID: any;
  uploadIamgeSub3(file: any) {
    const files = file.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error uploading file',
        detail: 'Only images are supported.',
      });
      return;
    } else {
      if (files.length > 0) {
        const File: any = file.target.files[0];
        const formData = new FormData();
        formData.append('file', File);
        this._UploadImageService
          .uploadImage(formData)
          .subscribe((data: any) => {
            formData.delete('file');
            this.thirdSubImgID = { id: data.id, is_new: true };
            this.images = [
              this.CoverImageId,
              this.firstSubImgID,
              this.secondSubImgID,
              this.thirdSubImgID,
              this.fourthSubImgID,
            ];
            const reader1 = new FileReader();
            this.thirdSubImgPath = files;
            reader1.readAsDataURL(files[0]);
            reader1.onload = (_event) => {
              this.thirdSubUrl = reader1.result;
              this.viewThirdSubImage = true;
            };
          });
      }
    }
  }

  // third sub image
  fourthSubImgPath: string = '';
  fourthSubUrl: any;
  viewFourthSubImage: boolean = false;
  fourthSubImgID: any;

  uploadIamgeSub4(file: any) {
    const files = file.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error uploading file',
        detail: 'Only images are supported.',
      });
      return;
    } else {
      if (files.length > 0) {
        const File: any = file.target.files[0];
        const formData = new FormData();
        formData.append('file', File);
        this._UploadImageService
          .uploadImage(formData)
          .subscribe((data: any) => {
            formData.delete('file');
            this.fourthSubImgID = { id: data.id, is_new: true };
            this.images = [
              this.CoverImageId,
              this.firstSubImgID,
              this.secondSubImgID,
              this.thirdSubImgID,
              this.fourthSubImgID,
            ];
            const reader1 = new FileReader();
            this.fourthSubImgPath = files;
            reader1.readAsDataURL(files[0]);
            reader1.onload = (_event) => {
              this.fourthSubUrl = reader1.result;
              this.viewFourthSubImage = true;
            };
          });
      }
    }
  }

  changeTabName(value: string) {
    this.tabName = value;
  }

  // products Scroll
  handleProductScrollEvent() {
    this.productCurrent++;
    this.getAllProducts(this.productCurrent);
  }
  getAllProducts(page: number) {
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this._ProductsService.get(this.paginationParams).subscribe((products) => {
      this.productNext = products.links.next;
      this.productAsyncedData = products.data
        .map((products: any) => {
          return {
            title_en: products.title_en,
            title_ar: products.title_ar,
            id: products.id,
          };
        })
        .filter((productAsyncedData: any) => {
          return !this.productData.find(
            (atts) => atts.id === productAsyncedData.id
          );
        });
      this.productData = [...this.productData, ...this.productAsyncedData];
    });
  }

  // brands scroll
  handleBrandScrollEvent() {
    this.brandCurrent++;
    let paginator = {
      page: this.brandCurrent,
      size: 200,
    };
    this.getAllBrands(this.brandCurrent);
  }
  getAllBrands(page: number) {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this._BrandsService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands) => {
        this.brandNext = brands.links.next;
        this.asyncData = brands.data
          .map((brand: any) => {
            return {
              title_en: brand.title_en,
              title_ar: brand.title_ar,
              id: brand.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.brandsData.find((atts) => atts.id === asyncedData.id);
          });
        this.brandsData = [...this.brandsData, ...this.asyncData];
      });
  }

  // attrribute set scroll
  handleScrollEvent() {
    this.current++;
    let paginator = {
      page: this.current,
      size: 200,
    };
    this.getAllAttributeSets(this.current);
  }
  getAllAttributeSets(page: number) {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this._ProductSetsService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((atts) => {
        this.next = atts.links.next;
        this.asyncData = atts.data
          .map((attribute: any) => {
            return {
              title_en: attribute.title_en,
              title_ar: attribute.title_ar,
              id: attribute.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.attributeSetsData.find(
              (atts) => atts.id === asyncedData.id
            );
          });
        this.attributeSetsData = [...this.attributeSetsData, ...this.asyncData];
      });
  }

  // sellers scroll
  handleSellerScrollEvent() {
    this.sellerCurrent++;
    let paginator = {
      page: this.sellerCurrent,
      size: 200,
    };
    this.getAllSellers(this.sellerCurrent);
  }

  getAllSellers(page: number) {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this._SellerService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((sellers: any) => {
        this.sellertNxet = sellers.links.next;
        this.sellerAsyncedData = sellers.data
          .map((seller: any) => {
            return {
              name: seller.name,
              id: seller.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.sellersData.find((atts) => atts.id === asyncedData.id);
          });
        this.sellersData = [...this.sellersData, ...this.sellerAsyncedData];
      });
  }

  // category scroll
  handleCategoriesScrollEvent() {
    this.categoryCurrent++;
    this.getAllCategories(this.categoryCurrent);
  }

  getAllCategories(page: number) {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', page);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this._CategoriesService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((categories) => {
        this.categoryNext = categories.links.next;
        this.categoryAsyncedData = categories.data
          .map((category: any) => {
            return {
              full_title: category.full_title,
              title_en: category.title_en,
              title_ar: category.title_ar,
              id: category.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.categoryData.find(
              (atts) => atts.id === asyncedData.id
            );
          });
        this.categoryData = [...this.categoryData, ...this.categoryAsyncedData];
        console.log('category data', this.categoryData);

      });
  }
  inputSwitchStatus(value: any) {
    console.log(this.ProductVisibility);
    this._SimpleProductFormService.productForm.get('is_active')?.setValue(this.ProductVisibility)
    console.log(this._SimpleProductFormService.productForm.get('is_active')?.value, '>>>>>>>>');


  }



}
