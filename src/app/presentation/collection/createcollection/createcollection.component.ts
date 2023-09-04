import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { BrandsService } from 'src/app/Services/brands.service';
import { CmsService } from 'src/app/Services/cms.service';
import { CollectionService } from 'src/app/Services/collection.service';
import { ItemsComponent } from '../../promotions/components/items/items.component';
import { DatePipe } from '@angular/common';

interface Items {
  id: number,
  name: string,
  type: string
}
type Loader = boolean
export enum ControlKeys {
  title_en = "title_en",
  title_ar = "title_ar",
  type = "type",
  page_url = "page_url",
  location_in_page = "location_in_page",
  associateWebsite = "associateWebsite",
  durationTime = "durationTime",
  showArrowSize = "showArrowSize",
  showImageIcon = "showImageIcon",
  showSliderTitle = "showSliderTitle",
  is_active = "is_active",
  productList_title_en = "productList_title_en",
  productList_title_ar = "productList_title_ar",
  product_list_type = "product_list_type",
  platform = "platform",
  date_from = "date_from",
  date_to = "date_to",

}


@Component({
  selector: 'app-createcollection',
  templateUrl: './createcollection.component.html',
  styleUrls: ['./createcollection.component.scss']
})
export class CreatecollectionComponent implements OnInit {
  items !: Items[]
  loadingIndicator: any
  dropDownSelectedData: any
  selectedItem: number = 0
  PromotableTybe: any
  selectedItemsOfData: any
  brandsParams1 !: any
  brandParams2: any
  collectionParams: any;
  brandsPage1: any = []
  brandsPage2: any = []
  allBrands: any = []
  collections: any = []
  loader: Loader = false
  generalformCollection !: FormGroup
  productListItemsForm !: FormGroup
  submitted: boolean = false
  productListType: any[] = []
  AssociateWebsite: any[] = []
  locationInThePage: any[] = []
  collectionStatus: boolean = false
  idCollection: undefined
  updatedBrandArray: any[] = []
  brandsProductList: any[] = []
  sentCollections: any[] = []
  platfroms: any[] = []
  @ViewChild('itemsComponent') ItemsComponet !: ItemsComponent
  constructor(private _DatePipe: DatePipe, private _activeRoute: ActivatedRoute, private _route: Router, private messageService: MessageService, private _cmsService: CmsService, private _fb: FormBuilder, private _router: Router, private _BrandsService: BrandsService, private _CollectionService: CollectionService) {
    this.loader = true
    this.brandsParams1 = new HttpParams()
    this.brandParams2 = new HttpParams()
    this.collectionParams = new HttpParams();
  }

