import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionTab } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { finalize, debounceTime, of, from } from 'rxjs';
import { CmsService } from 'src/app/Services/cms.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';



type TImgMetaData = { id?: number | null, url?: string | null }
interface IImageUrls {
  desktop_media_ar?: TImgMetaData
  desktop_media_en?: TImgMetaData
  mobile_media_ar?: TImgMetaData
  mobile_media_en?: TImgMetaData
}
type BannerStatus = boolean;
type ShowImageCaption = boolean;
type ShowBannerTitle = boolean
enum ControlKeys {
  is_active_slide = "is_active_slide",
  desktop_media_ar = "desktop_media_ar",
  desktop_media_en = "desktop_media_en",
  mobile_media_ar = "mobile_media_ar",
  mobile_media_en = "mobile_media_en",
  caption_ar = "caption_ar",
  caption_en = "caption_en",
  target_page_url = "target_page_url",
  platform = "platform",
  date_from = "date_from",
  date_to = "date_to"
}
@Component({
  selector: 'app-createbanner',
  templateUrl: './createbanner.component.html',
  styleUrls: ['./createbanner.component.scss']
})
export class CreatebannerComponent implements OnInit {
  idBanner !: number;
  bannerStatus: BannerStatus = false;
  showImageCaption !: ShowImageCaption;
  showBannerTitle !: ShowBannerTitle;
  showArrowNav: boolean = false
  wrapper: any
  wrapper1: any
  fileName: any
  defaultBtn: any
  customBtn: any
  cancelBtn: any
  img: any
  url: any
  platfroms: any[] = [];

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
  showStartImmediately !: boolean
  formBannerTab !: FormGroup
  reaptingSectionForm  !: FormGroup
  items!: FormArray;
  imageUrls: IImageUrls[] = []
  submitted: boolean = false
  @ViewChild('generalFormBanner', { static: false }) generalFormBanner: any
  @ViewChild('tabRef') tabRef!: AccordionTab;

