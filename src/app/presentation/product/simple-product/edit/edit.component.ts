import { HttpParams } from '@angular/common/http';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { finalize, retry } from 'rxjs';
import { BrandsService } from 'src/app/Services/brands.service';
import { CategoriesService } from 'src/app/Services/categories.service';
import { ProductSetsService } from 'src/app/Services/product-sets.service';
import { ProductsService } from 'src/app/Services/products.service';
import { SellerService } from 'src/app/Services/seller.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';
import { SimpleProductFormService } from '../../Services/simple-product-form.service';
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
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
  isDisabled: boolean = true;

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
  productId: any;
  variations: any;
  variationId: number = 0;
  ProductVisibility: boolean = true;
  backGroundColor: string = '';
  color: string = '';
  comment: string = '';
  reasons: any[] = [];
  Status: string = '';
  rejectionStatus: boolean = false;
  allReasons: any[] = [];
  product_set_id: any;

  @ViewChild('info', { static: false }) info: any;

  constructor(
    private _datePipe : DatePipe,
    private router: Router,
    public _SimpleProductFormService: SimpleProductFormService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private _UploadImageService: UploadImageService,
    private _ProductSetsService: ProductSetsService,
    private _BrandsService: BrandsService,
    private _SellerService: SellerService,
    private _CategoriesService: CategoriesService,
    private _ProductsService: ProductsService,
    private _Activatedroute: ActivatedRoute
  ) {

    console.log('product visibility', this.ProductVisibility);

    // this.getAll()
    this.productId = this._Activatedroute.snapshot.paramMap.get('id');
    this.paginationParams = new HttpParams();
    this.getAllAttributeSets(1);
    this.getAllBrands(1);
    this.getAllSellers(1);
    this.getAllCategories(1);
    this.getAllCategories(2);
    this.getAllCategories(3);
    this.getAllProducts(1);
    this.createItems = [
      {
        label: 'Simple',
        icon: 'pi pi-fw pi-shopping-cart',
        command: () => {},
      },
      {
        label: 'Configurable',
        icon: 'pi pi-fw pi-qrcode',
        command: () => {
          this.router.navigateByUrl(
            'Dashboard/product/create-configurable-product'
          );
        },
      },
    ];
  }
  display: boolean = false;
  changeStatus(statusId: number) {
    if (statusId !== 3) {
      this.loadingIndicator = true;
      let statusObject = {
        status: statusId,
      };
      this._SimpleProductFormService
        .changeStatus(this.productId, statusObject)
        .pipe(finalize(() => (this.loadingIndicator = false)))
        .subscribe((res: any) => {
          this.router.navigateByUrl('Dashboard/product');
        });
    } else {
      this.display = true;
    }
  }

  submitRejection() {
    this.loadingIndicator = true;
    let ReasonsIds: any[] = [];
    ReasonsIds = this.reasons?.map((value: any) => {
      if (value.isSelected) {
        return value.id;
      }
    });
    let statusObject = {
      product_reasons: ReasonsIds?.filter((value: any) => value),
      status: 3,
      product_note: this.comment,
    };
    this._SimpleProductFormService
      .changeStatus(this.productId, statusObject)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((res: any) => {
        this.display = false;
        this.router.navigateByUrl('Dashboard/product');
        this.allReasons = this.allReasons.map((reason) => {
          return {
            description_ar: reason?.description_ar,
            description_en: reason?.description_en,
            id: reason?.id,
            isSelected: false,
          };
        });
      });
  }

  cancel() {
    this.display = false;
  }

  selectedReasons: any[] = [];
  selectedReasonsID: any[] = [];
  ngOnInit(): void {
    // this._SimpleProductFormService.productForm
    // .get('categories')
    // ?.setValue(this.dataCategories);
    this.getAllReasons();
    // this._ProductsService.show(this.product)

    // this.getSelectedReasons();
  }

  getAllReasons() {
    this._SimpleProductFormService.getReasons().subscribe((reason) => {
      this.allReasons = reason.data;

      this.getSelectedReasons();
      this.allReasons = reason.data.map((value: any) => {
        return {
          description_ar: value.description_ar,
          description_en: value.description_en,
          id: value.id,
          isSelected: false,
        };
      });
    });
  }
  appendCategories : any [] = []
  dataCategories : any[] = []
  getSelectedReasons() {
    this._ProductsService.show(this.productId).subscribe((res) => {
      console.log('this is response', res);
      // console.log(res.data.categories, 'categories');
      this.appendCategories = res.data.categories;
      console.log('append categories', this.appendCategories);

       res.data.categories.forEach((category : any) => {
        this.dataCategories.push(category.id);
        // this._SimpleProductFormService.productForm.get('categories')?.setValue([category.id])
       })
       console.log(this.dataCategories);

        this.dataCategories.forEach(id => {
        // console.log('this is category id ', id);

       });

// const matcingItems = this.categoryData.filter(category => this.dataCategories.some(category2 => category2 === category.id))
// console.log('matcing items', matcingItems);

      // console.log(foundCategoriesStill);

      // if(!foundCategoriesStill) {
      //   console.log('This is true category');

      // }


      this.selectedReasons = res.data?.rejection_reasons?.reasons;
      this.selectedReasonsID = this.selectedReasons?.map(
        (reason) => reason?.id
      );
      this.allReasons = this.allReasons?.map((val: any) => {
        let found = false;
        this.selectedReasonsID?.map((Reason) => {
          if (val.id == Reason) {
            found = true;
          }
        });
        return {
          description_ar: val.description_ar,
          description_en: val.description_en,
          id: val.id,
          isSelected: found,
        };
      });

      if (res.data.status.id === 3) {
        this.rejectionStatus = true;
      }

      (this.backGroundColor =
        res.data.status.id === 1
          ? '#FEEFD0'
          : res.data.status.id === 2
          ? '#E5F6F4'
          : res.data.status.id === 4
          ? '#EFEAF1'
          : res.data.status.id === 3
          ? '#FBE8EE'
          : ''),
        (this.color =
          res.data.status.id === 1
            ? '#0E1740'
            : res.data.status.id === 2
            ? '#00A599'
            : res.data.status.id === 4
            ? '#5F2D79'
            : res.data.status.id === 3
            ? '#D92059'
            : ''),
        (this.Status =
          res.data.status.id === 1
            ? 'New'
            : res.data.status.id === 2
            ? 'Approved'
            : res.data.status.id === 4
            ? 'Published'
            : res.data.status.id === 3
            ? 'Rejected'
            : ''),
        (this.variationId = res.data.variations[0].id);

      //  fill info tab
      this.variationId = res.data.variations[0].id;
      // console.log('variationId', this.variationId);


      this.product_set_id = res.data?.product_set_id;
      this._SimpleProductFormService.productForm
        .get('brand_id')
        ?.setValue(res.data.brand.id);

        // this._SimpleProductFormService.productForm
        // .get('categories')
        // ?.setValue(this.dataCategories);
        // console.log(this.dataCategories, 'dataCategories');

        // this._SimpleProductFormService.productForm
        // .get('categories')?.updateValueAndValidity()
        // console.log('this is a simple product of categories', this._SimpleProductFormService.productForm.get('categories')?.value);
          this._SimpleProductFormService.productForm.get('categories')?.setValue(this.dataCategories)
          console.log('this is a simple product of categories for control', this._SimpleProductFormService.productForm.get('categories'));

      this._SimpleProductFormService.productForm
        .get('sku')
        ?.setValue(res.data.sku);
      this._SimpleProductFormService.productForm
        .get('title_ar')
        ?.setValue(res.data.title_ar);
      this._SimpleProductFormService.productForm
        .get('title_en')
        ?.setValue(res.data.title_en);
      this._SimpleProductFormService.productForm
        .get('seller_id')
        ?.setValue(res.data?.variations[0]?.seller_variations[0]?.seller?.id);
      this._SimpleProductFormService.productForm
        .get('price')
        ?.setValue(res.data?.variations[0]?.seller_variations[0]?.price);
      this._SimpleProductFormService.productForm
        .get('sale_price')
        ?.setValue(
            res.data?.variations[0]?.seller_variations[0]?.sale_price
              ? res.data?.variations[0]?.seller_variations[0]?.sale_price
              : 0
        );
        this._SimpleProductFormService.productForm
        .get('sale_price_start_date')
        ?.setValue(this._datePipe.transform(res.data?.variations[0]?.seller_variations[0]?.sale_price_start_date, 'YYYY-MM-dd'));
        this._SimpleProductFormService.productForm
        .get('sale_price_end_date')
        ?.setValue(this._datePipe.transform(res.data?.variations[0]?.seller_variations[0]?.sale_price_end_date, 'YYYY-MM-dd'));
      this._SimpleProductFormService.productForm
        .get('cost_price')
        ?.setValue(res.data?.variations[0]?.seller_variations[0]?.cost_price);
      this._SimpleProductFormService.productForm
        .get('barcode')
        ?.setValue(res.data?.variations[0]?.seller_variations[0]?.barcode);
      this._SimpleProductFormService.productForm.controls?.['barcode'].disable();
      this._SimpleProductFormService.productForm
        .get('country_id')
        ?.setValue(
          res.data?.variations[0]?.seller_variations[0]?.country_id.toString()
        );
      this._SimpleProductFormService.productForm
        .get('quantity')
        ?.setValue(res.data?.variations[0]?.seller_variations[0]?.quantity);
      this._SimpleProductFormService.productForm
        .get('operational_description_ar')
        ?.setValue(res.data.operational_description_ar);
      this._SimpleProductFormService.productForm
        .get('operational_description_en')
        ?.setValue(res.data.operational_description_en);
      this._SimpleProductFormService.productForm
        .get('product_set_id')
        ?.setValue(res.data.product_set_id);
      this.getAttributes(
        res.data.product_set_id,
        res.data?.variations[0].attribute_values
      );
      this._SimpleProductFormService.productForm
        .get('in_stock')
        ?.setValue(res.data?.in_stock);
      this._SimpleProductFormService.productForm
        .get('is_active')
        ?.setValue(res.data?.is_active);
      this.ProductVisibility = res.data?.is_active;
      console.log('This is the product visibility =====>', this.ProductVisibility);

      this._SimpleProductFormService.productForm
        .get('quantity_type')
        ?.setValue(
          res.data?.variations[0]?.seller_variations[0].quantity_type.id.toString()
        );

      this.url = res.data.images[0]?.url;
      this.viewImage = res.data?.images[0] ? true : false;
      this.CoverImageId = {
        id: res.data?.images[0]?.id,
        is_new: false,
      };

      this.firstSubUrl = res.data?.images[1]?.url;
      this.viewFirstSubImage = res.data?.images[1] ? true : false;
      this.firstSubImgID = {
        id: res.data?.images[1]?.id,
        is_new: false,
      };

      this.secondSubUrl = res.data?.images[2]?.url;
      this.viewSecondSubImage = res.data?.images[2] ? true : false;
      this.secondSubImgID = {
        id: res.data?.images[2]?.id,
        is_new: false,
      };

      this.thirdSubUrl = res.data?.images[3]?.url;
      this.viewThirdSubImage = res.data?.images[3] ? true : false;
      this.thirdSubImgID = {
        id: res.data?.images[3]?.id,
        is_new: false,
      };

      this.fourthSubUrl = res.data?.images[4]?.url;
      this.viewFourthSubImage = res.data?.images[4] ? true : false;
      this.fourthSubImgID = {
        id: res.data?.images[4]?.id,
        is_new: false,
      };

      this.images = [
        this.CoverImageId,
        this.firstSubImgID,
        this.secondSubImgID,
        this.thirdSubImgID,
        this.fourthSubImgID,
      ];
      this.viewImage = true;
      this.hideSubImages = false;

      // set categoris data
      let categoryLookups = {
        title_en: res.data?.categories[0]?.title_en,
        title_ar: res.data?.categories[0]?.title_ar,
        id: res.data?.categories[0]?.id,
      };
      // let foundCategories = this.categoryData.find(

      //   (lookup: any) => {
      //     lookup.id === res.data?.categories[0]?.id
      //   }

      // );
      // if (!foundCategories) {
      //   this.categoryData = [...this.categoryData, categoryLookups];
      // }
      // this._SimpleProductFormService.productForm
      //   .get('categories')
      //   ?.setValue(this.dataCategories);

      // set Brands data
      let brandLookUps = {
        title_en: res.data?.brand.title_en,
        title_ar: res.data?.brand.title_ar,
        id: res.data?.brand.id,
      };
      let foundBrands = this.brandsData.find(
        (lookup: any) => lookup.id === res.data?.brand.id
      );
      if (!foundBrands) {
        this.brandsData = [...this.brandsData, brandLookUps];
      }
      this._SimpleProductFormService.productForm
        .get('brand_id')
        ?.setValue(foundBrands?.id ?? brandLookUps.id);

      // set Attribute Set Data
      let fountAttributeSets = this.attributeSetsData.find(
        (lookup: any) => lookup.id === res.data?.product_set.id
      );
      if (!fountAttributeSets) {
        this.attributeSetsData = [
          ...this.attributeSetsData,
          res.data?.product_set,
        ];
      }
      this._SimpleProductFormService.productForm
        .get('product_set_id')
        ?.setValue(fountAttributeSets?.id ?? res.data?.product_set.id);

      // fill fulfilment-tap
      this._SimpleProductFormService.fuilfilmentForm
        .get('weight')
        ?.setValue(res.data?.variations[0]?.weight);
      this._SimpleProductFormService.fuilfilmentForm
        .get('set_quantity')
        ?.setValue(res.data?.set_quantity);
      this._SimpleProductFormService.fuilfilmentForm
        .get('warehouse_location')
        ?.setValue(res.data?.warehouse_location);
      this._SimpleProductFormService.fuilfilmentForm
        .get('trucking')
        ?.setValue(res.data?.trucking?.id?.toString());
      this._SimpleProductFormService.fuilfilmentForm
        .get('storage_conditions')
        ?.setValue(
          res.data?.storage_conditions.map((storage: any) => storage.id)
        );

      // fill marketing-tap
      this._SimpleProductFormService.marketingForm
        .get('meta_title_ar')
        ?.setValue(res.data?.meta_title_ar);
      this._SimpleProductFormService.marketingForm
        .get('meta_title_en')
        ?.setValue(res.data?.meta_title_en);
      this._SimpleProductFormService.marketingForm
        .get('url')
        ?.setValue(res.data?.slug);
      this._SimpleProductFormService.marketingForm
        .get('meta_keywords_ar')
        ?.setValue(res.data?.meta_keywords_ar);
      this._SimpleProductFormService.marketingForm
        .get('meta_keywords_en')
        ?.setValue(res.data?.meta_keywords_en);
      this._SimpleProductFormService.marketingForm
        .get('meta_description_ar')
        ?.setValue(res.data?.meta_description_ar);
      this._SimpleProductFormService.marketingForm
        .get('meta_description_en')
        ?.setValue(res.data?.meta_description_en);
      this._SimpleProductFormService.marketingForm
        .get('short_description_ar')
        ?.setValue(res.data?.short_description_ar);
      this._SimpleProductFormService.marketingForm
        .get('short_description_en')
        ?.setValue(res.data?.short_description_en);
      this._SimpleProductFormService.marketingForm
        .get('description_ar')
        ?.setValue(res.data?.description_ar);
      this._SimpleProductFormService.marketingForm
        .get('description_en')
        ?.setValue(res.data?.description_en);

      this._SimpleProductFormService.fuilfilmentForm.dirty;
      this._SimpleProductFormService.marketingForm.dirty;
      this._SimpleProductFormService.productForm.dirty;
    });
  }

  controlName!: string;
  getAttributes(setId: number, attributesData: any) {
    this.AttributesValues = [];
    let values: any[] = [];
    this._ProductsService.getAttributes(setId).subscribe((res: any) => {
      res.data.attributes.forEach((value: any) => {
        values.push(value);
        this.controlName = `_${value.id}`;
        this._SimpleProductFormService.productForm.addControl(
          `_${value.id}`,
          this._SimpleProductFormService.fb.control('', Validators.required)
        );
      });
      this.AttributesValues = [...values];
      attributesData.forEach((attribueValue: any) => {
        this._SimpleProductFormService.productForm
          .get('_' + attribueValue.attribute_id)
          ?.setValue(attribueValue.attribute_value);
      });
    });
  }

  ngOnDestroy(): void {
    this._SimpleProductFormService.fuilfilmentForm.reset();
    this._SimpleProductFormService.marketingForm.reset();
    this._SimpleProductFormService.productForm.reset();
    this._SimpleProductFormService.varationArray = [];
    this._SimpleProductFormService.basicInfo = {};
    this._SimpleProductFormService.variationsObject = {};
    let values = [];
    this._ProductsService
      .getAttributes(this.product_set_id)
      .subscribe((res: any) => {
        res.data.attributes.forEach((value: any) => {
          values.push(value);
          this._SimpleProductFormService.productForm.removeControl(
            `_${value.id}`
          );
        });
      });
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
              full_title : category.full_title,
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
        this.categoryData = [...this.categoryData, ...this.categoryAsyncedData, ...this.appendCategories];
        // console.log('category data 1: ', this.categoryData);




      });
      // console.log('i want append categories', this.appendCategories);
      // console.log('category data:', this.categoryData);

  }


  data : any[] = []

  showRejectModel(data: any) {
    this.display = true;
  }
}