  country_id: any
  location_In_page: any
  ngOnInit(): void {
    this.idCollection = this._activeRoute.snapshot.params['id']






    // CREATE GENEAL FORM GROUP
    this.generalformCollection = this._fb.group({
      [ControlKeys.title_en]: ['', Validators.required],
      [ControlKeys.title_ar]: ['', Validators.required],
      [ControlKeys.is_active]: [false],
      [ControlKeys.type]: [3],
      [ControlKeys.page_url]: ['', Validators.required],
      [ControlKeys.associateWebsite]: ['', Validators.required],
      [ControlKeys.location_in_page]: [''],
      [ControlKeys.platform]: ['', Validators.required],
      [ControlKeys.date_from]: ['', Validators.required],
      [ControlKeys.date_to]: ['', Validators.required],
    })

    this.productListItemsForm = this._fb.group({
      [ControlKeys.productList_title_en]: ['', Validators.required],
      [ControlKeys.productList_title_ar]: ['', Validators.required],
      [ControlKeys.product_list_type]: [0]

    })
    this.getAllArray();
    //
    // GET ALL BRANDS
    this.getAllBrands()
    setTimeout(() => {
      console.log(this.allBrands);
      this.allBrands = this.brandsPage1.concat(this.brandsPage2)

    }, 1000);
    // GET ALL CATEGORIES
    this.getAllCollection(this.collectionParams)

    if (this.idCollection) {
      console.log(this.idCollection, 'This is id collection');

      console.log(this.PromotableTybe, 'This is a collection promotable type');

      this._cmsService.getCmsById(this.idCollection).subscribe((response: any) => {
        console.log('This is response of id', response);
        let typeOfDropDown = this.ItemsComponet.items.filter((value) => {
          return value.id == response.data.productList.type?.id
        })[0];
        console.log(typeOfDropDown, 'This is typeOfDropDown');
        this.ItemsComponet.dropDownSelectedData = typeOfDropDown
        this.ItemsComponet.selectedItem = typeOfDropDown?.id
        console.log('Item selected ===>', this.ItemsComponet.selectedItem);

        console.log(response.data.productList['brands'], 'This is elly anta');
        this.brandsProductList = response.data.productList['brands'];
        // console.log(this.brandsProductList, 'This is brands product list ======>');

        this.sentCollections = response.data.productList['collections'];
        // console.log(this.brandsProductList, 'This is brands product list ======>');

        // THIS IS VALUES OF GENEARAL INFO
        this.country_id = this.AssociateWebsite.filter((value) => {
          return value.country_id === response.data.country_id.id
        })[0]
        // console.log('This is country', this.country_id);
        this.location_In_page = this.locationInThePage.filter((value) => {
          return value.type === response.data.location_in_page
        })[0]
        // console.log('This is location', this.location_In_page);


        this.collectionStatus = response.data.is_active
        this.generalformCollection.patchValue({
          title_en: response.data.title_en,
          title_ar: response.data.title_ar,
          page_url: response.data.page_url,
          is_active: this.collectionStatus,
          associateWebsite: this.country_id,
          location_in_page: this.location_In_page,
          // platform: this.platfroms.filter((platform: any) => {
          //   return response.data.product_lists.platform === platform.type
          // })[0],
          // date_from: new Date(response.data.product_lists.date_from),
          // date_to: new Date(response.data.product_lists.date_to),
        })
        console.log(this.generalformCollection, 'This is for collection');

        // THIS IS VALUES OF GENEARAL INFO

        // THIS IS VALUES OF productListItemsForm
        this.productListItemsForm.patchValue({
          productList_title_en: response.data.productList.title_en,
          productList_title_ar: response.data.productList.title_ar,

        })
        // THIS IS VALUES OF productListItemsForm

      })
    }
  }


  getIdsOfSelectedItems(data: any) {
    // console.log('data is selected ====>', data);
    this.idsOfSelectedItems = data
    console.log(this.idsOfSelectedItems, ' This is selected elly anta 3azwo');

  }

  handleCreateOrUpdate() {
    if (this.idCollection) {
      this.updateProductList()
    } else {
      this.createProductList()
    }
  }

