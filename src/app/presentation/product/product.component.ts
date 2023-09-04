import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { ProductsService } from 'src/app/Services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleProductFormService } from './Services/simple-product-form.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportsService } from 'src/app/Services/exports.service';
import { BrandsService } from 'src/app/Services/brands.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  display: boolean = false;
  paginationParams: any;
  loadingIndicator: boolean = false;
  length: number = 0;
  page: number = 0;
  editImageUrl: string = '';
  data$: Observable<any>;
  selectedMenu: any = '';
  items: any[] = [];
  checkStatusFilter: boolean = false;
  createItems: any[] = [];
  searchParams: any;
  tableHeader: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 50;
  reasons: any[] = [];
  msgs: any[] = [];
  productId: number = 0;
  statusId: any;
  selectedProduct: any[] = [];
  comment: string = '';
  selectedItems: any[] = [];
  Brands: any[] = [];
  Brands1: any[] = []
  Brands2: any[] = []
  allBrands: any = []

  Categories: any[] = [];
  parentCategories: any[] = [];
  visibility: any[] = [];
  stock: any[] = [];
  statusProducts: any[] = [];
  filterOfNames: any[] = [
    'title_ar',
    'title_en',
    'quantity_from',
    'quantity_to',
    'stock',
    'visibility',
  ];

  showFilterField: boolean = false;
  fieldInputs: any;
  filterField!: FormGroup;
  allProducts: any[] = []
  constructor(
    private _ProductsService: ProductsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private _SimpleProductFormService: SimpleProductFormService,
    private messageService: MessageService,
    private _ConfirmationService: ConfirmationService,
    private fb: FormBuilder,
    private _exportService: ExportsService,
    private brand: BrandsService
  ) {
    this.paginationParams = new HttpParams();
    // this.ActivatedRoute.queryParams.subscribe(params => {
    //   if (params['all']) {
    //     this.brand.get(this.paginationParams).subscribe((res) => {
    //       this.Brands = res.data;
    //       console.log('Brands', this.Brands.length);
    //       console.log('Brand', this.Brands);


    //     });
    //   } else {
    //     this.paginationParams = this.paginationParams.set('page', 1);
    //     this.paginationParams = this.paginationParams.set('per_page', 200);
    //     this.brand.get(this.paginationParams).subscribe((res) => {
    //       this.Brands = res.data;
    //       console.log('Brands', this.Brands.length);
    //       console.log('Brand', this.Brands);


    //     });
    //   }
    // })



    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this.brand.get(this.paginationParams).subscribe((res) => {
      this.Brands = res.data;
      // console.log('Brands', this.Brands.length);
      // console.log('Brand', this.Brands);

    });
    this.paginationParams = this.paginationParams.set('page', 2);
    this.paginationParams = this.paginationParams.set('per_page', 200);
    this.brand.get(this.paginationParams).subscribe((res) => {
      this.Brands1 = res.data;
      // console.log('Brands 2', this.Brands1.length);
      // console.log('Brand 2', this.Brands1);
    });


    // this.paginationParams = this.paginationParams.set('page', 3);
    // this.paginationParams = this.paginationParams.set('per_page', 200);
    // this.brand.get(this.paginationParams).subscribe((res) => {
    //   this.Brands2 = res.data;
    //   console.log('Brands 2', this.Brands2.length);
    //   console.log('Brand 2 ', this.Brands2);

    // });






    this._ProductsService.parentCategories().subscribe((res) => {
      this.parentCategories = res.data;
    });
    this.tableHeader = [
      { field: 'id', header: 'id' },
      { field: 'title_en', header: 'English Name' },
      { field: 'type', header: 'Type' },
      { field: 'product_set', header: 'Attribute Set' },
      { field: 'sku', header: 'SKU' },
      { field: 'min_price', header: 'Price' },
      { field: 'sale_price', header: 'Sale Price' },
      { field: 'total_quantity', header: 'Quantity' },
      { field: 'in_stock', header: 'stock' },
      { field: 'visibility', header: 'Visibility' },
      { field: 'brand', header: 'Brand' },
      { field: 'categories', header: 'Categories' },
      { field: 'barcode', header: 'barcode' },
    ];
    this.filterField = this.fb.group({
      ['title_ar']: [''],
      ['title_en']: [''],
      ['quantity_from']: [''],
      ['quantity_to']: [''],
      ['stock']: [''],
      ['brand']: [''],
      ['category']: [''],
      ['productsStatus']: [''],
      ['is_active']: [''],
      ['price_from']: [''],
      ['price_to']: [''],
      ['barcode']: [''],
    });
    this.statusProducts = [
      { id: 1, name: 'New' },
      { id: 2, name: 'Approve' },
      { id: 3, name: 'Rejected' },
      { id: 4, name: 'Published' },
    ];
    this.visibility = [
      { value: 1, name: 'Active' },
      { value: 0, name: 'In Active' },
    ];
    this.stock = [
      { value: 1, name: 'In Stock' },
      { value: 2, name: 'Out Stock' },
    ];

    this.paginationParams = new HttpParams();
    this.searchParams = new HttpParams();
    this.data$ = this.getAllProducts();
    this.data$.subscribe((res) => {
      this.allProducts = res
    });


    this.createItems = [
      {
        label: 'Simple',
        icon: 'pi pi-fw pi-shopping-cart',
        command: () => {
          this.router.navigateByUrl('Dashboard/product/create-simple-product');
        },
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
  selectCategories(ev: any) {
    // console.log(ev);

    this._ProductsService.getSubCategories(ev.value.id).subscribe((res) => {
      this.Categories = res.data.children;
      console.log(this.Categories);

      res.data.children.forEach((ev: any) => {
        let children = res.data.children;

        if (ev.children.length > 0) {
          ev.children.forEach((ele: any) => {
            this.Categories.push(ele);
          });
        }
      });
      console.log('this.Categories comes from product', this.Categories);

    });
  }

  resetFormColumn() {
    this.filterField.reset();
    this.paginationParams = this.paginationParams.delete(`filters[title_en]`);
    this.paginationParams = this.paginationParams.delete(
      `filters[quantity_from]`
    );
    this.paginationParams =
      this.paginationParams.delete(`filters[quantity_to]`);
    this.paginationParams = this.paginationParams.delete(`filters[is_active]`);
    this.paginationParams = this.paginationParams.delete(`filters[stock]`);
    this.paginationParams = this.paginationParams.delete(`filters[brand]`);
    this.paginationParams = this.paginationParams.delete(`filters[category]`);
    this.paginationParams = this.paginationParams.delete(
      `filters[productsStatus]`
    );
    this.paginationParams = this.paginationParams.delete(`filters[price_from]`);
    this.paginationParams = this.paginationParams.delete(`filters[price_to]`);
    this.paginationParams = this.paginationParams.delete(`filters[barcode]`);
    this.data$ = this.getAllProducts();
  }

  handleBulkExportedData(value: any) {
    let SelectedIds = value.map((item: any) => {
      return item.id;
    });
    let IDS: any = {
      ids: SelectedIds,
    };

    if (value.length === 0) {
      let EmptyArr: any = this.selectedItems;
      this._exportService
        .exportGlobal(EmptyArr, 'admin/products/export', this.paginationParams)
        .subscribe((data: any) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
          this.download(data, data.type);
        });
    } else {
      this._exportService
        .exportGlobal(
          SelectedIds,
          'admin/products/export',
          this.paginationParams
        )
        .subscribe((data: any) => {
          this.download(data, data.type);
          // this.selectedItems = [];
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'these fields are exported Successfuly',
          });
        });
    }
  }

  download(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  checkSearchVal(value: string) {
    console.log('value', value);

    this.paginationParams = this.paginationParams.set('page', this.pageNumber);
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize
    );

    this.loadingIndicator = true;
    this.data$ = this._ProductsService.getProductsBySearch(value).pipe(
      map((products) => {
        console.log('products', products);

        this.length = products.meta.total;
        this.page = products.meta.last_page;
        return products?.data?.map((product: any) => {
          this.editImageUrl = product?.images[0];
          return {
            id: product.id,
            title_en: product.title_en,
            brand: product.brand.title_en,
            categories: product?.categories[0]?.title_en || '-',
            in_stock: product.in_stock ? 'In Stock' : 'Out Stock',
            product_set: product.product_set.title_en,
            Status: product.status.name,
            type:
              product.type.name === 'CONFIGURABLE' ? 'Configurable' : 'Simple',
            sku: product.sku,
            total_quantity: product.total_quantity,
            min_price: product?.variations[0]?.seller_variations[0]?.price,
            visibility: product.visibility ? 'visible' : 'hidden',
            backGroundColor:
              product.status.id === 1
                ? '#FEEFD0'
                : product.status.id === 2
                  ? '#E5F6F4'
                  : product.status.id === 4
                    ? '#EFEAF1'
                    : product.status.id === 3
                      ? '#FBE8EE'
                      : '',
            color:
              product.status.id === 1
                ? '#0E1740'
                : product.status.id === 2
                  ? '#00A599'
                  : product.status.id === 4
                    ? '#5F2D79'
                    : product.status.id === 3
                      ? '#D92059'
                      : '',
            status: product.is_active,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))
    );
    clearTimeout(this.statetimeOut)
    this.statetimeOut = setTimeout(() => {
      // state = true
      this.data$.subscribe((res) => {
        this.allProducts = res
      });
    }, 2000);
  }
  hasChange: boolean = false;
  getFilterAction() {
    if (
      this.filterField.get('title_ar')?.value !== '' ||
      this.filterField.get('title_en')?.value !== '' ||
      this.filterField.get('quantity_from')?.value !== '' ||
      this.filterField.get('quantity_to')?.value !== '' ||
      this.filterField.get('is_active')?.value !== '' ||
      this.filterField.get('stock')?.value.name !== '' ||
      this.filterField.get('visibility')?.value.name !== '' ||
      this.filterField.get('brand')?.value?.id !== '' ||
      this.filterField.get('category')?.value?.id !== '' ||
      this.filterField.get('productsStatus')?.value?.id !== '' ||
      this.filterField.get('price_from')?.value?.id !== '' ||
      this.filterField.get('price_to')?.value?.id !== '' ||
      this.filterField.get('barcode')?.value?.id !== ''
    ) {
      this.paginationParams = this.paginationParams.set(
        'page',
        this.pageNumber
      );
      this.paginationParams = this.paginationParams.set(
        'per_page',
        this.pageSize
      );
      this.paginationParams = this.paginationParams.set(
        `filters[title_ar]`,
        this.filterField.get('title_ar')?.value
          ? this.filterField.get('title_ar')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[title_en]`,
        this.filterField.get('title_en')?.value
          ? this.filterField.get('title_en')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[quantity_from]`,
        this.filterField.get('quantity_from')?.value
          ? this.filterField.get('quantity_from')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[quantity_to]`,
        this.filterField.get('quantity_to')?.value
          ? this.filterField.get('quantity_to')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[price_from]`,
        this.filterField.get('price_from')?.value
          ? this.filterField.get('price_from')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[price_to]`,
        this.filterField.get('price_to')?.value
          ? this.filterField.get('price_to')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[is_active]`,
        this.filterField.get('is_active')?.value.name === 'Active'
          ? 1
          : this.filterField.get('is_active')?.value.name === 'In Active'
            ? 0
            : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[visibility]`,
        this.filterField.get('visibility')?.value?.name === 'visible'
          ? 1
          : this.filterField.get('visibility')?.value.name === 'hidden'
            ? 0
            : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[stock]`,
        this.filterField.get('stock')?.value?.name === 'In Stock'
          ? 1
          : this.filterField.get('stock')?.value?.name === 'Out Stock'
            ? 0
            : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[brand]`,
        this.filterField.get('brand')?.value?.id
          ? this.filterField.get('brand')?.value?.id
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[category]`,
        this.filterField.get('category')?.value?.id
          ? this.filterField.get('category')?.value?.id
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[barcode]`,
        this.filterField.get('barcode')?.value
          ? this.filterField.get('barcode')?.value
          : ''
      );
      this.paginationParams = this.paginationParams.set(
        `filters[productsStatus]`,
        this.filterField.get('productsStatus')?.value?.id
          ? this.filterField.get('productsStatus')?.value?.id
          : ''
      );

      this.loadingIndicator = true;

      this.handlePageSize(this.paginationParams);


    } else {
      this.data$ = this.getAllProducts();
    }
    this.data$.subscribe((res) => {
      console.log('before', res);

      this.allProducts = res
      console.log('after', this.allProducts);
    });

  }

  searchInProducts(value: string) {
    let data = {
      page: this.pageNumber,
      size: this.pageSize,
    };

    if (value === '') {
      this.paginationParams = this.paginationParams.delete('search_key');
      this.handlePageSize(data);

    } else {
      this.paginationParams = this.paginationParams.set(`search_key`, value);
      this.checkSearchVal(this.paginationParams);
    }



  }
  statetimeOut: any
  getDataOnSearch() {
    this.data$.subscribe((res) => {
      this.allProducts = res
    });
  }

  switchStatus(status: boolean) { }
  changeShowFilterField() {
    this.showFilterField = !this.showFilterField;
  }

  ngOnInit(): void {
    this._SimpleProductFormService.getReasons().subscribe((reason) => {
      this.reasons = reason.data.map((value: any) => {
        return {
          description_ar: value.description_ar,
          description_en: value.description_en,
          id: value.id,
          isSelected: false,
        };
      });
    });

    setTimeout(() => {
      if (this.Brands && this.Brands1) {

        this.allBrands = this.Brands.concat(this.Brands1)
        // console.log('all brands ', this.allBrands);

      }
    }, 1000);


  }

  // get all products
  getAllProducts() {
    this.loadingIndicator = true;
    this.paginationParams = this.paginationParams.set('page', 1);
    this.paginationParams = this.paginationParams.set('per_page', 50);
    return this._ProductsService.get(this.paginationParams).pipe(
      map((products) => {
        this.length = products.meta.total;
        this.page = products.meta.last_page;
        return products?.data?.map((product: any) => {
          this.editImageUrl = product?.images[0];
          return {
            id: product.id,
            title_en: product.title_en,
            brand: product.brand.title_en,
            categories: product?.categories[0]?.title_en || '-',
            in_stock: product.in_stock ? 'In Stock' : 'Out Stock',
            product_set: product.product_set.title_en,
            Status: product.status.name,
            type:
              product.type.name === 'CONFIGURABLE' ? 'Configurable' : 'Simple',
            sku: product.sku,
            total_quantity: product.total_quantity,
            min_price: product?.variations[0]?.seller_variations[0]?.price,
            barcode: product?.variations[0]?.seller_variations[0]?.barcode,
            sale_price: product?.variations[0]?.seller_variations[0]?.sale_price
              ? product?.variations[0]?.seller_variations[0]?.sale_price
              : '0',
            visibility: product.visibility ? 'visible' : 'hidden',
            backGroundColor:
              product.status.id === 1
                ? '#FEEFD0'
                : product.status.id === 2
                  ? '#E5F6F4'
                  : product.status.id === 4
                    ? '#EFEAF1'
                    : product.status.id === 3
                      ? '#FBE8EE'
                      : '',
            color:
              product.status.id === 1
                ? '#0E1740'
                : product.status.id === 2
                  ? '#00A599'
                  : product.status.id === 4
                    ? '#5F2D79'
                    : product.status.id === 3
                      ? '#D92059'
                      : '',
            status: product.is_active,
          };
        });
      }),
      finalize(() => (this.loadingIndicator = false))

    );
  }

  changeStatus(value: any) {
    if (Array.isArray(value)) {
      if (value[0].statusId !== 3) {
        this.statusId = value[0].statusId;

        this.selectedProduct = value[1].map((product: any) => {
          return product.id;
        });
        let statusObject = {
          ids: this.selectedProduct,
          status: value[0].statusId,
        };
        this._ProductsService
          .updateBulkStatus(statusObject)
          .pipe(finalize(() => (this.loadingIndicator = false)))
          .subscribe((res: any) => {
            this.data$ = this.getAllProducts();
          });
      } else {
        this.display = true;
      }
    } else {
      this.productId = value.productId;
      if (value.statusId !== 3) {
        this.loadingIndicator = true;
        this.statusId = value.statusId;
        let statusObject = {
          status: value.statusId,
        };
        this._SimpleProductFormService
          .changeStatus(value.productId, statusObject)
          .pipe(finalize(() => (this.loadingIndicator = false)))
          .subscribe((res: any) => {
            this.data$ = this.getAllProducts();
          });
      } else {
        this.display = true;
      }
    }
  }

  submitRejection() {
    this.loadingIndicator = true;
    let ReasonsIds: any[] = [];

    ReasonsIds = this.reasons.map((value: any) => {
      if (value.isSelected) {
        return value.id;
      }
    });
    let statusObject = {
      product_reasons: ReasonsIds.filter((value: any) => value),
      status: 3,
      product_note: this.comment,
    };
    this._SimpleProductFormService
      .changeStatus(this.productId, statusObject)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((res: any) => {
        this.data$ = this.getAllProducts();
        this.display = false;
        this.reasons = this.reasons.map((reason) => {
          return {
            description_ar: reason.description_ar,
            description_en: reason.description_en,
            id: reason.id,
            isSelected: false,
          };
        });
      });
  }

  cancel() {
    this.display = false;
  }
  changeActiveStatus(value: any) {
    if (Array.isArray(value)) {
      this.loadingIndicator = true;
      let arr = value[1].map((product: any) => product.id);
      let obj = {
        ids: arr,
        is_active: value[0].isActive,
      };
      this._ProductsService
        .toggleStatus(obj)
        .pipe(finalize(() => (this.loadingIndicator = false)))
        .subscribe((res) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Status Changed Successfully',
          });
        });
    } else {
      this.loadingIndicator = true;

      let obj = {
        toggle_attribute: 'is_active',
        toggle_value: value.checked,
      };
      this._ProductsService
        .toggleSingleStatus(value.id, obj)
        .pipe(finalize(() => (this.loadingIndicator = false)))
        .subscribe((res) => {
          let dataPage = {
            page: this.pageNumber,
            size: this.pageSize,
          };
          this.handlePageSize(dataPage);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Status Changed Successfully',
          });
        });
    }
  }
  pageData = { page: 1, size: 50 };
  // handle page size
  handlePageSize(value: any) {
    // console.log('value of params', value);

    this.pageData = value;
    this.pageSize = value.size;
    this.pageNumber = value.page;
    this.paginationParams = this.paginationParams.set(
      'page',
      this.pageNumber ? this.pageNumber : 1
    );
    this.paginationParams = this.paginationParams.set(
      'per_page',
      this.pageSize ? this.pageSize : 50
    );
    this.loadingIndicator = true;
    this.data$ = this._ProductsService.get(this.paginationParams).pipe(
      map((products) => {
        this.length = products.meta.total;
        this.page = products.meta.last_page;
        return products?.data?.map((product: any) => {
          this.editImageUrl = product?.images[0];
          return {
            id: product.id,
            title_en: product.title_en,
            brand: product.brand.title_en,
            categories: product?.categories[0]?.title_en || '-',
            in_stock: product.in_stock ? 'In Stock' : 'Out Stock',
            product_set: product.product_set.title_en,
            Status: product.status.name,
            type:
              product.type.name === 'CONFIGURABLE' ? 'Configurable' : 'Simple',
            sku: product.sku,
            total_quantity: product.total_quantity,
            min_price: product?.variations[0]?.seller_variations[0]?.price,
            sale_price: product?.variations[0]?.seller_variations[0]?.sale_price
              ? product?.variations[0]?.seller_variations[0]?.sale_price
              : '0',
            visibility: product.visibility ? 'visible' : 'hidden',
            backGroundColor:
              product.status.id === 1
                ? '#FEEFD0'
                : product.status.id === 2
                  ? '#E5F6F4'
                  : product.status.id === 4
                    ? '#EFEAF1'
                    : product.status.id === 3
                      ? '#FBE8EE'
                      : '',
            color:
              product.status.id === 1
                ? '#0E1740'
                : product.status.id === 2
                  ? '#00A599'
                  : product.status.id === 4
                    ? '#5F2D79'
                    : product.status.id === 3
                      ? '#D92059'
                      : '',
            status: product.is_active,
          };
        });
      }),
      finalize(() => {
        this.loadingIndicator = false;
      })
    );

    this.data$.subscribe((res) => {
      this.allProducts = res
      // console.log('response of this', this.allProducts);

    })

  }

  EditHandler(value: any) {
    if (value.type === 'Configurable') {
      this.router.navigateByUrl(
        'Dashboard/product/edit-configurable-product/' + value.id
      );
    } else {
      this.router.navigateByUrl(
        'Dashboard/product/edit-simple-product/' + value.id
      );
      console.log('This is a simple product data', value);

    }
  }

  DeleteHandler(value: any) {
    this._ConfirmationService.confirm({
      message: 'Do you want to delete this Product ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._ProductsService.delete(value.id).subscribe((data: any) => {
          this.data$ = this.getAllProducts();
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: 'this Product has been Deleted Successfully',
          });
        });
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Rejected',
            detail: 'you have rejected deleted',
          },
        ];
      },
    });
  }
}
