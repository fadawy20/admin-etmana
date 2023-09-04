import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize, map, Observable, subscribeOn } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  PrimeNGConfig,
  Message,
  TreeNode,
} from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { SaveFilesService } from 'src/app/Services/save-files/save-files.service';
import { CategoriesService } from 'src/app/Services/categories.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';
import { ProductsService } from 'src/app/Services/products.service';
import { MatOption } from '@angular/material/core';

export enum controlKeys {
  title_ar = 'title_ar',
  title_en = 'title_en',
  parent_id = 'parent_id',
  cover = 'cover',
  is_featured = 'is_featured',
  subcategory_id = 'subcategory_id'
  //slug = 'slug',
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild('selectedOptionRef') selectedOptionRef!: MatOption;
  displayAllSubcategories: boolean = true
  displayAllSubcategoriesOfParent: boolean = false
  selectedOption!: string;
  isShowData: boolean = false;
  parentCategories: any[] = []
  subCategoriesOfParent: any[] = []
  display: boolean = false;
  filterName: string = '';
  loadingIndicator: boolean = false;
  tableHeader: any[] = [];
  data$: any;
  categoriesLookUps: any[] = [];
  length: number = 0;
  page: number = 0;
  paginationParams: any;
  editModeOn: boolean = false;
  categoryForm: FormGroup;
  submitted: boolean = false;
  btnLoader: boolean = false;
  id: number = 0;
  showDeletDialog: boolean = false;
  msgs: Message[] = [];
  timer: any;
  @ViewChild('tree') tree!: any;
  next: any;
  asyncData: any[] = [];
  current: number = 1;
  viewFilters: boolean = false;
  imageId: any;
  imageUrl: string = '';
  editImageUrl?: string;
  viewImage: boolean = false;
  showCloumnsControllers: boolean = false;
  selectedFile!: TreeNode;
  files: any;
  imgaePathText: any;
  imagePath: any;
  selectedTreeId: number = 0;

  constructor(
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private _SaveFilesService: SaveFilesService,
    private confirmationService: ConfirmationService,
    private _CategoriesService: CategoriesService,
    private _UploadImageService: UploadImageService,
    private _ProductService: ProductsService
  ) {
    this.paginationParams = new HttpParams();
    this.categoryForm = this.fb.group({
      [controlKeys.title_ar]: ['', [Validators.required]],
      [controlKeys.title_en]: ['', [Validators.required]],
      [controlKeys.cover]: [''],
      //[controlKeys.slug]: ['', [Validators.required]],
      [controlKeys.parent_id]: [''],
      [controlKeys.is_featured]: [''],
      [controlKeys.subcategory_id]: ['']
    });

    let permissions: any = localStorage.getItem('permissions');
    let arr: any = JSON.parse(permissions);
    arr = arr.filter((data: any) => {
      if (data.name == 'categories') return data;
    });
    if (arr.length >= 1) this.isShowData = true;

    this.getCategorisLookUps(this.current);
    this.getAllCategoriesParents();
  }


  onSelectionChange(id: any) {
    this.displayAllSubcategories = false
    this.displayAllSubcategoriesOfParent = true
    // console.log(id);

    // console.log(id);
    this._CategoriesService.getChilds(id).then((data) => {
      // console.log('data of parent that i selected', data.children);
      this.subCategoriesOfParent = data.children
      // console.log('subCategoriesOfParent', this.subCategoriesOfParent);
      data.children.forEach((element: any) => {
        if (element.children.length) {
          element.children.forEach((ele: any) => {
            this.subCategoriesOfParent.push(ele)
          });
          // console.log('subCategoriesOfParent', this.subCategoriesOfParent);
        }
      });

      // console.log('subCategoriesOfParent in selection category', this.subCategoriesOfParent);



    })

  }
  openColumnsDialog() {
    this.showCloumnsControllers = true;
  }

  getAllCategoriesParents() {
    this.loadingIndicator = true;
    this._CategoriesService
      .getParents()
      .then((files) => {
        console.log('files', files);
        this.parentCategories = files

        this.files = files.map((file: any) => {
          return {
            label: file.title_en,
            data: file,
            expandedIcon: 'pi pi-folder-open',
            collapsedIcon: 'pi pi-folder',
            leaf: false,
          };
        });
      })
      .then(() => {
        this.loadingIndicator = false;
      });


  }

  itemPath: string = '';
  nodeSelect(event: any) {
    this.selectedOption = event.node
    // console.log(this.selectedOption);

    this.selectedTreeId = event.node.data.id;
    // console.log('selectedTreeId', this.selectedTreeId);

    this.itemPath = this.getPath(event.node);

    this.EditHandler(event.node.data, event.node.parents || null);
    // this.selectedOption = event.node
  }

  getPath(item: any): any {
    if (!item.parent) {
      return item.label;
    }
    // this.selectedOption = item.label
    return this.getPath(item.parent) + ' > ' + item.label;
  }