  createProductList() {
    this.submitted = true
    console.log('This is log');

    const PromotableTybe = this.PromotableTybe
    console.log(PromotableTybe);
    console.log('idsOfSelectedItems', this.idsOfSelectedItems);


    if (this.PromotableTybe == 'categories' || this.PromotableTybe == 'brands' || this.PromotableTybe == 'collections') {
      let data = {
        title_ar: this.generalformCollection.get('title_ar')?.value,
        title_en: this.generalformCollection.get('title_en')?.value,
        is_active: this.collectionStatus,
        page_url: this.generalformCollection.get('page_url')?.value,
        type: 3,
        country_id: this.generalformCollection.get('associateWebsite')?.value?.country_id,
        location_in_page: this.generalformCollection.get('location_in_page')?.value?.type,
        product_lists: {
          title_ar: this.productListItemsForm.get('productList_title_ar')?.value,
          title_en: this.productListItemsForm.get('productList_title_en')?.value,
          type: this.selectedItem,
          platform: this.generalformCollection.get('platform')?.value?.type,
          date_from: this._DatePipe.transform(this.generalformCollection.get('date_from')?.value, 'yyyy-MM-dd'),
          date_to: this._DatePipe.transform(this.generalformCollection.get('date_to')?.value, 'dd-MM-yyyy')

        },
        // the property name is computed based on the value of PromotableTybe,
        [PromotableTybe]: [...this.idsOfSelectedItems]
      }
      console.log(data, 'This is first');
      this._cmsService.storeCms(data)
        .pipe(finalize(() => {
          // setTimeout(() => {
          //   this._route.navigateByUrl('/Dashboard/collection')
          // }, 3000);
        }))
        .subscribe((response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Collection created Successfully' })
        })

    } else {
      let data = {
        title_ar: this.generalformCollection.get('title_ar')?.value,
        title_en: this.generalformCollection.get('title_en')?.value,
        is_active: this.collectionStatus,
        page_url: this.generalformCollection.get('page_url')?.value,
        country_id: this.generalformCollection.get('associateWebsite')?.value?.country_id,
        location_in_page: this.generalformCollection.get('location_in_page')?.value?.type,
        product_lists: {
          title_ar: this.productListItemsForm.get('productList_title_ar')?.value,
          title_en: this.productListItemsForm.get('productList_title_en')?.value,
          type: this.selectedItem,
          platform: this.generalformCollection.get('platform')?.value?.type,
          date_from: this._DatePipe.transform(this.generalformCollection.get('date_from')?.value, 'yyyy-MM-dd'),
          date_to: this._DatePipe.transform(this.generalformCollection.get('date_to')?.value, 'dd-MM-yyyy')

        }
      }
      console.log(data, 'data');

      this._cmsService.storeCms(data)
        .pipe(finalize(() => {

        }))
        .subscribe((response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Collection created Successfully' })
          setTimeout(() => {
            this._route.navigateByUrl('/Dashboard/collection')
          }, 3000);
        })
    }







  }

  updateProductList() {
    this.submitted = true
    // console.log('This is log');
    console.log(this.ItemsComponet.selectedItem, 'This is id ');

    // const PromotableTybe = this.PromotableTybe
    // console.log(PromotableTybe);
    // console.log('idsOfSelectedItems', this.idsOfSelectedItems);


    if (this.ItemsComponet.selectedItem == 1 || this.ItemsComponet.selectedItem == 2 || this.ItemsComponet.selectedItem == 3) {
      if (this.ItemsComponet.selectedItem == 1) {
        this.PromotableTybe = 'catgories'
        // this.PromotableTybe = 'catgories'
        console.log(this.PromotableTybe, 'This is promo ==>');

      } else if (this.ItemsComponet.selectedItem == 2) {
        this.PromotableTybe = 'brands'

        console.log(this.PromotableTybe, 'This is promo ==>');

      } else if (this.ItemsComponet.selectedItem == 3) {
        this.PromotableTybe = 'collections'
        console.log(this.PromotableTybe, 'This is promo ==>');
      }
      // console.log('This is ids of selected items', this.idsOfSelectedItems);
      this.idsOfSelectedItems = this.idsOfSelectedItems.map((item) => {
        return item.id
      })
      console.log(this.idsOfSelectedItems, 'This is ids of selected items ====> ');


      let data = {
        title_ar: this.generalformCollection.get('title_ar')?.value,
        title_en: this.generalformCollection.get('title_en')?.value,
        is_active: this.collectionStatus,
        page_url: this.generalformCollection.get('page_url')?.value,
        type: 3,
        country_id: this.generalformCollection.get('associateWebsite')?.value?.country_id,
        location_in_page: this.generalformCollection.get('location_in_page')?.value?.type,
        product_lists: {
          title_ar: this.productListItemsForm.get('productList_title_ar')?.value,
          title_en: this.productListItemsForm.get('productList_title_en')?.value,
          type: this.ItemsComponet.selectedItem,
          platform: this.generalformCollection.get('platform')?.value?.type,
          date_from: this._DatePipe.transform(this.generalformCollection.get('date_from')?.value, 'yyyy-MM-dd'),
          date_to: this._DatePipe.transform(this.generalformCollection.get('date_to')?.value, 'dd-MM-yyyy')


        },
        // the property name is computed based on the value of PromotableTybe,
        [this.PromotableTybe]: [...this.idsOfSelectedItems]
      }
      console.log(data);

      this._cmsService.updateCms(this.idCollection, data)
        .pipe(finalize(() => {

        }))
        .subscribe((reponse: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product List Updated Successfully' })
          setTimeout(() => {
            this._router.navigateByUrl('Dashboard/collection')
          }, 2000);
        })

    } else {
      let data = {
        title_ar: this.generalformCollection.get('title_ar')?.value,
        title_en: this.generalformCollection.get('title_en')?.value,
        is_active: this.collectionStatus,
        page_url: this.generalformCollection.get('page_url')?.value,
        country_id: this.generalformCollection.get('associateWebsite')?.value?.country_id,
        location_in_page: this.generalformCollection.get('location_in_page')?.value?.type,
        product_lists: {
          title_ar: this.productListItemsForm.get('productList_title_ar')?.value,
          title_en: this.productListItemsForm.get('productList_title_en')?.value,
          type: this.ItemsComponet.selectedItem,
          platform: this.generalformCollection.get('platform')?.value?.type,
          date_from: this._DatePipe.transform(this.generalformCollection.get('date_from')?.value, 'yyyy-MM-dd'),
          date_to: this._DatePipe.transform(this.generalformCollection.get('date_to')?.value, 'dd-MM-yyyy')

        }
      }
      console.log(data);

      this._cmsService.updateCms(this.idCollection, data)
        .pipe(finalize(() => {

        }))
        .subscribe((reponse: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product List Updated Successfully' })
          setTimeout(() => {
            this._router.navigateByUrl('Dashboard/collection')
          }, 2000);
        })

    }








  }



















