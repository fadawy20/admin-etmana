import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService, TreeDragDropService } from 'primeng/api';
import { finalize } from 'rxjs';
import { CategoriesService } from 'src/app/Services/categories.service';
import { CollectionService } from 'src/app/Services/collection.service';
import { Tree } from 'primeng/tree';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnChanges {

  items: any[] = []
  selectedOption !: string
  checkAllCategories: boolean = false
  checkAllBrands: boolean = false
  selectedItem: any = 0
  dropDownSelectedData: any
  selectedItems: any[] = []
  selectedFilesOfNode: any[] = []
  loadingIndicator: boolean = false
  shownCollection: boolean = false
  selectedFiles: any[] = []
  collectionParams: any
  allNodesSelected !: boolean
  showUplaodSheet: any
  showBrandsDependsOnRouting: boolean = false
  selectedKeys: string[] = [];
  selectedNodeIds = [3, 13];
  @ViewChild('treee') treee!: Tree;


  // recieve items data from parent component
  @Input() brands: any[] = []
  @Input() categoris: any = []
  @Input() collections: any[] = []
  @Input() updatedBrands: any[] = []
  @Input() updatedCollection: any[] = []

  // send data to parent component
  @Output() sendItems: EventEmitter<any> = new EventEmitter();
  @Output() sendCatogries: EventEmitter<any> = new EventEmitter();
  @Output() sendPromotableType: EventEmitter<any> = new EventEmitter();
  @Output() sendSelectedItem: EventEmitter<any> = new EventEmitter();
  @Output() sendShowUploadSheet: EventEmitter<any> = new EventEmitter()
  @Output() idsOfSelectedItems: EventEmitter<any> = new EventEmitter()
  idsOfSelectedCollection: any[] = []
  constructor(
    private messageService: MessageService,
    private _CategoriesService: CategoriesService,
    private _CollectionService: CollectionService,
    private tree: Tree,
    private _activatedRoute: ActivatedRoute
  ) {
    // this.categoris = [{
    //   label: "Women",
    //   data: { checked: true },
    //   expandedIcon: 'pi pi-folder-open',
    //   collapsedIcon: 'pi pi-folder',
    //   leaf: false,
    //   is_active: true,
    //   id: 2,
    // }]
    // selectedKeys = [2]


    this._activatedRoute.url.subscribe((url) => {
      if (url[0].path === 'createCollection' || url[0].path === 'editCollection') {
        this.showUplaodSheet = true
        this.showBrandsDependsOnRouting = true
        // console.log('show brands dependent on route', this.showBrandsDependsOnRouting);
        this._CategoriesService
          .getParents()
          .then((files) => {
            this.categoris = files.map((file: any) => {
              return {
                label: file.title_en,
                data: file,
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                leaf: false,
                isSelectedCategory: false,
                id: file.id,
              };
            });
            // this.setSelectedKeys()
            // console.log('This is categories', this.categoris);




          })
          .then(() => {
            this.loadingIndicator = false;
          });








        // THIS WILL WORL IN PRODUDCT LIST CMS
        this.items = [
          {
            id: 1,
            name: 'Categories',
            type: 'categories'
          },
          {
            id: 2,
            name: 'Brands',
            type: 'brands'
          },
          {
            id: 3,
            name: 'Collections',
            type: 'collections'
          },
          {
            id: 4,
            name: 'New Arrival',
            type: 'new arrival'
          },
          {
            id: 5,
            name: 'Best Sellers',
            type: 'best sellers'
          },
        ]

      } else {
        this.items = [
          {
            id: 1,
            name: 'Categories',
            type: 'categories'
          },
          {
            id: 2,
            name: 'Brands',
            type: 'brands'
          },
          {
            id: 3,
            name: 'Collections',
            type: 'collections'
          },
        ]
      }

    })



    this.collectionParams = new HttpParams()
  }
  updatedBrandArray: any
  updatedCollectionArray: any

  ngOnChanges(changes: SimpleChanges) {
    // THIS WILL HELP ME WHEN I OPEN THE BRANDS CHECKBOX IS AUTOMATICALLY OPEN

    const matchedObjects = this.brands.filter((obj: any) => {
      return this.updatedBrands.some((matchObj: any) => matchObj.id === obj.id);
    });

    // console.log(matchedObjects, 'this is matchedBrands');
    this.updatedBrandArray = matchedObjects.map((brand: any) => ({
      ...brand,
      isSelectedBrand: true,
    }));
    // console.log(this.updatedBrandArray, 'This is updated brands ======> in nnnnnnnnn');
    this.updatedBrandArray.forEach((element: any) => {
      this.selectedItems.push(element)
    });
    let selectedItms = this.selectedItems.map((element: any) => {
      return element?.id
    })
    this.idsOfSelectedItems.emit(selectedItms)


    this.brands = this.brands.map((brand: any) => {
      const matchingItem1 = this.updatedBrandArray.find((item1: any) => item1.id === brand.id)
      if (matchingItem1) {
        return { ...brand, isSelectedBrand: true };
      }
      return brand;
    })

    // THIS IS BELONGS TO COLLECTUON AUTOMATICALLY SELECTED
    if (changes['collections']) {
      // console.log('i will be here soon', changes['collections'].currentValue);
      const matchedObjectsCollections = this.collections.filter((obj: any) => {
        return this.updatedCollection.some((matchObj: any) => matchObj.id === obj.id);
      });
      this.updatedCollectionArray = matchedObjectsCollections.map((collection: any) => ({
        ...collection,
        isSelectedCollection: true,
      }));
      // console.log('This is updated collection', this.updatedCollectionArray);

      this.updatedCollectionArray.forEach((element: any) => {
        console.log(element);
        this.selectedItems.push(element)
      });
      // console.log(this.selectedItems, 'after push collection');
      //THIS IS IDS OF SELECTED AUTOMATCALLY SELECTED AND SEND IT TO THE CREATE COLLECTION COMPONENTS
      let selectedItms = this.selectedItems.map((element: any) => {
        return element?.id
      })
      this.idsOfSelectedItems.emit(selectedItms)
      this.idsOfSelectedCollection = selectedItms
      console.log(selectedItms, 'after push collection but only id');

      this.collections = this.collections.map((collection: any) => {
        const matchingItem1 = this.updatedCollectionArray.find((item1: any) => item1.id === collection.id)
        if (matchingItem1) {
          return { ...collection, isSelectedCollection: true };
        }
        return collection;
      })
    }






    // console.log('This is selected categories', this.selectedItems);







  }






  selectAllNodes() {
    const nodes = this.tree.value;
    nodes.forEach(node => {
      node.partialSelected = true;
      node.selectable = true;
    });
    this.messageService.add({ severity: 'success', summary: 'All nodes selected' });
  }



  hanldeItemChange(data: any) {
    this.selectedItem = data.value.id
    console.log('selectedItem', this.selectedItem);
    // this._activatedRoute.url.subscribe((url) => {
    //   if (url[0].path === 'createCollection' || url[0].path === 'editCollection') {
    //     this.sendPromotableType.emit(data.value.name)
    //   }

    // })



    this.sendPromotableType.emit(data.value.type)
    this.sendSelectedItem.emit(this.selectedItem)
    this.brands.map((brands) => {
      brands.isSelectedBrand = false
    })
    this.getAllCategoriesParents()
    this.collections.map((collection) => {
      collection.isSelectedCollection = false
    })
    this.selectedItems = []
    this.selectedFilesOfNode = []
  }

  getAllCategoriesParents() {
    this.loadingIndicator = true;
    this._CategoriesService
      .getParents()
      .then((files) => {
        this.categoris = files.map((file: any) => {
          return {
            label: file.title_en,
            data: file,
            expandedIcon: 'pi pi-folder-open',
            collapsedIcon: 'pi pi-folder',
            leaf: false,
            isSelectedCategory: false,
            id: file.id,
          };
        });
        // console.log(this.categoris, 'categoris');

      })
      .then(() => {
        this.loadingIndicator = false;
      });
    // console.log('categoris', this.categoris);

  }
  // emitSelectedFiles(data: any) {
  //   console.log(data);

  // }
  unselectNode(event: any) {
    console.log('this is un select node', event);
    const isUnSelected = event.node.isSelectedCategory = false
    console.log('isUnSelected', isUnSelected);

    if (isUnSelected == false) {
      this.selectedFilesOfNode = this.selectedFilesOfNode.filter((selected: any) => {
        return selected.id !== event.node.data.id
      })
      console.log('this is selected items after filter click', this.selectedFilesOfNode);

    }


  }

  nodeSelect(event: any) {
    // This is will be send one category
    const isSelected = event.node.isSelectedCategory = true
    // this is change
    this.selectedOption = event.node.data
    // this.selectedFilesOfNode.shift()
    this.selectedFilesOfNode.push(this.selectedOption)
    console.log(event, 'this is selected items y rayes');
    console.log('selectedFilesOfNode', this.selectedFilesOfNode);
    this.sendItems.emit(this.selectedFilesOfNode)
  }

  onCheckboxChangeForCategories(event: any) {
    // console.log('This event is belongs to event', event);
    this.categoris = event.source.value
    if (this.checkAllCategories) {
      this.selectedFilesOfNode.push(...this.categoris)
      console.log('this.selectedFilesOfNode', this.selectedFilesOfNode);

      this.sendItems.emit(this.selectedFilesOfNode)
      console.log('selectedFilesOfNode', this.selectedFilesOfNode);

    } else {
      this.selectedFilesOfNode = []
      console.log(' this.selectedFilesOfNode', this.selectedFilesOfNode);

    }
  }












  AddBrands(brandData: any, value: any) {
    console.log('brandData: ', brandData);

    if (value.checked) {
      this.selectedItems.push(brandData)
      console.log('selected Items on brands', this.selectedItems);

    } else {
      // THIS IS WILL REMOVE THE BRAND WHEN I DO NOT REMOVE SELECT FROM IT
      this.selectedItems = this.selectedItems.filter((selected: any) => selected.id !== brandData.id)
      console.log('selected Item in else brands', this.selectedItems);
    }
    // console.log(this.selectedItems, 'this is selected Items of brands' );
    // this.sendItems.emit(this.selectedItems);
    let selectedBrandsThatSendToBackend = this.selectedItems.map((selectedItem: any) => {
      return selectedItem?.id
    })
    this.idsOfSelectedItems.emit(selectedBrandsThatSendToBackend)
  }

  addCollections(collectionData: any, value: any) {
    console.log('collection data', collectionData);

    if (value.checked) {
      this.selectedItems.push(collectionData)
      // console.log('selected Collection', this.selectedItem);

    } else {
      this.selectedItems = this.selectedItems.filter((selected: any) => selected.id !== collectionData.id)
    }
    let selecteCollectionsThatSendToBackend = this.selectedItems.map((selectedItem: any) => {
      return selectedItem?.id
    })
    // this.sendItems.emit(this.selectedItems)
    this.idsOfSelectedItems.emit(selecteCollectionsThatSendToBackend)
    // console.log('This is selected items', this.selectedItems);

  }

  ngDoCheck() {
    this.sendCatogries.emit(this.selectedFilesOfNode)
  }


  nodeExpand(event: any) {
    this.loadingIndicator = true;
    if (event.node) {
      this._CategoriesService
        .getChilds(event.node.data.id)
        .then((files) => {
          if (files?.children.length === 0) {
            event.node.expandedIcon = 'pi pi-chevron-right';
            this.messageService.add({
              severity: 'warn',
              summary: 'warn',
              detail: 'this Category has No Children',
            });
          } else {
            event.node.children = files?.children.map((file: any) => {
              return {
                label: file.title_en,
                data: file,
                parents: files,
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                leaf: false,
              };
            });


          }
        })
        .then(() => {
          this.loadingIndicator = false;
        });
    }
  }


  handleCloseDailog(value: boolean) {
    this.shownCollection = value
  }

  createCollection(value: any) {
    this._CollectionService.createCollection(value).subscribe(collection => {
      this.shownCollection = false
      this.collectionParams = this.collectionParams.set('page', 1);
      this.collectionParams = this.collectionParams.set('per_page', 100);
      this.getCollections(this.collectionParams)
    })
  }

  getCollections(params: any) {
    this._CollectionService.paginate(params).pipe(
      finalize(() => (this.loadingIndicator = false))
    ).subscribe((collections: any) => {
      this.collections = collections?.data?.map((collection: any) => {
        return {
          title: collection.title_en,
          id: collection.id,
          count: collection?.products_count,
          images: collection.products.map((product: any) => product.images[0]?.url),
          isSelectedCollection: false
        };
      });
    })
  }

  openCreateCollection() {
    this.shownCollection = true
    console.log('show collection', this.shownCollection);

  }

  ngOnInit(): void {


  }

  onCheckboxChange(event: any) {
    this.categoris = event.source.value
    // console.log(event.source.value);
    console.log('This is all categories', this.categoris);
    console.log('check all categories', this.checkAllCategories);



  }
  onCheckboxChangeForBrands(event: any) {
    this.brands = event.source.value
    console.log('brands', this.brands);
    console.log('Check all brands', this.checkAllBrands);
    if (this.checkAllBrands) {
      this.selectedItems.push(...this.brands)
      this.sendItems.emit(this.selectedItems);
      console.log('this.selectedItem', this.selectedItems);
    }
    else {
      this.selectedItems = []
      console.log('this.selectedItem', this.selectedItems);

    }
    this.checkAllBrands ? this.brands.map((brands) => {
      brands.isSelectedBrand = true
    }) : this.brands.map((brands) => {
      brands.isSelectedBrand = false
    })



  }

}
