import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, flatMap } from 'rxjs';
import { CmsService } from 'src/app/Services/cms.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';
import { Message } from 'primeng/api';
import { AccordionTab } from 'primeng/accordion';

enum ControlKeys {
  duration_time = "duration_time",
  arrow_size = "arrow_size",
  showArrowSize = "showArrowSize",
  showImageIcon = "showImageIcon",
  showSliderTitle = "showSliderTitle",
}
type TImgMetaData = { id: number | null, url: string | null }
interface IImageUrls {
  desktop_media_ar: TImgMetaData
  desktop_media_en: TImgMetaData
  mobile_media_ar: TImgMetaData
  mobile_media_en: TImgMetaData
}
interface IBanners {
  desktop_media_ar: TImgMetaData
  desktop_media_en: TImgMetaData
  mobile_media_ar: TImgMetaData
  mobile_media_en: TImgMetaData
}
@Component({
  selector: 'app-createslider',
  templateUrl: './createslider.component.html',
  styleUrls: ['./createslider.component.scss'],

})
export class CreatesliderComponent implements OnInit {
  idSlider: undefined;
  loader !: boolean
  sliderStatus: boolean = false
  durationTime: any[] = [];
  arrowSizes: any[] = [];
  platfroms: any[] = [];
  showArrowNav: boolean = false
  showCaption: boolean = false
  showSliderTitle: boolean = false
  showStartImmediately: boolean = false
  listArr: any[] = [];
  wrapper: any
  wrapper1: any
  fileName: any
  defaultBtn: any
  customBtn: any
  cancelBtn: any
  img: any
  url: any
  urlSecondImage: any
  viewImage: boolean = false
  viewImage1: boolean = false
  defaultbtn1: any
  cancelBtn1: any
  defaultBtnMobile1: any;
  urlFirstMobile: any;
  viewImageMobile1: any
  wrapperMobile1: any;
  wrapperMobile2: any;
  defaultBtnMobile2: any
  urlSecondMobile: any;
  viewImageMobile2: any
  @ViewChild('formSlider', { static: false }) FormSlider !: any
  @ViewChild('tabRef') tabRef!: AccordionTab;
  // isHighlighted: boolean = true; // Set this based on your condition


  settingSliderForm !: FormGroup
  submitted: boolean = false
  sliderForm !: FormGroup
  items!: FormArray;
  sectionSliderStatus: any = false
  uploader !: any;


  imageUrls: IImageUrls[] = []
  messages: Message[] | undefined;
  dataSLider: any



  constructor(private _route: Router, private _cmsService: CmsService, private _datePipe: DatePipe, private _fb: FormBuilder, private _activateRoute: ActivatedRoute, private router: Router, private activatedRoute: ActivatedRoute,
    private uploadService: UploadImageService,
    private messageService: MessageService) {
    this.settingSliderForm = this._fb.group({
      [ControlKeys.duration_time]: ['', Validators.required],
      [ControlKeys.arrow_size]: ['', Validators.required],
      [ControlKeys.showArrowSize]: [false, Validators.required],
      [ControlKeys.showImageIcon]: [false, Validators.required],
      [ControlKeys.showSliderTitle]: [false, Validators.required],

    })
    // THIS IS BELONGS TO SHOW ARROW NAV
    // this.settingSliderForm.get('showArrowSize')?.setValue(true)
    // this.showArrowNav = this.settingSliderForm.get('showArrowSize')?.value

    this.sliderForm = new FormGroup({
      items: new FormArray([]),
    });

  }

