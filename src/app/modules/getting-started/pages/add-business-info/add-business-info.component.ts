import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { UtilsHelperService } from 'src/app/modules/core/services/utils-helper.service';
import { ProductPhoto } from 'src/app/modules/service/shared/service.interface';
import { countryList, currencyList } from 'src/app/shared/utils';
import { addBusiness, getBusiness, initBusiness } from '../../../website/store/website.actions';
import {
  BusinessInfo,
  BusinessLinks,
  BusinessPhotos,
  Recognitions,
  Testimonials,
} from '../../../website/store/website.interface';
import { IWebsiteState } from '../../../website/store/website.reducers';
import { getAddBusinessStatus, getBusinessStatus } from '../../../website/store/website.selectors';

@Component({
  selector: 'app-add-business-info',
  templateUrl: './add-business-info.component.html',
  styleUrls: ['./add-business-info.component.scss'],
})
export class AddBusinessInfoComponent implements OnInit, OnDestroy {
  @ViewChild('socialContainer') socialContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('punchline') punchline!: ElementRef<HTMLInputElement>;
  @ViewChild('radioContainer') radioContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  // @ViewChild('companyName', { static: true }) companyName: ElementRef;
  isSaving = false;
  @HostListener('click', ['$event']) onClick({ target }: { target: HTMLElement }) {
    this.closeToSocial = this.socialContainer.nativeElement.contains(target);
    this.closeToPunchline = this.punchline.nativeElement.contains(target);
    this.closeToRadio = this.radioContainer.nativeElement.contains(target);
    this.closeToImage = this.imageContainer.nativeElement.contains(target);
  }
  businessInfoForm!: FormGroup;
  recognitionTypeOptions = [
    {
      value: 'AWARD',
      label: 'Award',
    },
    {
      value: 'CERTIFICATE',
      label: 'Certificate',
    },
    {
      value: 'LICENSE',
      label: 'License',
    },
  ];