  backToList() {
    this._router.navigateByUrl('/Dashboard/collection')
  }

  handleRuleTypeChangeType(value: any) { }
  handleRuleTypeChangeAssociateWebsite(value: any) { }
  handleRuleTypeChangeLocationPage(value: any) { }

  changeCollectionStatus(value: any) {
    this.collectionStatus = value.checked
  }


  // THIS IS WILL RECIEVE FROM ITEM COMPONENT TYPE FROM DROPDOWN
  getPromotableTybe(value: any) {
    // THIS IS USE HERE  "categories": [ 1 , 2, 3]
    this.PromotableTybe = value
    console.log(this.PromotableTybe, 'This is generic promotable type');

  }

  getSelectedItem(value: any) {
    // This is use here  "product_list_type" : 2
    this.selectedItem = value
    console.log('selected  ====> item', this.selectedItem);

  }
  getCategories(value: any) { }

  //  THIS IS ALL CATEGORIES WHEN CLICK IN CHECKBOX OF ALL CATEGORIES AND HERE RECIEVE DATA FROM COMPONENT ITEMS
  categoriesIds: any[] = []
  brandsIds: any[] = []
  collectionIds: any[] = []
  idsOfSelectedItems: any[] = []
  getItems(data: any) {
    if (this.PromotableTybe == 'categories') {
      this.selectedItemsOfData = data
      console.log('selectedItemsOfData', this.selectedItemsOfData);
      this.idsOfSelectedItems = this.selectedItemsOfData.map((item: any) => {
        return item?.id
      })
      console.log(this.idsOfSelectedItems, 'this.idsOfSelectedItems');
    } else if (this.PromotableTybe == 'brands') {
      this.selectedItemsOfData = data
      console.log('selectedItemsOfData', this.selectedItemsOfData);
      this.idsOfSelectedItems = (this.selectedItemsOfData as []).map((item: any) => {
        return item?.id
      })
      console.log(this.idsOfSelectedItems, ' this.idsOfSelectedItems');
    } else if (this.PromotableTybe == 'collections') {
      this.selectedItemsOfData = data
      this.idsOfSelectedItems = (this.selectedItemsOfData as []).map((item: any) => {
        return item?.id
      })
      console.log(this.idsOfSelectedItems, ' this.idsOfSelectedItems');
    }




  }