  constructor(private _cmsService: CmsService, private _datePipe: DatePipe, private uploadService: UploadImageService, private _DatePipe: DatePipe, private _fb: FormBuilder, private _router: Router, private _activateRoute: ActivatedRoute, private messageService: MessageService) {
    this.reaptingSectionForm = new FormGroup({
      items: new FormArray([]),
    });
  }
  dataBanner: any
  ngOnInit(): void {
    this.idBanner = this._activateRoute.snapshot.params['id'];
    this.formBannerTab = this._fb.group({
      [ControlKeys.is_active_slide]: [false, Validators.required],
      [ControlKeys.caption_ar]: [''],
      [ControlKeys.caption_en]: [''],
      [ControlKeys.date_from]: ['', Validators.required],
      [ControlKeys.date_to]: ['', Validators.required],
      [ControlKeys.desktop_media_ar]: ['', Validators.required],
      [ControlKeys.desktop_media_en]: ['', Validators.required],
      [ControlKeys.mobile_media_ar]: ['', Validators.required],
      [ControlKeys.mobile_media_en]: ['', Validators.required],
      [ControlKeys.platform]: ['', Validators.required],
      [ControlKeys.target_page_url]: [''],
    })
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
    if (this.idBanner) {
      this._cmsService.getCmsById(this.idBanner).subscribe((res: any) => {
        this.dataBanner = res.data

        this.showArrowNav = this.dataBanner?.is_arrow_visible,
          this.showImageCaption = this.dataBanner?.is_caption_visible
        this.showBannerTitle = this.dataBanner?.is_title_visible
        /**
        * THIS IS WILL SET VALUE OF RIGHT VALUE
        */
        // THIS IS PRIVATE TO IMAGES

        let arrayMedia = (this.dataBanner.slide as []).map((slider: any) => {
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
        // THIS IS PRIVATE TO CONTROLS
        let editControls = (this.dataBanner.slide as []).map((banner: any) => {
          return {
            caption_ar: banner.caption_ar,
            caption_en: banner.caption_en,
            target_page_url: banner.target_page_url
          }
        })
        console.log(editControls, 'edit control');
        this.patchItems(editControls)
        this.formBannerTab.patchValue({
          date_from: new Date(this.dataBanner.slide[0].date_from),
          date_to: new Date(this.dataBanner.slide[0].date_to),
          is_active_slide: this.dataBanner.is_active,
          platform: this.platfroms.filter((platform: any) => {
            return this.dataBanner.slide[0].platform === platform.type
          })[0]
        })
        // THIS IS PRIVATE TO CONTROLS



      })


    }
  }

  handleCreateOrUpdate() {
    if (this.idBanner) {
      this.updateBanner()
    } else {
      this.createBanner()
    }
  }
  createBanner() {
    this.submitted = true
    this.generalFormBanner.submitted = true;
    if (this.formBannerTab.invalid && this.items.invalid) {
      return
    } else {
      // THIS IS GENERAL INFORMATION
      let generalFormBannerValues = {
        is_active: this.generalFormBanner.formBanner.get('is_active').value,
        title_en: this.generalFormBanner.formBanner.get('title_en').value,
        title_ar: this.generalFormBanner.formBanner.get('title_ar').value,
        type: 2,
        page_url: this.generalFormBanner.formBanner.get('pageUrl').value,
        country_id: this.generalFormBanner.formBanner.get('associateWebsite').value?.country_id,
        is_arrow_visible: this.showArrowNav,
        is_caption_visible: this.showImageCaption,
        is_title_visible: this.showBannerTitle,
        location_in_page: this.generalFormBanner.formBanner.get('locationInPage').value?.type,
      }
      // THIS IS GENERAL INFORMATION



      // THIS SLIDER FROM LEFT
      const newArrayOfMedia = this.imageUrls.map((obj) => {
        return {
          desktop_media_ar: obj?.desktop_media_ar?.id,
          desktop_media_en: obj?.desktop_media_en?.id,
          mobile_media_en: obj?.mobile_media_en?.id,
          mobile_media_ar: obj?.mobile_media_ar?.id,
        }
      })

      const newArrayOfCaption = this.reaptingSectionForm.get('items')?.value.map((control: any) => {
        return {
          caption_ar: control.caption_ar,
          caption_en: control.caption_en,
          target_page_url: control.target_page_url
        }

      });


      // THIS SLIDER FROM LEFT

      // THIS IS COLLECTION OF TWO DATA (MEDIA AND CAPTION)
      // const newArray = newArrayOfMedia.map((item, index) => ({
      //   ...item,
      //   ...newArrayOfCaption[index],
      //   is_active: this.formBannerTab.get('is_active_slide')?.value,
      //   platform: this.formBannerTab.get('platform')?.value?.type,
      //   date_from: this._DatePipe.transform(this.formBannerTab.get('date_from')?.value, 'yyyy-MM-dd'),
      //   date_to: this._DatePipe.transform(this.formBannerTab.get('date_to')?.value, 'dd-MM-yyyy')
      // }));
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
          ...newArrayOfCaption[index],
          is_active: this.formBannerTab.get('is_active_slide')?.value,
          platform: this.formBannerTab.get('platform')?.value?.type,
          date_from: this._DatePipe.transform(this.formBannerTab.get('date_from')?.value, 'yyyy-MM-dd'),
          date_to: this._DatePipe.transform(this.formBannerTab.get('date_to')?.value, 'dd-MM-yyyy')

        }

      });

      // THIS IS THE DATA IS SEND TO BACKEND
      let allData = {
        ...generalFormBannerValues,
        slides: [...newArray]
      }
      console.log('This is all data', allData);

      this._cmsService.storeCms(allData).pipe(finalize(() => {

      })).subscribe((res) => {
        console.log('This is response' + res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Banner Created Successfully' })
        setTimeout(() => {
          this._router.navigateByUrl('/Dashboard/banner')
        }, 3000);
      })
    }


  }