  ngUnsubscribe = new Subject<any>();
  businessData$: Observable<
    { business?: BusinessInfo; status: boolean; error?: string } | undefined
  >;
  saveBusinessStatus$: Observable<{ response?: any; status: boolean; error?: string } | undefined>;
  isUploadingImages = false;
  editMode = false;
  closeToPunchline = false;
  closeToRadio = false;
  closeToSocial = false;
  closeToImage = false;
  isGettingStarted = false;
  textCount = 0;
  options = {
    format: 'yyyy-MM-dd',
    placeholder: 'Select date',
  };
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<IWebsiteState>,
    private utilsHelper: UtilsHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location,
    private formBuilder: FormBuilder,
    private utilsService: UtilsHelperService
  ) {
    this.businessData$ = this.store.pipe(select(getBusinessStatus));
    this.saveBusinessStatus$ = this.store.pipe(select(getAddBusinessStatus));
    route.url
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(urlSegments => urlSegments.some(url => url?.path.includes('edit-business-info')))
      )
      .subscribe(editMode => {
        this.editMode = editMode;
        if (editMode) {
          this.zone.run(() => {
            setTimeout(() => {
              this.store.dispatch(getBusiness());
            }, 100);
          });
        }
      });
    this.isGettingStarted = this.router.url.split('/').includes('home');

    // this.businessInfoForm = this.formBuilder.group({
    //   companyname: [],

    // });
  }

  ngOnInit(): void {
    this.initializeBusinessForm();
    this.subscriptions();
    if (!this.editMode) {
      this.addBasicInfoSubcription();
    }
  }

  onKeyUp(boxInput: any) {
    return boxInput.value.length;
  }
  onKeyUpTesmonialsTitle(title: any) {
    return title.value.length;
  }
  onKeyUpPunchLine(punchline: any) {
    return punchline.value.length; //this will have the length of the text entered in the input box
  }
  subscriptions() {
    this.businessData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data?.status) {
          this.initializeBusinessForm(data.business);
          this.addBasicInfoSubcription();
        } else {
          console.log(data?.error);
        }
      });
    this.saveBusinessStatus$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        this.isSaving = false;
        if (data?.status) {
          if (this.isSaving) {
            this.isSaving = false;
            this.addBasicInfoSubcription();
          }
          console.log('saved successfully');
          // this.clearImages();
          // this.router.navigate(['../']);
        } else {
          console.log(data?.error);
        }
      });

    this.businessInfoForm
      .get('country')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(val => {
        if (val) {
          this.businessInfoForm
            .get('currency')
            ?.patchValue(currencyList.find(currency => currency.country === val)?.id);
        } else {
          this.businessInfoForm.get('currency')?.patchValue(null);
        }
      });
  }

  addBasicInfoSubcription() {
    this.businessInfoForm.valueChanges
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap(value => of(value))
      )
      .subscribe(value => {
        this.onSubmitBusiness(false);
      });
  }

  clearImages() {
    this.arrayLicenceImageUrl = [];
    this.arrayPhotosImageUrl = [];
    this.arrayTestmonialImageUrl = [];
    this.fileToUploadLicence = [];
    this.fileToUploadTestimonial = [];
    this.fileToUploadPhoto = [];
  }

  initializeBusinessForm(val?: BusinessInfo) {
    this.clearImages();
    this.businessInfoForm = this.fb.group({
      companyname: [val?.store?.company_name ?? ''],
      punchline: [val?.store?.punchline ?? ''],
      logo: [val?.logo ?? ''],
      cover: [val?.business_photos?.[0] ?? ''],
      email: [val?.email ?? '', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      phone_number: [val?.phone_number ?? '', Validators.pattern(/^(\+\d{1,3})[ -]?\d{8,15}$/)],
      contact_type: [val?.contact_type ?? null],
      // photos: this.fb.array(
      //   Array.from({ length: 3 }, (_, i) => this.createPhotos(val?.business_photos?.[i]))
      // ),
      socialitems: this.fb.array(
        val?.links?.length
          ? val?.links?.map(this.createSocialItem.bind(this))
          : [this.createSocialItem()]
      ),
      licenceitems: this.fb.array(
        val?.recognitions?.length
          ? val?.recognitions?.map(this.createLicences.bind(this))
          : [this.createLicences()]
      ),
      testimonialitems: this.fb.array(
        val?.testimonials?.length
          ? val?.testimonials?.map(this.createTestimonial.bind(this))
          : [this.createTestimonial()]
      ),
      country: [val?.country ?? null],
      currency: [val?.default_currency ?? null],
    });
    if (val?.logo) {
      this.logoImageUrl = val.logo;
    }
    if (val?.business_photos?.[0]?.photo_url) {
      this.coverImageUrl = val?.business_photos?.[0]?.photo_url;
    }
    if (val?.store?.punchline) {
      setTimeout(() => this.punchline?.nativeElement.dispatchEvent(new Event('input')));
    }
  }

  createSocialItem(val?: BusinessLinks): FormGroup {
    return this.fb.group({
      // link_id: [val?.link_id ?? ''],
      url: [
        val?.url ?? '',
        Validators.pattern(
          '((https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)'
        ),
      ],
    });
  }

  createLicences(val?: Recognitions): FormGroup {
    this.arrayLicenceImageUrl.push(val?.photo_url);

    return this.fb.group({
      // recognition_id: [val?.recognition_id ?? ''],
      recognition_type: [val?.recognition_type ?? null],
      recognition_name: [val?.recognition_name ?? ''],
      expiry_date: [val?.expiry_date ? new Date(val?.expiry_date) : ''],
      photo_url: [val?.photo_url ?? ''],
    });
  }

  createTestimonial(val?: Testimonials): FormGroup {
    this.arrayTestmonialImageUrl.push(val?.photo_url);
    return this.fb.group({
      // testimonial_id: [val?.testimonial_id ?? ''],
      name: [val?.name ?? ''],
      title: [val?.title ?? ''],
      testimonial: [val?.testimonial ?? ''],
      photo_url: [val?.photo_url ?? ''],
    });
  }

  createPhotos(val?: BusinessPhotos): FormGroup {
    return this.fb.group({
      photo_url: [val?.photo_url ?? ''],
      photo_data_url: [{ value: val?.photo_url ?? '', disabled: true }],
      photo_file: [{ value: null, disabled: true }],
    });
  }

  addSocialItem() {
    this.socialItems.push(this.createSocialItem());
  }

  addLicenceItem() {
    this.recognitions.push(this.createLicences());
  }

  addTestimonialItem() {
    this.testimonials.push(this.createTestimonial());
  }

  // logo

  fileNames: any[] = [];
  fileToUploadLogo: File | null | undefined;
  fileToUploadCover: File | null | undefined;
  logoImageUrl = '';
  coverImageUrl = '';

  async handleFileInputLogo(event: Event) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'logo',
        'image/',
        true
      );
      this.fileToUploadLogo = file;
      this.logoImageUrl = url;

      this.businessInfoForm.get('logo')?.patchValue(fileKey);
    } catch (ex) {}
  }

  async handleFileInputCover(event: Event) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'cover',
        'image/',
        true
      );
      this.fileToUploadCover = file;
      this.coverImageUrl = url;
      this.businessInfoForm.get('cover')?.patchValue({ photo_url: fileKey });
    } catch (ex) {}
  }

  deleteLogo() {
    this.logoImageUrl = '';
    this.fileToUploadLogo = null;
    this.businessInfoForm.get('logo')?.patchValue(null);
    this.businessInfoForm.patchValue({
      photo_url: '',
      photo_data_url: '',
      photo_file: null,
    });
  }
  deleteCover() {
    this.coverImageUrl = '';
    this.fileToUploadCover = null;
    // this.businessCoverPhoto?.patchValue(null);
    this.businessCoverPhoto?.patchValue({ photo_url: '' });
  }

  // photos

  fileToUploadPhoto: (File | null | undefined)[] = [];
  arrayPhotosImageUrl: (string | undefined)[] = [];

  async handleFileInput(event: Event, index: number) {
    try {
      const [file, url, fileKey] = await this.utilsService.handleFileInput(
        event,
        'business_photos',
        'image/',
        true
      );
      this.businessPhotosList.at(index).get('photo_file')?.patchValue(file);
      this.businessPhotosList.at(index).get('photo_data_url')?.patchValue(url);
      this.businessPhotosList.at(index).get('photo_url')?.patchValue(fileKey);
    } catch (ex) {
      console.log(ex);
    }
  }
  deletePhoto(index: number) {
    // this.arrayPhotosImageUrl[index] = '';
    // this.fileToUploadPhoto[index] = null;
    // this.photos.at(index)?.get('photo_url')?.patchValue(null);

    this.businessPhotosList.at(index).patchValue({
      photo_url: '',
      photo_data_url: '',
      photo_file: null,
    });
  }

  // Licence or awarsds file
  fileToUploadLicence: (File | undefined | null)[] = [];
  arrayLicenceImageUrl: (string | undefined)[] = [];

  async handleFileInputLicence(event: Event, index: number) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'recognitions',
        'image/',
        true
      );
      this.fileToUploadLicence[index] = file;
      this.arrayLicenceImageUrl[index] = url;

      this.recognitions.at(index).get('photo_file')?.patchValue(file);
      this.recognitions.at(index).get('photo_data_url')?.patchValue(url);
      this.recognitions.at(index).get('photo_url')?.patchValue(fileKey);
    } catch (ex) {
      console.log(ex);
    }
  }

  deleteLicense(index: number) {
    this.arrayLicenceImageUrl[index] = '';
    this.fileToUploadLicence[index] = null;
    this.recognitions.at(index)?.get('photo_url')?.patchValue(null);
  }

  deleteAwardOrLicence(index: any) {
    this.licenceItem.removeAt(index);
    this.fileToUploadLicence?.splice(index, 1);
    this.arrayLicenceImageUrl?.splice(index, 1);
    if (this.licenceItem?.value?.length === 0) {
      this.addLicenceItem();
    }
  }

  get testimonialItem() {
    return this.businessInfoForm.get('testimonialitems') as FormArray;
  }

  get licenceItem() {
    return this.businessInfoForm.get('licenceitems') as FormArray;
  }

  deleteTestmonials(index: any) {
    this.testimonialItem.removeAt(index);
    this.fileToUploadTestimonial?.splice(index, 1);
    this.arrayTestmonialImageUrl?.splice(index, 1);
    if (this.testimonialItem.value.length === 0) {
      this.addTestimonialItem();
    }
  }

  fileToUploadTestimonial: (File | undefined | null)[] = [];
  arrayTestmonialImageUrl: (string | undefined)[] = [];

  async handleFileTestimonial(event: Event, index: number) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'testimonial',
        'image/',
        true
      );
      this.fileToUploadTestimonial[index] = file;
      this.arrayTestmonialImageUrl[index] = url;
      this.testimonials.at(index).get('photo_file')?.patchValue(file);
      this.testimonials.at(index).get('photo_data_url')?.patchValue(url);
      this.testimonials.at(index).get('photo_url')?.patchValue(fileKey);
    } catch (ex) {
      console.log(ex);
    }
  }

  deleteTestimonial(index: number) {
    this.arrayTestmonialImageUrl[index] = '';
    this.fileToUploadTestimonial[index] = null;
    this.testimonials.at(index)?.get('photo_url')?.patchValue(null);
  }

  getBase64(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //me.modelvalue = reader.result;Ad
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  onSubmitBusiness(route = true) {
    if (this.businessInfoForm.invalid) {
      this.businessInfoForm.markAllAsTouched();
      return;
    }
    this.isSaving = route;
    this.fileNames = [];
    /*
      Extracting name of the images and prepending /businessname/type/,
      patching name into form and into an array to generate presigned URL
    */

    const {
      companyname,
      punchline,
      socialitems,
      email,
      licenceitems,
      testimonialitems,
      logo,
      phone_number,
      contact_type,
      cover,
      country,
      currency: default_currency,
    } = this.businessInfoForm.value;
    const businessPayload = {
      company_name: companyname,
      punchline: punchline,
      logo: logo,
      social_links: this.isSocialLinkFilled(),
      recognitions: this.isLicenceItemFilled(),
      phone_number: phone_number,
      email: email,
      contact_type: contact_type,
      business_photos: [cover],
      testimonials: this.isTestimonialFilled(),
      country,
      default_currency,
    };
    this.store.dispatch(addBusiness({ businessData: businessPayload }));
    if (route) {
      this.router.navigate(['../']);
    }
    return;

    // if (this.fileToUploadLogo) {
    //   const logoKey = `${domain_name}/logo/${Date.now()}_${this.fileToUploadLogo?.name}`;
    //   this.fileNames.push({ type: 'logo', name: logoKey });
    //   this.businessInfoForm.get('logo')?.patchValue(logoKey);
    // }
    // this.fileToUploadPhoto.forEach((photo, index) => {
    //   if (photo?.name) {
    //     const photoKey = `${domain_name}/business-photos/${Date.now()}_${photo.name}`;
    //     this.fileNames.push({ type: 'photos', name: photoKey });
    //     this.photos.at(index)?.get('photo_url')?.patchValue(photoKey);
    //   }
    // });
    // this.fileToUploadLicence.forEach((photo, index) => {
    //   if (photo?.name) {
    //     const recognitionKey = `${domain_name}/recognitions/${Date.now()}_${photo.name}`;
    //     this.fileNames.push({ type: 'recognitions', name: recognitionKey });
    //     this.recognitions.at(index)?.get('photo_url')?.patchValue(recognitionKey);
    //   }
    // });
    // this.fileToUploadTestimonial.forEach((photo, index) => {
    //   if (photo?.name) {
    //     const testimonialKey = `${domain_name}/testimonials/${Date.now()}_${photo.name}`;
    //     this.fileNames.push({ type: 'testimonials', name: testimonialKey });
    //     this.testimonials.at(index)?.get('photo_url')?.patchValue(testimonialKey);
    //   }
    // });
    // const {
    //   companyname,
    //   punchline,
    //   aboutme,
    //   socialitems,
    //   photos,
    //   licenceitems,
    //   testimonialitems,
    //   logo,
    // } = this.businessInfoForm.value;
    // const businessPayload = {
    //   company_name: companyname,
    //   logo: logo,
    //   about_me: aboutme,
    //   punchline: punchline,
    //   social_links: socialitems,
    //   photos,
    //   recognitions: licenceitems,
    //   testimonials: testimonialitems,
    // };
    // console.log('businessPayload', businessPayload);

    // this.websiteService.addBusinessInfo(businessPayload).subscribe(data => {
    //   console.log(data);
    // });

    // this.store.dispatch(addBusiness({ businessData: businessPayload }));

    // const filePayload = {
    //   key: this.fileNames.map(({ name }) => name),
    // };
    // console.log(filePayload);
    // if (!this.fileNames.length) {
    //   this.store.dispatch(addBusiness({ businessData: businessPayload }));
    //   return;
    // }

    // this.utilsHelper.uploadImage(filePayload).subscribe((data: any) => {
    //   console.log(data);
    //   const { signedURL } = data;
    //   this.isUploadingImages = true;
    //   forkJoin(
    //     this.fileNames.map(({ type, name }) => {
    //       const url = signedURL[name];
    //       let file;
    //       if (type === 'logo') {
    //         file = this.fileToUploadLogo;
    //       } else if (type === 'photos') {
    //         file =
    //           this.fileToUploadPhoto[
    //             this.photos.controls.findIndex(photo => photo.get('photo_url')?.value === name)
    //           ];
    //       } else if (type === 'recognitions') {
    //         file =
    //           this.fileToUploadLicence[
    //             this.recognitions.controls.findIndex(
    //               recognition => recognition.get('photo_url')?.value === name
    //             )
    //           ];
    //       } else {
    //         file =
    //           this.fileToUploadTestimonial[
    //             this.testimonials.controls.findIndex(
    //               testimonial => testimonial.get('photo_url')?.value === name
    //             )
    //           ];
    //       }
    //       return this.utilsHelper.uploadImageToS3(url, file);
    //     })
    //   )
    //     .pipe(
    //       map(val => true),
    //       catchError(err => of(false))
    //     )
    //     .subscribe(status => {
    //       this.isUploadingImages = false;
    //       if (status) {
    //         this.store.dispatch(addBusiness({ businessData: businessPayload }));
    //         // this.router.navigate(['../'], { relativeTo: this.route });
    //       } else {
    //         this.businessInfoForm.setErrors({ photoUploadFailed: 'Failed to upload photos' });
    //       }
    //     });
    // });
  }

  isSocialLinkFilled() {
    const socialLinks = this.socialItems && this.socialItems.value;
    return socialLinks.filter((data: any) => {
      console.log('URLL', typeof data.url);

      return data.url;
    });
  }
  isLicenceItemFilled() {
    const licenseList = this.recognitions && this.recognitions.value;
    return licenseList.filter((data: any) => {
      return data.recognition_type === 'AWARD'
        ? data.recognition_type && data.recognition_name && data.photo_url
        : data.recognition_type && data.recognition_name && data.photo_url && data.expiry_date;
    });
  }

  isTestimonialFilled() {
    const testimonialsList = this.testimonials && this.testimonials.value;
    return testimonialsList.filter((data: any) => {
      return data.name && data.photo_url && data.testimonial && data.title;
    });
  }

  isOneEmptyTestimonialPresent() {
    const noName =
      this.testimonialItem?.controls?.[0]?.get('name')?.value === '' ||
      this.testimonialItem?.controls?.[0]?.get('name')?.value === null;
    const noTitle =
      this.testimonialItem?.controls?.[0]?.get('title')?.value === '' ||
      this.testimonialItem?.controls?.[0]?.get('title')?.value === null;
    const noTestimonial =
      this.testimonialItem?.controls?.[0]?.get('testimonial')?.value === '' ||
      this.testimonialItem?.controls?.[0]?.get('testimonial')?.value === null;
    const noPhoto =
      this.testimonialItem?.controls?.[0]?.get('photo_url')?.value === '' ||
      this.testimonialItem?.controls?.[0]?.get('photo_url')?.value === null;

    return this.testimonialItem.length === 1 && noName && noTitle && noTestimonial && noPhoto;
  }

  isOneEmptyLicenceOrAwardPresent() {
    const noExpiryDate =
      this.licenceItem?.controls?.[0]?.get('expiry_date')?.value === '' ||
      this.licenceItem?.controls?.[0]?.get('expiry_date')?.value === null;
    const noPhoto =
      this.licenceItem?.controls?.[0]?.get('photo_url')?.value === '' ||
      this.licenceItem?.controls?.[0]?.get('photo_url')?.value === null;
    const noRecognitionName =
      this.licenceItem?.controls?.[0]?.get('recognition_name')?.value === '' ||
      this.licenceItem?.controls?.[0]?.get('recognition_name')?.value === null;
    const noRecognitionType =
      this.licenceItem?.controls?.[0]?.get('recognition_type')?.value === '' ||
      this.licenceItem?.controls?.[0]?.get('recognition_type')?.value === null;

    return (
      this.licenceItem.length === 1 &&
      noExpiryDate &&
      noPhoto &&
      noRecognitionName &&
      noRecognitionType
    );
  }

  get socialItems() {
    return this.businessInfoForm.get('socialitems') as FormArray;
  }

  get recognitions() {
    return this.businessInfoForm.get('licenceitems') as FormArray;
  }

  get testimonials() {
    return this.businessInfoForm.get('testimonialitems') as FormArray;
  }

  get photos() {
    return this.businessInfoForm.get('photos') as FormArray;
  }

  get photoContainerPos() {
    return `${(this.socialContainer.nativeElement?.offsetParent as HTMLElement)?.offsetTop ?? 0}px`;
  }

  get punchlineContainerPos() {
    return `${(this.punchline.nativeElement?.offsetParent as HTMLElement)?.offsetTop ?? 0}px`;
  }
  get radioContainerPos() {
    return `${(this.radioContainer.nativeElement?.offsetParent as HTMLElement)?.offsetTop ?? 0}px`;
  }
  get imageContainerPos() {
    return `${(this.imageContainer.nativeElement?.offsetParent as HTMLElement)?.offsetTop ?? 0}px`;
  }
  get businessLogo() {
    return this.businessInfoForm.get('logo') as FormControl;
  }
  get businessPhotosList() {
    return <FormArray>this.businessInfoForm.get('photos');
  }
  get businessCoverPhoto() {
    return this.businessInfoForm.get('cover') as FormControl;
  }

  get social() {
    return this.businessInfoForm.get('socialitems');
  }

  get countryList() {
    return countryList;
  }

  get currencyList() {
    return currencyList;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.store.dispatch(initBusiness());
    this.ngUnsubscribe.next(true);
  }
}