  getAllBrands() {
    this.brandsParams1 = this.brandsParams1.set('page', 1);
    this.brandsParams1 = this.brandsParams1.set('per_page', 100);
    this.brandParams2 = this.brandParams2.set('page', 2);
    this.brandParams2 = this.brandParams2.set('per_page', 50);
    this.getAllBrandsForPage1(this.brandsParams1)
    this.getAllBrandsForPage2(this.brandParams2)

  }

  getAllBrandsForPage1(params: any) {

    this._BrandsService
      .paginate(params)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands: any) => {
        this.brandsPage1 = brands?.data?.map((brand: any) => {
          return {
            title: brand.title_en,
            id: brand.id,
            logo: brand?.logo,
            isSelectedBrand: false,
          };
        });
        // console.log('params ========================================>', params);
        // console.log('brands page 1', this.brandsPage1);

      });
  }

  getAllBrandsForPage2(params: any) {
    this._BrandsService
      .paginate(params)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((brands: any) => {
        this.brandsPage2 = brands?.data?.map((brand: any) => {
          return {
            title: brand.title_en,
            id: brand.id,
            logo: brand?.logo,
            isSelectedBrand: false,
          };
        });
        // console.log('Brands Page 2', this.brandsPage2);

      });
  }

  getAllCollection(params: any) {
    this.collectionParams = this.collectionParams.set('page', 1);
    this.collectionParams = this.collectionParams.set('per_page', 50);
    this._CollectionService
      .paginate(params)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((collections: any) => {
        this.collections = collections?.data?.map((collection: any) => {
          return {
            title: collection.title_en,
            id: collection.id,
            count: collection?.products_count,
            images: collection.products.map(
              (product: any) => product.images[0]?.url
            ),
            isSelectedCollection: false,
          };

        });
        console.log('collection is selected', this.collections);
      });
  }

  getAllArray() {
    this.productListType = [{
      name: 'Product List', type: 1
    }]
    this.AssociateWebsite = [
      { name: 'Egypt', country_id: 1 },
      { name: 'Saudi Arabia', country_id: 2 },
    ]
    this.locationInThePage = [
      { name: 'Banner', type: 1 },
      { name: 'Banner', type: 2 },
      { name: 'Banner', type: 3 },
      { name: 'Banner', type: 4 },
      { name: 'Banner', type: 5 },
      { name: 'Banner', type: 6 },
      { name: 'Banner', type: 7 },
      { name: 'Banner', type: 8 },
      { name: 'Banner', type: 9 },
      { name: 'Banner', type: 10 },
      { name: 'Banner', type: 11 },
      { name: 'Banner', type: 12 },
      { name: 'Banner', type: 13 },
      { name: 'Banner', type: 14 },
      { name: 'Banner', type: 15 },
      { name: 'Banner', type: 16 },
      { name: 'Banner', type: 17 },
      { name: 'Banner', type: 18 },
      { name: 'Banner', type: 19 },
      { name: 'Banner', type: 20 },
      { name: 'Banner', type: 21 },
      { name: 'Banner', type: 22 },
      { name: 'Banner', type: 23 },
      { name: 'Banner', type: 24 },
      { name: 'Banner', type: 25 },
      { name: 'Banner', type: 26 },
      { name: 'Banner', type: 27 },
      { name: 'Banner', type: 28 },
      { name: 'Banner', type: 29 },
      { name: 'Banner', type: 30 },
    ]
    this.platfroms = [
      {
        name: "Web",
        type: 1
      },
      {
        name: "Mobile",
        type: 3
      },
      {
        name: "All",
        type: 5
      },
    ]

  }
  handleRuleTypeChangePlatform(value: any) {
    console.log(value, 'This is platform change');

  }

}
