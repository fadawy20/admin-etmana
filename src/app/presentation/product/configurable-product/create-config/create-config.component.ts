import { HttpParams } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { finalize } from 'rxjs';
import { BrandsService } from 'src/app/Services/brands.service';
import { CategoriesService } from 'src/app/Services/categories.service';
import { ProductSetsService } from 'src/app/Services/product-sets.service';
import { ProductsService } from 'src/app/Services/products.service';
import { SellerService } from 'src/app/Services/seller.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';

@Component({
  selector: 'app-create-config',
  templateUrl: './create-config.component.html',
  styleUrls: ['./create-config.component.scss'],
})
export class CreateConfigComponent implements OnInit {
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
  variationsDisplay: any[] = [];
  ProductVisibility: boolean = false;
  product_set_id: number = 0
  @ViewChild('tab', { static: false }) tab: any;
  constructor(
    private router: Router,
    public _productForm: SimpleProductFormService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private _UploadImageService: UploadImageService,
    private _ProductSetsService: ProductSetsService,
    private _BrandsService: BrandsService,
    private _SellerService: SellerService,
    private _CategoriesService: CategoriesService,
    private _ProductsService: ProductsService,
    private confirmationService: ConfirmationService
  ) {
    this._productForm.productForm.get('is_active')?.setValue(this.ProductVisibility)
    // console.log(this._productForm.productForm.get('is_active')?.value);

    this.paginationParams = new HttpParams();
    this.getAllAttributeSets(1);
    this.getAllBrands(1);
    this.getAllSellers(1);
    this.getAllCategories(1);
    this.getAllProducts(1);
    this._productForm.productForm.get('in_stock')?.setValue(true)
    this.createItems = [
      {
        label: 'Simple', icon: 'pi pi-fw pi-shopping-cart',
        command: () => {
          this.router.navigateByUrl('Dashboard/product/create-simple-product');
        }
      },
      {
        label: 'Configurable', icon: 'pi pi-fw pi-qrcode',
        command: () => {
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
    this.createObject()
    this.tab.createObject()
  }

  navigate() {
    this.router.navigateByUrl('Dashboard/product');
  }

  ngOnInit(): void {
    this._productForm.productForm.dirty;
    this._productForm.fuilfilmentForm.dirty;
    this._productForm.marketingForm.dirty;
  }



  // add to grid function
  addToGrid(value: any) {
    this.variationsDisplay = value;
  }

  saveProduct() {
    this.submitted = true;
    this._productForm.varationArray = [];
    this.variationsDisplay.forEach((value: any) => {
      let attributes = value.variation.map((attribute: any) => {
        return {
          attribute_id: attribute.attribute_id,
          attribute_value: attribute.id,
        };
      });
      this._productForm.variationsObject = {
        ...this._productForm.variationsObject,
        price: value.price,
        //  categories: value.categories,
        // categories: [this._productForm.productForm.get('categories')?.value],


        cost_price: value.cost_price,
        sku: value.sku,
        sale_price: value.sale_price,
        sale_price_start_date: value.sale_price_start_date,
        sale_price_end_date: value.sale_price_end_date,
        barcode: value.barcode,
        quantity: value.quantity,
        quantity_type: Number(
          this._productForm.productForm.get('quantity_type')?.value
        ),
        visibility: this.ProductVisibility,
        in_stock: this._productForm.productForm.get('in_stock')?.value,
        images: value.images,
        attributes: [...attributes],
      };
      this._productForm.varationArray.push(this._productForm.variationsObject);
      console.log('this is productFrom variations objects', this._productForm.variationsObject);

    });
    if (this._productForm.productForm.invalid) {
      this.loadingIndicator = false;
      console.log(this._productForm.productForm);

      return;
    } else {
      if (this.images.length !== 0) {
        this.confirmationService.confirm({
          message:
            ' if you submited the product you will redirect to the main page',
          header: 'Are you Sure You want to Submit the Product ?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.createObject();
            this._productForm
              .createProduct()
              .pipe(
                finalize(() => {
                  this.loadingIndicator = false;
                })
              )
              .subscribe((data: any) => {

                this.messageService.add({
                  severity: 'success',
                  summary: 'success',
                  detail: 'this Product has been successfully created',
                });
                setTimeout(() => {
                  this.router.navigateByUrl('Dashboard/product');
                }, 1500);
              });
          },
          reject: () => {
            this.createObject();
            this.isDisabled = true
            this.tabName = 'fulifilment';
          },
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading file',
          detail: 'Please Select Cover image to upload',
        });
      }
    }
  }

  createObject() {
    this._productForm.basicInfo = {
      ...this._productForm.basicInfo,
      country_id: Number(
        this._productForm.productForm.get('country_id')?.value
      ),
      brand_id: this._productForm.productForm.get('brand_id')?.value,
      product_set_id:
        this._productForm.productForm.get('product_set_id')?.value,
      type: 2,
      seller_id: this._productForm.productForm.get('seller_id')?.value,
      title_ar: this._productForm.productForm.get('title_ar')?.value,
      title_en: this._productForm.productForm.get('title_en')?.value,
      operational_description_ar: this._productForm.productForm.get(
        'operational_description_ar'
      )?.value,
      operational_description_en: this._productForm.productForm.get(
        'operational_description_en'
      )?.value,
      images: this.images.filter((img: any) => img),
      categories: this._productForm.productForm.get('categories')?.value,
      sku: this._productForm.productForm.get('sku')?.value,
    };
    console.log('basic info ,  this._productForm.basicInfo', this._productForm.basicInfo);

  }

  reset() {
    this._productForm.productForm.reset()
    this.AttributesValues = []
    this.submitted = false
    this.variationsDisplay = []
  }

  uploadImageVariation(index: number, file: any) {
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
            const reader1 = new FileReader();
            // this.firstSubImgPath = files;
            this.variationsDisplay[index].images = [
              { is_new: true, id: data.id },
            ];
            reader1.readAsDataURL(files[0]);
            reader1.onload = (_event) => {
              this.variationsDisplay[index].url = reader1.result;
              this.variationsDisplay[index].viewImage = true;
            };
          });
      }
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
      });
  }


  getAttrId(id: any) {
    this.product_set_id = id
  }

  ngOnDestroy(): void {
    this._productForm.fuilfilmentForm.reset();
    this._productForm.marketingForm.reset();
    this._productForm.productForm.reset();
    this._productForm.varationArray = [];
    this._productForm.basicInfo = {};
    this._productForm.variationsObject = {};
    let values = []
    if (this.product_set_id !== 0) {
      this._ProductsService.getAttributes(this.product_set_id).subscribe((res: any) => {
        res.data.attributes.forEach((value: any) => {
          values.push(value)
          this._productForm.productForm.removeControl(`_${value.id}`)
        })
      })
    }
  }

  indexImage: number = 0;
  showImage: boolean = false;
  subImageSend: any;
  arrOfSubImages: any[] = [];
  originalImg: any[] = [];
  openPopupImage(i: number) {
    this.showImage = true;
    this.indexImage = i;
  }

  uploadImageVariation1(file: any) {
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
            const reader1 = new FileReader();
            // this.firstSubImgPath = files;
            this.variationsDisplay[this.indexImage].images[0] = {
              id: data.id,
              is_new: true,
            };

            reader1.readAsDataURL(files[0]);
            reader1.onload = (_event) => {
              this.variationsDisplay[this.indexImage].url = reader1.result;
              this.variationsDisplay[this.indexImage].viewImage = true;
            };
          });
      }
    }
  }

  subImage(index: number, file: any) {
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

            const readerImg = new FileReader();
            // this.firstSubImgPath = files;
            readerImg.readAsDataURL(files[0]);
            readerImg.onload = (_event) => {
              this.subImageSend = {
                id: data.id,
                is_new: true,
                url: readerImg.result,
              };
              this.variationsDisplay[this.indexImage].images[index] = {
                ...this.subImageSend,
              };
            };
          });
      }
    }
  }

  testProductStatus(value: any) {
    console.log(this.ProductVisibility);
    this._productForm.productForm.get('is_active')?.setValue(this.ProductVisibility)
    console.log(this._productForm.productForm.get('is_active')?.value, '????????');


  }
}
