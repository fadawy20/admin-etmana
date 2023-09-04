import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

}

@Component({
  selector: 'app-formslider',
  templateUrl: './formslider.component.html',
  styleUrls: ['./formslider.component.scss']
})
export class FormsliderComponent implements OnInit, OnChanges {
  sliderType: any[] = []
  PageUrls: any[] = []
  generalInfoFormSlider !: FormGroup
  AssociateWebsite: any[] = []
  submitted: boolean = false
  sliderStatus: boolean = false
  locationInThePage: any[] = []
  @Input() dataSlider: any;

  constructor(private _fb: FormBuilder) {
    this.generalInfoFormSlider = this._fb.group({
      [ControlKeys.title_en]: ['', Validators.required],
      [ControlKeys.title_ar]: ['', Validators.required],
      [ControlKeys.is_active]: [false],
      [ControlKeys.type]: [1],
      [ControlKeys.page_url]: ['', Validators.required],
      [ControlKeys.associateWebsite]: ['', Validators.required],
      [ControlKeys.location_in_page]: [''],

    })
  }

  testinput(data: any) {
    this.sliderStatus = data.checked;
    // console.log('This is form control', this.generalInfoFormSlider.get('is_active')?.value);

  }

  ngOnInit(): void {
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
    this.getAllArray()

    this.generalInfoFormSlider.patchValue({
      title_en: this.dataSlider?.title_en
    })
  }

  // THIS IS ASSIGN VALUE TO THE GENERAL INFO FORM OF SLIDER
  country: any
  locationInPage: any
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSlider']) {
      // console.log(changes['dataSlider'], 'this is the data slider ===>');
      this.country = this.AssociateWebsite.filter((value) => {
        return value.country_id === this.dataSlider?.country_id?.id
      })[0]
      this.locationInPage = this.locationInThePage.filter((value) => {
        return value.type === this.dataSlider?.location_in_page
      })[0]
      this.sliderStatus = this.dataSlider?.is_active ? this.dataSlider?.is_active : false
      this.generalInfoFormSlider.patchValue({
        is_active: this.sliderStatus,
        title_en: this.dataSlider?.title_en,
        title_ar: this.dataSlider?.title_ar,
        page_url: this.dataSlider?.page_url,
        associateWebsite: this.country,
        location_in_page: this.locationInPage
      })
    }
  }
  // THIS IS ASSIGN VALUE TO THE GENERAL INFO FORM OF SLIDER



  handleRuleTypeChangeType(data: any) {
    // console.log('data', data);

  }
  handleRuleTypeChangePageUrl(data: any) {
    console.log('this os page url', data);

  }

  handleRuleTypeChangeAssociateWebsite(data: any) {
    console.log('thi is for association website', data);

  }

  getAllArray() {
    this.sliderType = [
      { name: 'Slider', type: 1 },
    ];
    this.AssociateWebsite = [
      { name: 'Egypt', country_id: 1 },
      { name: 'Saudi Arabia', country_id: 2 },
    ]

  }

  handleRuleTypeChangeLocationPage(data: any) { }

}