  nodeExpand(event: any) {
    this.selectedTreeId = event.node.data.id;
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

  CollapseTree() {
    this.files.forEach((node: any) => {
      this.expandRecursive(node, false);
    });
    // this.cancel();
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  handleScrollEvent() {
    this.current++;
    let paginator = {
      page: this.current,
      size: 15,
    };
    this.getCategorisLookUps(this.current);
  }

  getCategorisLookUps(value: any) {
    this.paginationParams = this.paginationParams.set('page', value);
    this.paginationParams = this.paginationParams.set('per_page', 15);
    this._CategoriesService
      .get(this.paginationParams)
      .pipe(finalize(() => (this.loadingIndicator = false)))
      .subscribe((atts) => {
        this.length = atts.meta.total;
        this.page = atts.meta.last_page;
        this.next = atts.links.next;
        this.asyncData = atts.data
          .map((category: any) => {
            return {
              title_en: category.title_en,
              title_ar: category.title_ar,
              id: category.id,
            };
          })
          .filter((asyncedData: any) => {
            return !this.parentCategories.find(
              (category) => category.id === asyncedData.id
            );
          });
        // this.parentCategories = [...this.parentCategories, ...this.asyncData];
      });
  }

  // start crud operations
  openCreateDialog(flag: boolean) {
    this.display = this.editModeOn = false;
    this.categoryForm.reset();
    this.submitted = false;
    this.viewImage = false;
    this.imagePath = '';
    this.imgaePathText = '';
    this.CollapseTree();
  }

  submit() {
    // console.log(this.categoryForm);
    this.displayAllSubcategories = true
    this.displayAllSubcategoriesOfParent = false
    this.getAllCategoriesParents()

    this.getSubCategoriesOfParentCategories()
    this.btnLoader = true;
    if (this.editModeOn) {
      this.edit();
    } else {
      this.create();
    }
  }

  create() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      this.loadingIndicator = false;
      this.btnLoader = false;
      return;
    } else {
      let createdData = {
        title_ar: this.categoryForm.controls[controlKeys.title_ar].value,
        title_en: this.categoryForm.controls[controlKeys.title_en].value,
        is_featured:
          this.categoryForm.controls[controlKeys.is_featured].value == true
            ? 1
            : 0,
        //slug: this.categoryForm.controls[controlKeys.slug].value,
        cover: this.imageId || null,
        parent_id: this.selectedTreeId,
        // parent_id: this.categoryForm.controls[controlKeys.parent_id]?.value?.id || this.categoryForm.controls[controlKeys.subcategory_id]?.value.id || this.selectedTreeId || '',
        subcategory_id: this.selectedTreeId || ''
      };
      this._CategoriesService
        .create(createdData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
            this.imageId = null;
          })
        )
        .subscribe((data) => {
          this.getAllCategoriesParents();
          this.display = false;
          this.categoryForm.reset();
          this.getParents()
          this.cancel();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Category is created successfully',
          });
        });
    }
  }

  uploadIamge(event: any) {
    const file: File = event.target.files[0];
    if (event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', file);
      this._UploadImageService.uploadImage(formData).subscribe((data: any) => {
        formData.delete('file');
        const reader1 = new FileReader();
        reader1.readAsDataURL(file);
        reader1.onload = (_event) => {
          this.imagePath = reader1.result;
          this.viewImage = true;
          this.imgaePathText = event.target.value.slice(0, 28);
        };
        this.imageId = data.id;
      });
    }
  }
  edit() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      this.loadingIndicator = false;
      return;
    } else {
      let updatedData = {
        title_ar: this.categoryForm.controls[controlKeys.title_ar].value,
        title_en: this.categoryForm.controls[controlKeys.title_en].value,
        is_featured:
          this.categoryForm.controls[controlKeys.is_featured].value == true
            ? 1
            : 0,
        // slug: this.categoryForm.controls[controlKeys.slug].value,
        cover: this.imageId,
        parent_id: this.categoryForm.controls[controlKeys.parent_id].value
          ? this.categoryForm.controls[controlKeys.parent_id].value.id
          : this.categoryForm.controls[controlKeys.subcategory_id]?.value?.id || null,
        // subcategory_id: this.categoryForm.controls[controlKeys.subcategory_id]?.value?.id || ''

      };
      this._CategoriesService
        .update(this.id, updatedData)
        .pipe(
          finalize(() => {
            this.submitted = false;
            this.btnLoader = false;
            this.imageId = null;
          })
        )
        .subscribe((data) => {
          this.editModeOn = false;
          this.itemPath = '';
          this.imgaePathText = '';
          this.imagePath = '';
          this.getAllCategoriesParents();
          // this.getParents()
          this.display = false;
          this.categoryForm.reset();
          this.viewImage = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Category is updated successfully',
          });
          // this.getAllCategoriesParents();

        });
    }
  }

  EditHandler(data: any, parentData: any) {
    this.categoryForm.reset();
    this.editModeOn = true;
    this.display = true;
    this.submitted = false;
    this.id = data.id;
    this.categoryForm.get(controlKeys.title_ar)?.setValue(data.title_ar);
    this.categoryForm.get(controlKeys.title_en)?.setValue(data.title_en);
    this.categoryForm.get(controlKeys.subcategory_id)?.patchValue(data.title_en);
    // this.selectedOption = data.title_en


    this.categoryForm
      .get([controlKeys.is_featured])
      ?.setValue(data.is_featured);
    // this.categoryForm.get(controlKeys.slug)?.setValue(data.slug);
    this.imgaePathText = data?.cover.slice(0, 30);
    this.imagePath = data?.cover;
    if (data.cover === '') {
      this.viewImage = false;
    } else {
      this.viewImage = true;
      this.editImageUrl = data?.cover;
    }
    // this.getCategorisLookUps(this.current)
    if (data.parent_id) {
      let categoryLookups = {
        title_en: parentData?.title_en,
        title_ar: parentData?.title_ar,
        id: parentData?.id,
      };
      let foundCategories = this.parentCategories.find(
        (lookup: any) => lookup.id === data.parent_id
      );
      if (!foundCategories) {
        // this.parentCategories = [...this.parentCategories, categoryLookups];
      }
      this.categoryForm
        .get(controlKeys.parent_id)
        ?.setValue(foundCategories ?? categoryLookups);
      this.onSelectionChange(this.categoryForm.get(controlKeys.parent_id)?.value.id)
      // this.setOptionValue(this.selectedOptionRef, data.title_en)
      // this.categoryForm.get(controlKeys.subcategory_id)?.setValue(data.title_en);
      // this.setOptionValue(this.selectedOptionRef, data.title_en)

    }
  }

  resetSelect() {
    this.categoryForm.get(controlKeys.parent_id)?.reset();
  }
  resetSelectOfSubcategory() {
    this.categoryForm.get(controlKeys.subcategory_id)?.reset()

  }

  deleteCategory() {
    this.showDeletDialog = true;
    this.confirmationService.confirm({
      message: 'do you want to delete this Category ? ',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._CategoriesService.delete(this.id).subscribe((data: any) => {
          this.getAllCategoriesParents();
          this.cancel();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'this Category is Deleted successfully',
          });
        });
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Rejected',
            detail: 'You have rejected',
          },
        ];
      },
    });
  }

  // end crud operation functions

  cancel() {
    this.display = false;
    this.submitted = false;
    this.categoryForm.reset();
    this.editModeOn = false;
    this.viewImage = false;
    this.imgaePathText = '';
    this.imagePath = '';
    this.CollapseTree();
  }

  ngOnInit(): void {
    // this.setSelectedOption();


    // this.getParents()
    // this.getSubCategoriesOfParentCategories()

    // setTimeout(() => {

    // }, 2000);
  }

  getParents() {
    this._CategoriesService.getParentByObs().subscribe((res) => {
      // console.log();
      // console.log('getParents', res);
      this.parentCategories = res.data

    })
  }
  dataCollection: any[] = []
  allSubCategory: any[] = []
  // getSubCategoriesOfParentCategories() {
  //   this._CategoriesService.getParents().then((res) => {
  //     this.parentCategories = res
  //     this.parentCategories.forEach((parent) => {
  //       this._CategoriesService.getChilds(parent.id).then((data) => {

  //         this.subCategoriesOfParent = data.children
  //         data.children.forEach((element: any) => {
  //           if (element.children.length) {
  //             element.children.forEach((ele: any) => {
  //               this.subCategoriesOfParent.push(ele)
  //               console.log('subCategoriesOfParent', this.subCategoriesOfParent);


  //             });
  //             // this.dataCollection = [...this.dataCollection, ...this.subCategoriesOfParent]
  //           }
  //         });





  //       })

  //     })




  //   })
  //   setTimeout(() => {
  //     // console.log('this.dataCollection', this.dataCollection);
  //     // console.log('this.dataCollectionChild', this.dataCollectionChild);

  //   }, 3000);
  // }

  // selectOption(value: string) {
  //   this.selectedOption = value;
  //   const matchingOption = this.selectedOptionRef.options.find((option :any) => option.value === value);
  //   if (matchingOption) {
  //     matchingOption.select();
  //   }
  // }
  // setOptionValue(optionRef: MatOption, newValue: string) {
  //   optionRef.value = newValue;
  // }
  setOptionValue(optionRef: MatOption, newValue: string) {
    optionRef.value = newValue;
  }

  getSubCategoriesOfParentCategories() {
    this.displayAllSubcategories = true
    this.displayAllSubcategoriesOfParent = false
    // console.log('this is one');
    this._CategoriesService.getParentByObs().subscribe((res) => {
      // console.log('getParentByObs', res.data);
      this.parentCategories = res.data
      this.parentCategories.forEach((parent) => {
        this._CategoriesService.getChilds(parent.id).then((data) => {
          this.subCategoriesOfParent = data.children
          this.subCategoriesOfParent.forEach((element: any) => {
            if (element.children.length) {
              element.children.forEach((ele: any) => {
                this.subCategoriesOfParent.push(ele)
                // console.log('subCategoriesOfParent', this.subCategoriesOfParent);
              });
            }
          });
          this.dataCollection = [...this.dataCollection, ...this.subCategoriesOfParent]
          // console.log('this is data', this.dataCollection);




        })

      })


    })

  }

}
