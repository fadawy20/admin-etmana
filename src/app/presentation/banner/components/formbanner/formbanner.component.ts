import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
enum ControlKeys {
  title_ar = "title_ar",
  title_en = "title_en",
  type = "type",
  pageUrl = "pageUrl",
  associateWebsite = "associateWebsite",
  locationInPage = "locationInPage",
  is_active = "is_active"

}

@Component({
  selector: 'app-formbanner',
  templateUrl: './formbanner.component.html',
  styleUrls: ['./formbanner.component.scss']
})
export class FormbannerComponent implements OnInit, OnChanges {
  sliderType: any[] = []
  PageUrls: any[] = []
  AssociateWebsite: any[] = []
  locationInThePage: any[] = []
  formBanner !: FormGroup
  submitted: boolean = false
  // bannerStatus: boolean = false
  @Input() dataBanner: any
  bannerStatus: boolean = false

  constructor(private _fb: FormBuilder) {
    this.formBanner = this._fb.group({
      [ControlKeys.title_ar]: ['', Validators.required],
      [ControlKeys.title_en]: ['', Validators.required],
      // THIS IS WILL BE 2 BECAUSE THAT IS BANNER ==> TYPE === 2
      [ControlKeys.type]: ['', Validators.required],
      [ControlKeys.pageUrl]: ['', Validators.required],
      [ControlKeys.associateWebsite]: ['', Validators.required],
      [ControlKeys.locationInPage]: ['', Validators.required],
      [ControlKeys.is_active]: [false],

    })
  }

  ngOnInit(): void {
    console.log(this.bannerStatus);

    this.getAllArray()
    // THIS IS WILL CREATE ARRAY FROM 1 TO 30 (ONE LINE ONLY)
    // this.locationInThePage = Array.from(Array(30), (_,x) => x + 1);
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
  }
  country: any
  locationInPage: any

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataBanner']) {
      console.log(this.dataBanner);
      this.bannerStatus = this.dataBanner?.is_active ? this.dataBanner?.is_active : false;
      console.log(this.bannerStatus, 'This is banner status on ng changes');

      this.country = this.AssociateWebsite.filter((value) => {
        return value.country_id === this.dataBanner?.country_id?.id
      })[0]
      this.locationInPage = this.locationInThePage.filter((value) => {
        return value.type === this.dataBanner?.location_in_page
      })[0]
      this.formBanner.patchValue({
        is_active: this.bannerStatus,
        title_en: this.dataBanner?.title_en,
        title_ar: this.dataBanner?.title_ar,
        pageUrl: this.dataBanner?.page_url,
        associateWebsite: this.country,
        locationInPage: this.locationInPage
      })

    }

  }
  getAllArray() {
    this.sliderType = [
      //  { name: 'Main Banner 1', type: 1 },
      { name: 'Banner', type: 2 },
      //  { name: 'Main Banner 3', type: 3 },
      //  { name: 'Main Banner 4', type: 4 },
    ];
    this.PageUrls = [
      { name: 'Home', type: 1 },
      { name: 'Product List', type: 2 },
    ]
    this.AssociateWebsite = [
      { name: 'Egypt', country_id: 1 },
      { name: 'Saudi Arabia', country_id: 2 },
    ]

  }



  switchInputStatusBannner(value: any) {
    this.bannerStatus = value.checked
    console.log(this.bannerStatus);

    // console.log('this is the status', this.formBanner.get('is_active')?.setValue(this.bannerStatus));

  }
  handleRuleTypeChangeType(data: any) {
    // console.log('data', data);


  }
  handleRuleTypeChangePageUrl(data: any) {
    console.log('this os page url', data);

  }

  handleRuleTypeChangeAssociateWebsite(data: any) {
    console.log('thi is for association website', data);

  }
  handleRuleTypeChangeLocationPage(data: any) {

  }

}