  duration_Time !: any
  arrow_size: any
  ngOnInit(): void {
    this.idSlider = this._activateRoute.snapshot.params['id'];
    if (this.idSlider) {
      this._cmsService.getCmsById(this.idSlider).subscribe((res) => {
        this.dataSLider = res?.data
        console.log(this.dataSLider, 'This is slider data');

        // THIS IS WIIL PATCH VALUE OF SETTINGS SLIDER
        this.duration_Time = this.durationTime.filter((value) => {
          return value.type === this.dataSLider?.duration_time
        })[0]
        this.arrow_size = this.arrowSizes.filter((value) => {
          return value.type === this.dataSLider?.arrow_size
        })[0]

        this.showArrowNav = this.dataSLider?.is_arrow_visible
        this.showCaption = this.dataSLider?.is_caption_visible
        this.showSliderTitle = this.dataSLider?.is_title_visible


        this.settingSliderForm.patchValue({
          duration_time: this.duration_Time,
          arrow_size: this.arrow_size
        })
        // THIS IS WIIL PATCH VALUE OF SETTINGS SLIDER
        /**
         * THIS IS WILL SET VALUE OF RIGHT VALUE
         */
        // THIS IS PRIVATE TO IMAGES
        let arrayMedia = (this.dataSLider.slide as []).map((slider: any) => {
          return {
            desktop_media_en: slider.desktop_media_en,
            desktop_media_ar: slider.desktop_media_ar,
            mobile_media_en: slider?.mobile_media_en,
            mobile_media_ar: slider?.mobile_media_ar

          }
        })
        console.log('This is media slider', arrayMedia);

        this.imageUrls = arrayMedia.map((item: any) => {
          return {
            desktop_media_en: { url: item.desktop_media_en, id: null },
            desktop_media_ar: { url: item.desktop_media_ar, id: null },
            mobile_media_en: { url: item.mobile_media_en, id: null },
            mobile_media_ar: { url: item.mobile_media_ar, id: null },
          }
        })
        console.log('This is img urls in on init:', this.imageUrls);

        // THIS IS PRIVATE TO IMAGES
        // THIS IS PRIVATE TO CONTROLS OF FORM ARRAY
        let editControls = (this.dataSLider.slide as []).map((slider: any) => {
          return {
            caption_ar: slider.caption_ar,
            caption_en: slider.caption_en,
            date_from: new Date(slider.date_from),
            date_to: new Date(slider.date_to),
            is_active_slide: slider.is_active,
            platform: this.platfroms.filter((platform: any) => {
              return slider.platform === platform.type
            })[0],
            target_page_url: slider.target_page_url
          }
        })
        console.log(editControls, 'edit control');
        this.patchItems(editControls)








      })
    }


    this.durationTime = [
      {
        name: '1s', type: 1
      },
      {
        name: '2s', type: 2
      },
      {
        name: '3s', type: 3
      },
      {
        name: '4s', type: 4
      },
      {
        name: '5s', type: 5
      },
      {
        name: '6s', type: 6
      },
      {
        name: '7s', type: 7
      },
      {
        name: '8s', type: 8
      },
    ]
    this.arrowSizes = [{
      name: 'Small', type: 1
    },
    {
      name: 'Meduim', type: 2
    },
    {
      name: 'Large', type: 3
    },
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
  get generalSlider() {
    return this.FormSlider.generalInfoFormSlider.value
  }


  createItem(item: any = null): FormGroup {
    return this._fb.group({
      is_active_slide: item ? item.is_active_slide : false,
      desktop_media_en: item ? item.desktop_media_en : '',
      desktop_media_ar: item ? item.desktop_media_ar : '',
      mobile_media_en: item ? item.mobile_media_en : '',
      mobile_media_ar: item ? item.mobile_media_ar : '',
      caption_en: [item ? item.caption_en : ''],
      caption_ar: [item ? item.caption_ar : ''],
      target_page_url: [item ? item.target_page_url : ''],
      platform: [item ? item.platform : ''],
      date_from: [item ? item.date_from : '', Validators.required],
      date_to: [item ? item.date_to : '', Validators.required],
      // date_to: [item ? item.date_to : '', Validators.required],
    });
  }

  addItem(): void {
    this.items = this.sliderForm.get('items') as FormArray;
    this.items.push(this.createItem());
    this.imageUrls.push({ desktop_media_ar: { url: '', id: null }, desktop_media_en: { url: '', id: null }, mobile_media_ar: { url: '', id: null }, mobile_media_en: { url: '', id: null } })
  }

  patchItems(items: any[]): void {
    const itemsFormArray = this.sliderForm.get('items') as FormArray;
    items.forEach((item) => {
      itemsFormArray.push(this.createItem(item));
    });
  }


  testinput(value: any, tab: AccordionTab) {
    this.sectionSliderStatus = value.checked;
    // console.log('===>', this.sliderForm.get('items')?.value);
    console.log(tab);
    var shouldExpand = false
    if (tab?.cache == true) {
      shouldExpand = false
    }

    if (!shouldExpand) {
      // event.preventDefault()
      tab.toggle(false); // Prevent default behavior
    }





  }
  handleCreateOrUpdate() {
    if (this.idSlider) {
      this.updateSlider()
    } else {
      this.createSlider()
    }
  }

  createSlider() {
    this.submitted = true
    this.FormSlider.submitted = true
    if (this.items.invalid) {
      return;




    }

    else {
      // THIS IS FORM IN LEFT AS GENERAL DATA AND IS READY TO DO ...!
      let generalInfoSlider = {
        is_active: this.FormSlider.generalInfoFormSlider.get('is_active')?.value,
        title_ar: this.FormSlider.generalInfoFormSlider.get('title_ar')?.value,
        title_en: this.FormSlider.generalInfoFormSlider.get('title_en')?.value,
        type: 1,
        page_url: this.FormSlider.generalInfoFormSlider.get('page_url')?.value,
        country_id: this.FormSlider.generalInfoFormSlider.get('associateWebsite')?.value.country_id,
        location_in_page: this.FormSlider.generalInfoFormSlider.get('location_in_page')?.value.type

      }
      // THIS IS FORM IN LEFT AS GENERAL DATA AND IS READY TO DO ...!

      // THIS IS SETTING INFORMATION
      let settingSliderForm = {
        duration_time: this.settingSliderForm.value?.duration_time.type,
        arrow_size: this.settingSliderForm.value?.arrow_size.type,
        is_arrow_visible: this.showArrowNav,
        is_caption_visible: this.showCaption,
        is_title_visible: this.showSliderTitle
      }
      // THIS IS SETTING INFORMATION

      /**
       * ****  // THIS IS SLIDER FROM RIGHT
       */
      const newArrayOfMedia = this.imageUrls.map((obj) => {
        return {
          desktop_media_ar: obj?.desktop_media_ar?.id,
          desktop_media_en: obj?.desktop_media_en?.id,
          mobile_media_en: obj?.mobile_media_en?.id,
          mobile_media_ar: obj?.mobile_media_ar?.id,
        }
      })
      // This is is is is is is
      const newArray = newArrayOfMedia.map((item, index) => {
        const nonNullProperties: any = {}; // Define the type as per your data structure
        if (item.desktop_media_ar !== null) {
          nonNullProperties.desktop_media_ar = item.desktop_media_ar;
        }
        if (item?.desktop_media_en !== null) {
          nonNullProperties.desktop_media_en = item.desktop_media_en;
        }
        if (item?.mobile_media_ar !== null) {
          nonNullProperties.mobile_media_ar = item.mobile_media_ar;
        }
        if (item?.mobile_media_en !== null) {
          nonNullProperties.mobile_media_en = item.mobile_media_en;
        }
        return {
          ...nonNullProperties,
        }

      });

      // console.log(newArray, 'This is new array');


      // THIS IS THE LIST OF ITEMS OF ARRAY (ITEMS)
      const controlsOfItems = this.sliderForm.get('items')?.value.map((control: any) => {
        return {
          is_active: control?.is_active_slide,
          caption_en: control?.caption_en,
          caption_ar: control?.caption_ar,
          target_page_url: control?.target_page_url,
          platform: control?.platform.type ? control?.platform.type : 5,
          date_from: this._datePipe.transform(control?.date_from, 'yyyy-MM-dd'),
          date_to: this._datePipe.transform(control?.date_to, 'yyyy-MM-dd')
        }
      })

      const mixArray = newArray.map((item, index) => ({
        ...item,
        ...controlsOfItems[index]
      }))

      // THIS IS FINAL ARRAY
      let finalArray = {
        ...generalInfoSlider,
        ...settingSliderForm,
        slides: [...mixArray]
      }
      console.log('This is final array', finalArray);
      /**
     * ****  // THIS IS SLIDER FROM RIGHT
     */

      // dont miss this after create slider that will navigate to the slider page
      this._cmsService.storeCms(finalArray)
        .pipe(finalize(() => {
        }))
        .subscribe((res: any) => {
          // The response is coming from the server then add message service to show that created
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Slider Created Successfully' })
          setTimeout(() => {
            this._route.navigateByUrl('/Dashboard/slider')
          }, 3000);
        })
    }

  }
  updateSlider() {

    let generalInfoSlider = {
      is_active: this.FormSlider.generalInfoFormSlider.get('is_active')?.value,
      title_ar: this.FormSlider.generalInfoFormSlider.get('title_ar')?.value,
      title_en: this.FormSlider.generalInfoFormSlider.get('title_en')?.value,
      type: 1,
      page_url: this.FormSlider.generalInfoFormSlider.get('page_url')?.value,
      country_id: this.FormSlider.generalInfoFormSlider.get('associateWebsite')?.value.country_id,
      location_in_page: this.FormSlider.generalInfoFormSlider.get('location_in_page')?.value.type

    }
    // THIS IS FORM IN LEFT AS GENERAL DATA AND IS READY TO DO ...!

    // THIS IS SETTING INFORMATION
    let settingSliderForm = {
      duration_time: this.settingSliderForm.value?.duration_time.type,
      arrow_size: this.settingSliderForm.value?.arrow_size.type,
      is_arrow_visible: this.showArrowNav,
      is_caption_visible: this.showCaption,
      is_title_visible: this.showSliderTitle
    }
    // THIS IS SETTING INFORMATION

    /**
     * ****  // THIS IS SLIDER FROM RIGHT
     */
    const newArrayOfMedia = this.imageUrls.map((obj) => {
      return {
        desktop_media_ar: obj?.desktop_media_ar?.id,
        desktop_media_en: obj?.desktop_media_en?.id,
        mobile_media_en: obj?.mobile_media_en?.id,
        mobile_media_ar: obj?.mobile_media_ar?.id,
      }
    })
    console.log(newArrayOfMedia, 'This is media updated');
    let slidesIds = (this.dataSLider.slide as []).map((slider: any) => {
      return {
        slide_id: slider?.id
      }
    })
    console.log(slidesIds, 'This is slides ids');






    // THIS IS THE LIST OF ITEMS OF ARRAY (ITEMS)
    const controlsOfItems = this.sliderForm.get('items')?.value.map((control: any) => {
      return {
        is_active: control?.is_active_slide,
        caption_en: control?.caption_en,
        caption_ar: control?.caption_ar,
        target_page_url: control?.target_page_url,
        platform: control?.platform.type,
        date_from: this._datePipe.transform(control?.date_from, 'yyyy-MM-dd'),
        date_to: this._datePipe.transform(control?.date_to, 'yyyy-MM-dd')
      }
    })
    const newArray = newArrayOfMedia.map((item, index) => {
      const nonNullProperties: any = {}; // Define the type as per your data structure
      if (item.desktop_media_ar !== null) {
        nonNullProperties.desktop_media_ar = item.desktop_media_ar;
      }
      if (item?.desktop_media_en !== null) {
        nonNullProperties.desktop_media_en = item.desktop_media_en;
      }
      if (item?.mobile_media_ar !== null) {
        nonNullProperties.mobile_media_ar = item.mobile_media_ar;
      }
      if (item?.mobile_media_en !== null) {
        nonNullProperties.mobile_media_en = item.mobile_media_en;
      }
      return {
        ...nonNullProperties,
        ...slidesIds[index],
        ...controlsOfItems[index]
      }

    });
    console.log(newArray, 'This is new array of properties');

    // const mixArray = newArray.map((item, index) => {
    //   const nonNullProperties: any = {}; // Define the type as per your data structure
    //   if (item.desktop_media_ar !== null) {
    //     nonNullProperties.desktop_media_ar = item.desktop_media_ar;
    //   }
    //   if (item?.desktop_media_en !== null) {
    //     nonNullProperties.desktop_media_en = item.desktop_media_en;
    //   }
    //   if (item?.mobile_media_ar !== null) {
    //     nonNullProperties.mobile_media_ar = item.mobile_media_ar;
    //   }
    //   if (item?.mobile_media_en !== null) {
    //     nonNullProperties.mobile_media_en = item.mobile_media_en;
    //   }
    //   return {
    //     ...nonNullProperties,
    //     ...slidesIds[index],
    //     ...controlsOfItems[index]
    //   };
    // })
    // console.log('This is mix array :', mixArray);


    // THIS IS FINAL ARRAY
    let finalArray = {
      ...generalInfoSlider,
      ...settingSliderForm,
      slides: [...newArray]
    }
    console.log('This is final array', finalArray);

    this._cmsService.updateCms(this.idSlider, finalArray)
      .pipe(finalize(() => {

      }))
      .subscribe((data) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Slider Updated Successfully' })
        setTimeout(() => {
          this._route.navigateByUrl('/Dashboard/slider')
        }, 3000);

      })



  }







  changeValidatiyArrowNav(data: any) {
    console.log('show arrow nnav 1', this.showArrowNav);
    this.showArrowNav = data.checked
    this.settingSliderForm.get('showArrowSize')?.setValue(this.showArrowNav)
  }
  changeValidilityImageIcon(data: any) {
    this.showCaption = data.checked
    this.settingSliderForm.get('showImageIcon')?.setValue(this.showCaption)


  }
  changeValidilitySliderTitle(data: any) {
    this.showSliderTitle = data.checked
    this.settingSliderForm.get('showSliderTitle')?.setValue(this.showSliderTitle)

  }




  /* refactor uploadcoverimage  */

  uploadCoverImage(file: any, type: keyof IImageUrls, index: number) {
    const files = file.target.files[0];
    if (files.length === 0) return;
    if (!this.isImage(files.type)) return this.uploadErrorMessage();

    this.setImageId(files, (id) => {
      this.setImageUrl(files, (url) => {
        this.imageUrls[index][type] = { id: id, url: url }
        console.log(this.imageUrls, 'image url');

      })
    })

    this.viewImage = true

  }

  isImage(mimeType: string) {
    return mimeType.match(/image\/*/) == null ? false : true;
  }

  setImageId(file: any, fun = (id: any) => { }) {
    const formData = new FormData();
    formData.append('file', file);
    return this.uploadService.uploadImage(formData).subscribe(data => {
      fun(data.id);
    })
  }

  setImageUrl(file: any, fun = (src: any) => { }) {
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const src = reader.result
      fun(src)
    }
  }

  uploadErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error uploading file',
      detail: 'Only images are supported.',
    });
  }


  deleteImage(event: Event, type: keyof IImageUrls, index: number) {
    event.stopPropagation()
    event.preventDefault()
    this.imageUrls[index][type].url = ''
    this.imageUrls[index][type].id = null
    console.log(this.imageUrls, 'This is after deleting');

  }


  backToList() {
    this.router.navigateByUrl('/Dashboard/slider')
  }
  handleRuleTypeChangeDurationTime(data: any) {

  }

  handleRuleTypeChangeArrowSizes(data: any) {
    console.log(this.settingSliderForm.get('arrow_size')?.value);


  }

  changeValidility(isShow: any) {
    console.log('is show', isShow);
    this.showArrowNav = isShow.checkedc

  }

  handleRuleTypeChangePlatform(data: any) { }

  deleteItem(index: number) {
    this.items = this.sliderForm.get('items') as FormArray;
    this.items.removeAt(index)
  }

  onTabHeaderClick(event: Event, tab: AccordionTab) {
    console.log(tab);
    console.log(event);

    var shouldExpand = false
    if (tab?.id == 'p-accordiontab-0') {
      shouldExpand = false
    }

    if (!shouldExpand) {
      // event.preventDefault()
      tab.toggle(false); // Prevent default behavior
    }
  }


}
