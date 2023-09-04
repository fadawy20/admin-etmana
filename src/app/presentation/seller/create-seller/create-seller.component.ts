import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { combineLatest, finalize } from 'rxjs';
import { SellerService } from 'src/app/Services/seller.service';
import { UploadImageService } from 'src/app/Services/upload-image.service';

export enum controlKeys {
  name = 'name',
  vat_id = 'vat_id',
  bank_account = 'bank_account',
  commission_percentage = 'commission_percentage',
  payment_terms = 'payment_terms',
  email = 'email',
  emailContract = 'email',
  password = 'password',
  phoneContract = 'phone',
  is_active = 'is_active',
  country_id = 'country_id',
  governorate_id = 'governorate_id',
  city_id = 'city_id',
  address_details = 'address_details',
  building_no = 'building_no',
  floor_no = 'floor_no',
  apartment_no = 'apartment_no',
  notes = 'notes',
  commercial_record = 'commercial_record',
  price = 'price',
  zone = 'zone',
  name_ar = 'name_ar',
  name_en = 'name_en',
  seller_logo = 'seller_logo',
  commercial_name_ar = 'commercial_name_ar',
  commercial_name_en = 'commercial_name_en',
  tax_card = 'tax_card',
  website = 'website',
  Type = 'Type',
  code = 'code',
  title = 'title',
  phoneNumber = 'phoneNumber',
  contract = 'contract',
  upload_cr = 'upload_cr',
}
@Component({
  selector: 'app-create-seller',
  templateUrl: './create-seller.component.html',
  styleUrls: ['./create-seller.component.scss'],
})
export class CreateSellerComponent implements OnInit {
  editModeTable: boolean = false;
  isLoading: boolean = false;
  public tabName: string = 'seller';
  submitted: boolean = false;
  url: any;
  isColor!: boolean;
  images: any[] = [];
  isDisabled: boolean = false;
  country_obj = {};
  SellerForm!: FormGroup;
  ContactForm!: FormGroup;
  LegalForm!: FormGroup;
  FinanceForm!: FormGroup;
  tableOfContacts: any[] = [];
  phoneForm!: FormGroup;
  country: any[] = [];
  governs: any[] = [];
  cities: any[] = [];
  ContactType: string = '';
  selectedMenu: any = '';
  contactArr: any[] = [];
  disPlayContactObj = {};
  tableIndex: number = 0;
  editSellerMode: boolean = false;
  SellerId: any;
  UploadCr: any;
  contactType: any[] = [];
  fileUploadCRId: number = 0;
  fileUploadCRPath: any;
  fileTaxCardId: number = 0;
  fileTaxCardPath: any;
  fileContractId: number = 0;
  fileContractPath: any;
  isHidden: boolean = true;
  countries!: any[];
  fileCRValue: string = '';
  fileTaxCardValue: string = '';
  fileContractValue: string = '';
  constructor(
    private messageService: MessageService,
    private _SellerServices: SellerService,
    private fb: FormBuilder,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _UploadImageService: UploadImageService
  ) {
    this.countries = [
      {
        name: '+2',
        code: 'egypt',
        img: '../../assets/images/egypt.png',
      },
      {
        name: '+966',
        code: 'KSA',
        img: '../../assets/images/download (3).png',
      },
    ];
    // Get countries
    this._SellerServices.geCoutries().subscribe((countries) => {
      this.country = countries.data;
    });
    //
    // get id in paramsUrl and set id in var
    this._ActivatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.SellerId = params.get('id');
      if (this.SellerId) {
        this.handleEditSeller();
      }
    });
    // Seller form
    this.SellerForm = this.fb.group({
      [controlKeys.name_ar]: ['', [Validators.required]],
      [controlKeys.name_en]: ['', [Validators.required]],
      [controlKeys.email]: ['', [Validators.required, Validators.email]],
      [controlKeys.password]: ['', [Validators.required]],
      [controlKeys.country_id]: ['', [Validators.required]],
      [controlKeys.city_id]: ['', [Validators.required]],
      [controlKeys.governorate_id]: ['', [Validators.required]],
      [controlKeys.is_active]: [false, [Validators.required]],
      [controlKeys.address_details]: ['', [Validators.required]],
      [controlKeys.seller_logo]: [this.CoverImageId],
    });
    //
    // ContactForm
    this.ContactForm = this.fb.group({
      [controlKeys.Type]: ['', [Validators.required]],
      [controlKeys.name]: ['', [Validators.required]],
      [controlKeys.title]: ['', [Validators.required]],
      [controlKeys.emailContract]: [
        '',
        [Validators.required, Validators.email],
      ],
      [controlKeys.phoneNumber]: [
        '',
        [Validators.required, , Validators.pattern(/^(01)[0-9]{9}$/)],
      ],
      [controlKeys.code]: ['', [Validators.required]],
    });
    //
    // LegalForm
    this.LegalForm = this.fb.group({
      [controlKeys.commercial_name_ar]: ['', [Validators.required]],
      [controlKeys.commercial_name_en]: ['', [Validators.required]],
      [controlKeys.vat_id]: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{9}$/)],
      ],
    });
    //
    // FinanceForm
    this.FinanceForm = this.fb.group({
      [controlKeys.bank_account]: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]/),
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      [controlKeys.commission_percentage]: ['', [Validators.required]],
      [controlKeys.payment_terms]: ['', [Validators.required]],
    });
    //
  }
  changePhoneCode() {
    this.ContactForm.get('code')?.valueChanges.subscribe((value: any) => {

      if (value?.name === '+2') {
        this.ContactForm.get('phoneNumber')?.removeValidators([
          Validators.pattern(/^[0-9]{9}$/),
        ]);
        this.ContactForm.get('phoneNumber')?.setValidators([
          Validators.pattern(/^(01)[0-9]{9}$/),
        ]);
        this.ContactForm.get('phoneNumber')?.updateValueAndValidity();
      } else {
        this.ContactForm.get('phoneNumber')?.removeValidators([
          Validators.pattern(/^(01)[0-9]{9}$/),
        ]);
        this.ContactForm.get('phoneNumber')?.setValidators([
          Validators.pattern(/^[0-9]{9}$/),
        ]);
        this.ContactForm.get('phoneNumber')?.updateValueAndValidity();
      }
    });
  }

  tabs(tab: string) {
    this.tabName = tab;
  }
  //
  // Get Id file uploadCr
  selectedFile1(file: any) {
    const files = file.target.files;
    this.fileCRValue = file.target.files[0].name;
    if (files.length === 0) {
      return;
    } else {
      const mimeType = files[0].type;
      if (mimeType !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading file',
          detail: 'Only Pdf are supported.',
        });
        return;
      }
      const File: any = file.target.files[0];
      const formData = new FormData();
      formData.append('file', File);
      this._SellerServices.uploadImage(formData).subscribe((data: any) => {
        formData.delete('file');
        this.fileUploadCRId = data.id;
        const reader = new FileReader();
        this.fileUploadCRPath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
          this.url = reader.result;
          this.messageService.add({
            severity: 'success',
            detail: 'The File is successfully loaded',
          });
        };
      });
    }
  }
  //
  // Get Id file tax_card
  selectedFile2(file: any) {
    const files = file.target.files;
    this.fileTaxCardValue = file.target.files[0].name;
    if (files.length === 0) {
      return;
    } else {
      const mimetype = files[0].type;
      if (mimetype !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading file',
          detail: 'Only pdf are supported.',
        });
        return;
      } else {
        const File: any = file.target.files[0];
        const formData = new FormData();
        formData.append('file', File);
        this._SellerServices.uploadImage(formData).subscribe((data: any) => {
          formData.delete('file');
          this.fileTaxCardId = data.id;
          const reader = new FileReader();
          this.fileTaxCardPath = files;
          reader.readAsDataURL(files[0]);
          reader.onload = (_event) => {
            this.url = reader.result;
            this.messageService.add({
              severity: 'success',
              detail: 'The File is successfully loaded',
            });
          };
        });
      }
    }
  }

  // Get Id file Contract
  selectedFile3(file: any) {
    const files = file.target.files;
    this.fileContractValue = file.target.files[0].name;
    if (files.length === 0) {
      return;
    } else {
      const mimeType = files[0].type;
      if (mimeType !== 'application/pdf') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error uploading file',
          detail: 'Only pdf are supported.',
        });
        return;
      }
      const File: any = file.target.files[0];
      const formData = new FormData();
      formData.append('file', File);
      this._SellerServices.uploadImage(formData).subscribe((data: any) => {
        formData.delete('file');
        this.fileContractId = data.id;

        const reader = new FileReader();
        this.fileContractPath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
          this.url = reader.result;
          this.messageService.add({
            severity: 'success',
            detail: 'The File is successfully loaded',
          });
        };
      });
    }
  }
  //

  // Navigate to Seller
  backToSeller() {
    this._Router.navigate(['Dashboard/seller']);
  }
  //
  // Handle All Steps and check for if user Create or Edit by editMode Boolean
  nextStep() {
    console.log(this.SellerForm?.value, '================================================================');

    this.submitted = true;
    if (this.tabName == 'seller') {
      if (this.editSellerMode === true) {
        this.SellerForm.removeControl('password');
        if (this.SellerForm.valid) {
          this.tabName = 'contact';
          this.submitted = false;
        }
      } else {
        if (this.SellerForm.valid) {
          this.tabName = 'contact';

          this.submitted = false;
        }
      }
    } else if (this.tabName == 'contact') {
      if (this.tableOfContacts.length > 0) {
        this.tabName = 'legal';
        this.submitted = false;
      }
    } else if (this.tabName == 'legal') {
      if (this.editSellerMode === true) {
        if (this.LegalForm.valid) {
          this.tabName = 'finance';
          this.submitted = false;
        }
      } else {
        if (
          this.LegalForm.valid &&
          this.fileContractId !== 0 &&
          this.fileTaxCardId !== 0 &&
          this.fileUploadCRId !== 0
        ) {
          this.tabName = 'finance';
          this.submitted = false;
        }
      }
    } else if (this.tabName == 'finance') {
      if (this.FinanceForm.valid) {
        this.submitted = false;
        if (this.editSellerMode) {
          this.EditSellers();
        } else {
          this.CreateSeller();
        }
      }
    }
  }
  //
  // Clear all value in frms
  resetForms() {
    this.submitted = false;
    if (this.tabName == 'seller') {
      this.SellerForm.reset();
    } else if (this.tabName == 'contact') {
      this.ContactForm.reset();
    } else if (this.tabName == 'legal') {
      this.LegalForm.reset();
    } else if (this.tabName == 'finance') {
      this.FinanceForm.reset();
    }
  }
  //
  // Handle Back Steps and check all forms valid or not valid
  backStep() {
    if (this.tabName == 'finance') {
      this.tabName = 'legal';
    } else if (this.tabName == 'legal') {
      this.tabName = 'contact';
    } else if (this.tabName == 'contact') {
      this.tabName = 'seller';
    }
  }
  //
  // Get Government in Country by id
  getGovern(id: any) {
    this._SellerServices.geGovern(id).subscribe((govern) => {
      this.governs = govern.data;
    });
  }
  //
  // Get all Cities in Government by id
  getCities(id: any) {
    this._SellerServices.geCities(id).subscribe((city) => {
      this.cities = city.data;
    });
  }
  //
  // Add Contact Info In Table and check if user in Edit mode Or Not
  addContactInfo() {
    if (this.editModeTable) {
      this.editContactInTable();
    } else {
      this.submitted = true;
      let object = {
        name: this.ContactForm.get(controlKeys.name)?.value,
        typeName:
          this.ContactForm.get(controlKeys.Type)?.value === '1'
            ? 'Mian Contact'
            : this.ContactForm.get(controlKeys.Type)?.value === '2'
              ? 'Finance'
              : this.ContactForm.get(controlKeys.Type)?.value === '3'
                ? 'Logistics'
                : '',
        phone:
          this.ContactForm.get(controlKeys.code)?.value?.name +
          this.ContactForm.get(controlKeys.phoneNumber)?.value,
        email: this.ContactForm.get(controlKeys.email)?.value,
        title: this.ContactForm.get(controlKeys.title)?.value,
        type: this.ContactForm.get(controlKeys.Type)?.value,
        phoneNumber: this.ContactForm.get(controlKeys.phoneNumber)?.value,
        code: this.ContactForm.get(controlKeys.code)?.value?.name,
      };

      this.disPlayContactObj = {
        type: this.ContactForm.get(controlKeys.Type)?.value,
        name: this.ContactForm.get(controlKeys.name)?.value,
        title: this.ContactForm.get(controlKeys.title)?.value,
        phone:
          this.ContactForm.get(controlKeys.code)?.value?.name +
          this.ContactForm.get(controlKeys.phoneNumber)?.value,
        email: this.ContactForm.get(controlKeys.email)?.value,
      };
      if (this.ContactForm.valid) {
        this.tableOfContacts.push(object);
        this.ContactForm.reset();
        this.submitted = false;
        this.contactArr.push(this.disPlayContactObj);
      }
    }
  }

  // Delete contact of index in table
  deleteContactInTable(index: number) {
    this.tableOfContacts.splice(index, 1);
    this.contactArr.splice(index, 1);
  }
  //
  // edit contact of index in table
  editContactInTable() {
    let object = {
      name: this.ContactForm.get(controlKeys.name)?.value,
      typeName:
        this.ContactForm.get(controlKeys.Type)?.value === '1'
          ? 'Mian Contact'
          : this.ContactForm.get(controlKeys.Type)?.value === '2'
            ? 'Finance'
            : this.ContactForm.get(controlKeys.Type)?.value === '3'
              ? 'Logistics'
              : '',
      phone:
        this.ContactForm.get(controlKeys.code)?.value.name +
        this.ContactForm.get(controlKeys.phoneNumber)?.value,
      email: this.ContactForm.get(controlKeys.email)?.value,
      title: this.ContactForm.get(controlKeys.title)?.value,
      type: this.ContactForm.get(controlKeys.Type)?.value,
      phoneNumber: this.ContactForm.get(controlKeys.phoneNumber)?.value,
      code: this.ContactForm.get(controlKeys.code)?.value.name,
    };
    this.disPlayContactObj = {
      type: this.ContactForm.get(controlKeys.Type)?.value,
      name: this.ContactForm.get(controlKeys.name)?.value,
      title: this.ContactForm.get(controlKeys.title)?.value,
      phone:
        this.ContactForm.get(controlKeys.code)?.value.name +
        this.ContactForm.get(controlKeys.phoneNumber)?.value,
      email: this.ContactForm.get(controlKeys.email)?.value,
    };
    if (this.ContactForm.valid) {
      this.tableOfContacts[this.tableIndex] = object;
      this.contactArr[this.tableIndex] = this.disPlayContactObj;
      this.editModeTable = false;
      this.ContactForm.reset();
      this.submitted = false;
    }
  }
  //
  // Set Table value in inputs
  HandleEditContactInTable(contact: any, index: number) {
    this.submitted = true;

    this.tableIndex = index;

    this.editModeTable = true;
    this.ContactForm.get(controlKeys.Type)?.setValue(contact.type.toString());
    this.ContactForm.get(controlKeys.name)?.setValue(contact.name);
    this.ContactForm.get(controlKeys.title)?.setValue(contact.title);
    this.ContactForm.get(controlKeys.emailContract)?.setValue(contact.email);
    this.ContactForm.get(controlKeys.code)?.setValue({
      name: contact.code == '+2' ? '+2' : '+966',
      code: contact.code == '+2' ? 'egypt' : 'KSA',
      img:
        contact.code == '+2'
          ? '../../assets/images/egypt.png'
          : '../../assets/images/download (3).png',
    });

    this.ContactForm.get(controlKeys.phoneNumber)?.setValue(
      contact.phoneNumber
    );
  }
  //
  // Reset All Forms
  reset() {
    this.SellerForm.reset();
    this.ContactForm.reset();
    this.LegalForm.reset();
    this.FinanceForm.reset();
    this.submitted = false;
  }
  //
  //  if user Can Arrive Final steps and Create Seller
  CreateSeller() {
    let obj = {
      ...this.SellerForm.value,
      ...this.FinanceForm.value,
      contacts: this.contactArr,
      commercial_name_ar: this.LegalForm.get('commercial_name_ar')?.value,
      commercial_name_en: this.LegalForm.get('commercial_name_en')?.value,
      commercial_record: this.fileUploadCRId,
      tax_card: this.fileTaxCardId,
      contract: this.fileContractId,
      vat_id: +this.LegalForm.get('vat_id')?.value,
      website: 'website',
      phone: '+201093229411',
    };

    this._SellerServices
      .CreateSellers(obj)
      .pipe(
        finalize(() => {
          this.submitted = false;
          this.editSellerMode = false;
          this._Router.navigate(['Dashboard/seller']);
        })
      )
      .subscribe((data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Creates Seller added  Successfully',
        });
        this.reset();
      });
  }
  //
  // Edit Seller Details
  EditSellers() {
    let obj = {
      ...this.SellerForm.value,
      ...this.FinanceForm.value,
      contacts: this.contactArr,
      commercial_name_ar: this.LegalForm.get('commercial_name_ar')?.value,
      commercial_name_en: this.LegalForm.get('commercial_name_en')?.value,
      vat_id: +this.LegalForm.get('vat_id')?.value,
      website: 'website',
      phone: '+201093229411',
    };

    this._SellerServices
      .updatSeller(this.SellerId, obj)
      .pipe(
        finalize(() => {
          this.submitted = false;
        })
      )
      .subscribe((data) => {
        this._Router.navigate(['Dashboard/seller']);
        this.reset();
        this.editSellerMode = false;
      });
  }
  //

  // Handle Set Value For all inputs
  handleEditSeller() {
    this.isHidden = false;
    this.editSellerMode = true;
    this._SellerServices.showSellers(this.SellerId).subscribe((res) => {
      this.SellerForm.get(controlKeys.name_ar)?.setValue(
        res.data.seller_info?.name_ar
      );
      this.SellerForm.get(controlKeys.name_en)?.setValue(
        res.data.seller_info?.name_en
      );
      this.SellerForm.get(controlKeys.email)?.setValue(res.data.email);

      this.SellerForm.get(controlKeys.country_id)?.setValue(
        res.data.address?.country_id
      );
      this.SellerForm.get(controlKeys.city_id)?.setValue(
        res.data.address?.city_id
      );
      this.SellerForm.get(controlKeys.governorate_id)?.setValue(
        res.data.address?.governorate_id
      );
      this.SellerForm.get(controlKeys.is_active)?.setValue(res.data.is_active);
      this.SellerForm.get(controlKeys.address_details)?.setValue(
        res.data.address?.address_details
      );
      // THIS IS FOR SELLER LOG
      this.viewImage = res.data?.seller_logo ? true : false;
      console.log(this.viewImage);

      this.urlImageSeller = res?.data?.seller_logo
      console.log(this.urlImageSeller);


      this.LegalForm.get(controlKeys.commercial_name_ar)?.setValue(
        res.data.seller_info.commercial_name_ar
      );
      this.LegalForm.get(controlKeys.commercial_name_en)?.setValue(
        res.data.seller_info.commercial_name_en
      );
      this.LegalForm.get(controlKeys.vat_id)?.setValue(
        res.data.seller_info.vat_id
      );

      this.FinanceForm.get(controlKeys.bank_account)?.setValue(
        res.data.seller_info.bank_account
      );
      this.FinanceForm.get(controlKeys.commission_percentage)?.setValue(
        res.data.seller_info.commission_percentage
      );
      this.FinanceForm.get(controlKeys.payment_terms)?.setValue(
        res.data.seller_info.payment_terms
      );

      this.contactArr = res.data.seller_contact_person.map((contact: any) => {
        return {
          name: contact.name,
          typeName: contact.type.name,
          phone: contact.phone,
          email: contact.email,
          title: contact.title,
          type: contact.type.id,
          phoneNumber: contact.formatted_phone.number,
          code: contact.formatted_phone.code,
        };
      });
      this.tableOfContacts = res.data.seller_contact_person.map(
        (contact: any) => {
          return {
            name: contact.name,
            typeName: contact.type.name,
            phone: contact.phone,
            email: contact.email,
            title: contact.title,
            type: contact.type.id,
            phoneNumber: contact.formatted_phone.number,
            code: contact.formatted_phone.code,
          };
        }
      );
    });
  }
  //
  ngOnInit(): void {
    this.changePhoneCode();
  }
  viewImage: boolean = false
  CoverImageId: any = null
  urlImageSeller: any

  uploadSellerLogo(file: any) {
    console.log(file);

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
            // this.CoverImageId = { id: data.id, is_new: true };
            this.CoverImageId = data.id;
            console.log(this.CoverImageId);
            this.SellerForm.get('seller_logo')?.setValue(this.CoverImageId)
            // console.log(this.SellerForm.get('seller_logo')?.value, 'this is value of control ');


            // this.hideSubImages = false;
            const reader = new FileReader();
            // this.imagePath = files;
            reader.readAsDataURL(files[0]);
            reader.onload = (_event) => {
              this.urlImageSeller = reader.result;
              this.viewImage = true;
            };
          });
      }
    }
  }

  deleteImage(event: Event) {
    // console.log(event);
    event.stopPropagation()
    event.preventDefault();
    this.urlImageSeller = ''
    this.CoverImageId = null
    this.viewImage = false;
    console.log('This is url image', this.urlImageSeller, 'This is cover image id', this.CoverImageId, 'This is view image', this.viewImage);

  }



}