  updateBanner() {
    let generalFormBannerValues = {
      is_active: this.generalFormBanner.formBanner.get('is_active').value,
      title_en: this.generalFormBanner.formBanner.get('title_en').value,
      title_ar: this.generalFormBanner.formBanner.get('title_ar').value,
      type: 2,
      page_url: this.generalFormBanner.formBanner.get('pageUrl').value,
      country_id: this.generalFormBanner.formBanner.get('associateWebsite').value?.country_id,
      is_arrow_visible: this.showArrowNav,
      is_caption_visible: this.showImageCaption,
      is_title_visible: this.showBannerTitle,
      location_in_page: this.generalFormBanner.formBanner.get('locationInPage').value?.type,
    }
    // THIS IS GENERAL INFORMATION



    // THIS SLIDER FROM LEFT
    const newArrayOfMedia = this.imageUrls.map((obj) => {
      return {
        desktop_media_ar: obj?.desktop_media_ar?.id,
        desktop_media_en: obj?.desktop_media_en?.id,
        mobile_media_en: obj?.mobile_media_en?.id,
        mobile_media_ar: obj?.mobile_media_ar?.id,
      }
    })

    const newArrayOfCaption = this.reaptingSectionForm.get('items')?.value.map((control: any) => {
      return {
        caption_ar: control.caption_ar,
        caption_en: control.caption_en,
        target_page_url: control.target_page_url
      }

    });

    let bannerIds = (this.dataBanner.slide as []).map((bannner: any) => {
      return {
        slide_id: bannner?.id
      }
    })
    console.log(bannerIds, 'This is bannner ids');


    // THIS SLIDER FROM LEFT

    // THIS IS COLLECTION OF TWO DATA (MEDIA AND CAPTION)
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
        ...bannerIds[index],
        ...newArrayOfCaption[index],
        is_active: this.formBannerTab.get('is_active_slide')?.value,
        platform: this.formBannerTab.get('platform')?.value?.type,
        date_from: this._DatePipe.transform(this.formBannerTab.get('date_from')?.value, 'yyyy-MM-dd'),
        date_to: this._DatePipe.transform(this.formBannerTab.get('date_to')?.value, 'dd-MM-yyyy')

      }
      // ...item,
      // ...newArrayOfCaption[index],
      // is_active: this.formBannerTab.get('is_active_slide')?.value,
      // platform: this.formBannerTab.get('platform')?.value?.type,
      // date_from: this._DatePipe.transform(this.formBannerTab.get('date_from')?.value, 'yyyy-MM-dd'),
      // date_to: this._DatePipe.transform(this.formBannerTab.get('date_to')?.value, 'dd-MM-yyyy')
    });

    // THIS IS THE DATA IS SEND TO BACKEND
    let allData = {
      ...generalFormBannerValues,
      slides: [...newArray]
    }
    console.log('This is all data', allData);
    this._cmsService.updateCms(this.idBanner, allData).subscribe((res: any) => {
      // console.log('Response updated : ', res);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Banner Updated Successfully' })
      setTimeout(() => {
        this._router.navigateByUrl('/Dashboard/banner')
      }, 3000)

    })
  }


  createItem(item: any = null): FormGroup {
    return this._fb.group({
      desktop_media_en: item ? item.desktop_media_ar : '',
      desktop_media_ar: item ? item.desktop_media_ar : '',
      mobile_media_en: item ? item.mobile_media_en : '',
      mobile_media_ar: item ? item.mobile_media_ar : '',
      caption_en: [item ? item.caption_en : ''],
      caption_ar: [item ? item.caption_ar : ''],
      target_page_url: [item ? item.target_page_url : ''],

    });
  }

  addItem(): void {
    this.items = this.reaptingSectionForm.get('items') as FormArray;
    this.items.push(this.createItem());
    console.log(this.items.length);
    this.imageUrls.push({ desktop_media_en: { url: '', id: null }, desktop_media_ar: { url: '', id: null }, mobile_media_en: { url: '', id: null }, mobile_media_ar: { url: '', id: null } })
  }

  patchItems(items: any[]): void {
    const itemsFormArray = this.reaptingSectionForm.get('items') as FormArray;
    items.forEach((item) => {
      itemsFormArray.push(this.createItem(item));
    });
  }
  print() {
    console.log('Form', this.reaptingSectionForm);

  }
  deleteItem(index: number) {
    this.items = this.reaptingSectionForm.get('items') as FormArray;
    this.items.removeAt(index)
  }

  testinput(value: any) {
    console.log('This is input', value);

  }

  /* refactor uploadcoverimage  */

  uploadCoverImage(file: any, type: keyof IImageUrls, index: number) {
    const files = file.target.files[0];
    if (files.length === 0) return;
    if (!this.isImage(files.type)) return this.uploadErrorMessage();

    this.setImageId(files, (id) => {
      this.setImageUrl(files, (url) => {
        this.imageUrls[index][type] = { id: id, url: url }
        // console.log(this.reaptingSectionForm.get('items')?.value[index][type], 'This is an array');
        // console.log(this.reaptingSectionForm.value);
        console.log(this.imageUrls, 'This is an array Images');


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
    this.imageUrls[index][type] = { url: "", id: null }
    console.log(this.imageUrls, 'This is after deleting');

  }

















  // THIS IS BELONGS TO THE UPLOAD DESKTOP IMAGE ONE (1)



  handleRuleTypeChangeArrowSizes(data: any) {

  }

  changeValidility(isShow: any) {
    // console.log('is show', isShow);

  }
  changeValidilityImageIcon(showImageIcon: any) {

  }
  changeValidilitySliderTitle(showSliderTitle: any) {

  }

  handleRuleTypeChangePlatform(data: any) {
    // console.log(data, 'This is data');
    console.log('this is form control', this.formBannerTab.get('platform')?.value?.type);
    // this.pushToArray()
  }

  pushToArray() {
    if (this.formBannerTab.get('platform')?.value?.type === 1) {
      this.imageUrls.push({ desktop_media_en: { url: '', id: null }, desktop_media_ar: { url: '', id: null } })
      console.log('image url for web ', this.imageUrls);


    } else if (this.formBannerTab.get('platform')?.value?.type === 3) {
      this.imageUrls.push({ mobile_media_en: { url: '', id: null }, mobile_media_ar: { url: '', id: null } })
      console.log('image url for mobile', this.imageUrls);

    } else if (this.formBannerTab.get('platform')?.value?.type === 5) {
      this.imageUrls.push({ desktop_media_en: { url: '', id: null }, desktop_media_ar: { url: '', id: null }, mobile_media_en: { url: '', id: null }, mobile_media_ar: { url: '', id: null } })
      console.log('image url for all', this.imageUrls);

    }
  }



  backToList() {
    this._router.navigateByUrl('/Dashboard/banner')
  }

  changeValidilityImageCaption(data: any) {
    // console.log('this is sataus in banner field', data);
    this.showImageCaption = data.checked
    console.log(this.showImageCaption, 'this is show image caption');

  }

  changeValidatiyArrowNav(data: any) {
    this.showArrowNav = data.checked
    console.log(this.showArrowNav, 'This is show arrow nav');

  }
  changeValidilityShowBannerTitle(data: any) {
    this.showBannerTitle = data.checked
    // console.log('show banner title', data.checked);

  }
  onTabHeaderClick(tab: AccordionTab) {
    // console.log(tab);
    var shouldExpand = false
    if (tab?.cache == true) {
      shouldExpand = false
    }

    if (!shouldExpand) {
      tab.toggle(false); // Prevent default behavior
    }
  }



}
