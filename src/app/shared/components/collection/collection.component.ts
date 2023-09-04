import { HttpParams } from '@angular/common/http';
import { BootstrapOptions, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize, map, Observable } from 'rxjs';
import { CollectionService } from 'src/app/Services/collection.service';

type CreateCollection = {selectedProduct : boolean, uplaodSheet : boolean}
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  tableHeader: any[] = [];
  @Input() collectionShown: boolean = true;
  @Input () showUploadSheet : boolean = false
  @Output() handleCloseDailog: EventEmitter<boolean> = new EventEmitter();
  @Output() handleCreateCollection: EventEmitter<any> = new EventEmitter();
  searchParams: any;
  params: any;
  loadingIndicator: boolean = false;
  totalItems: number = 0;
  ProductNameValue: string = '';
  ProductSKUValue: string = '';
  ProductBrandValue: any = null;
  data$: Observable<any>;
  pageProductSize: number = 0;
  pageProductNumber: number = 0;
  selectedProducts: any[] = [];
  selectedItems: any[] = [];
  paginationBrandsParams: any;
  length: number = 0;
  page: number = 0;
  brandNext: string = '';
  asyncData: any;
  brandsData: any[] = [];
  paymentId: number = 0;
  brandCurrent: number = 1;
  collectionForm: FormGroup
  submitted: boolean = false
  uploadCorrect : boolean = false
  constructor(private _collectionServicew: CollectionService, private fb: FormBuilder, private _MessageService: MessageService) {
    this.searchParams = new HttpParams();
    this.params = new HttpParams();
    this.paginationBrandsParams = new HttpParams();
    this.data$ = this.getCollection();
    this.collectionForm = fb.group({
      title_en: ['', [Validators.required]],
    })

    this.tableHeader = [
      { field: 'sku', header: 'SKU' },
      { field: 'image', header: 'image' },
      { field: 'name', header: 'Name' },
      { field: 'brand', header: 'Brand' },
      { field: 'minPrice', header: 'Price' },
      { field: 'stock', header: 'Stock' },
    ];
    this.getAllBrands(1);
  }

  ngOnInit(): void { }

  getCollection() {
    this.loadingIndicator = true;
    let data: any;
    this.params = this.params.set('page', 1);
    this.params = this.params.set('per_page', 5);
    return this._collectionServicew.getCollection(this.params).pipe(
      map((Products) => {
        this.totalItems = Products.meta.total;
        return Products?.data.map((pro: any) => {
          let sizes = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
          let colors = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );
          data = {
            variation: [...sizes, ...colors],
            sku: pro.variation.sku,
            image: pro.variation.product.images[0]?.url
              ? pro.variation.product.images[0]?.url
              : '',
            name: pro.variation.product.title_en,
            brand: pro.variation.product.brand_id,
            minPrice: pro.price,
            stock: pro?.in_stock,
            quantity: 1,
            id: pro.id,
            productId:pro.variation.product.id
          };
          return data;
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }


  handleBrandScrollEvent() {
    this.brandCurrent++;
    this.getAllBrands(this.brandCurrent);
  }


  // get all Brands
  getAllBrands(page: number) {
    this.loadingIndicator = true;
    this.paginationBrandsParams = this.paginationBrandsParams.set('page', page);
    this.paginationBrandsParams = this.paginationBrandsParams.set(
      'per_page',
      15
    );
    this._collectionServicew
      .getBrands(this.paginationBrandsParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands) => {
        this.length = brands.meta.total;
        this.page = brands.meta.last_page;
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


  ClearAllValueSearch() {
    this.ProductNameValue = '';
    this.ProductSKUValue = '';
    this.ProductBrandValue = 0;
    this.params = this.params.delete('product_name', this.ProductNameValue);
    this.params = this.params.delete('sku', this.ProductSKUValue);
    this.params = this.params.delete('brand_id', this.ProductBrandValue);
    this.data$ = this.getCollection();
  }

  closeDialog() {
    this.collectionShown = false;
    this.uploadCorrect = false;
    this.handleCloseDailog.emit(false)
  }


  // handle Products PageSize
  handleProductsPageSize(value: any) {
    let data: any;
    let paginator = {
      page: value.page,
      size: value.size,
    };
    this.pageProductSize = paginator.size;
    this.pageProductNumber = paginator.page;
    this.params = this.params.set('page', this.pageProductNumber);
    this.params = this.params.set('per_page', this.pageProductSize);
    this.params = this.params.set('product_name', this.ProductNameValue);
    this.params = this.params.set('sku', this.ProductSKUValue);
    this.data$ = this._collectionServicew.paginateProducts(this.params).pipe(
      map((Products) => {
        this.totalItems = Products.meta.total;
        return Products?.data?.map((pro: any) => {
          let sizes = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
          let colors = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );
          data = {
            variation: [...sizes, ...colors],
            sku: pro.variation.sku,
            image: pro.variation.product.images[0]
              ? pro.variation.product.images[0]
              : '',
            name: pro.variation.product.title_en,
            brand: pro.variation.product.brand_id,
            minPrice: pro.price,
            stock: pro?.in_stock,
            quantity: 1,
            id: pro.id,
            productId:pro.variation.product.id
          };
          return data;
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }

  searchInProducts(productName: any, SKU: any, Brand: any) {
    let data = {
      page: this.pageProductNumber,
      size: this.pageProductSize,
    };
    if (productName === '' && SKU === '' && Brand === '') {
      this.params = this.params.delete('page', this.pageProductNumber);
      this.params = this.params.delete('per_page', 5);
      this.params = this.params.delete('product_name', this.ProductNameValue);
      this.params = this.params.delete('sku', this.ProductSKUValue);
      this.params = this.params.delete('brand_id', this.ProductBrandValue);

      this.data$ = this.getCollection();
    } else {
      this.params = this.params.set('page', this.pageProductNumber);
      this.params = this.params.set('per_page', this.pageProductSize);
      this.params = this.params.set('product_name', this.ProductNameValue);
      this.params = this.params.set('sku', this.ProductSKUValue);
      this.params = this.params.set('brand_id', this.ProductBrandValue);
      this.serachProductsWithParams(this.params);
    }
  }

  // search products by value
  serachProductsWithParams(value: any) {
    let data: any;
    this.data$ = this._collectionServicew.paginateProducts(value).pipe(
      map((Products) => {
        this.pageProductNumber = Products.meta.last_page;
        this.totalItems = Products.meta.total;
        return Products?.data?.map((pro: any) => {
          let sizes = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 8
          );
          let colors = pro?.variation?.attribute_values?.filter(
            (attrValue: any) => attrValue.attribute_type === 6
          );
          data = {
            variation: [...sizes, ...colors],
            sku: pro.variation.sku,
            image: pro.variation.product.images[0]?.url
              ? pro.variation.product.images[0]?.url
              : '',
            name: pro.variation.product.title_en,
            brand: pro.variation.product.brand_id,
            minPrice: pro.price,
            stock: pro?.in_stock,
            quantity: 1,
            id: pro.id,
            productId:pro.variation.product.id
          };
          return data;
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );
  }

  checkProductSearchValue() {
    if (
      this.ProductNameValue === '' &&
      this.ProductSKUValue == '' &&
      this.ProductBrandValue == 0
    ) {
      this.params = this.params.delete('product_name', this.ProductNameValue);
      this.params = this.params.delete('sku', this.ProductSKUValue);
      this.params = this.params.delete('brand_id', this.ProductBrandValue);
      this.data$ = this.getCollection();
    }
  }

  getSelectItem(data: any) {
    this.selectedProducts = data
  }

  get titleCollection(){
  return this.collectionForm.get('title_en')?.value;
}
  createCollection() {
    // console.log(this.titleCollection, 'This is a collection title');

    this.submitted = true
    if (this.collectionForm.invalid) {
      return
    } else {
      if (this.selectedProducts.length !== 0) {
        let ids = this.selectedProducts.map(product =>  product.productId)
        let collectionData = {
          title_en: this.collectionForm.get('title_en')?.value,
          products: ids,
          title_ar: "تيست"
        }
        this.handleCreateCollection.emit(collectionData)
      } else {
        this._MessageService.add({
          severity: 'warn',
          summary: 'Warn',
          detail: 'Please Select Items',
        });
      }
    }
  }


  onFileSelectForUplaod(event : any) {
    console.log('event received', event);
    if (event.target.files) {
    let showUploadSheet = setTimeout(() => {
      this.uploadCorrect = true
    }, 500);
    }
    setTimeout(() => {
      this.closeDialog()
    }, 2000);


    // this.uploadCorrect = false


  }
  // swapSaveCreateCollection : CreateCollection = {selectedProduct : false, uplaodSheet : false}


}


