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
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { catchError, filter, forkJoin, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { UtilsHelperService } from 'src/app/modules/core/services/utils-helper.service';
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
  @ViewChild('photoContainer') photoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('punchline') punchline!: ElementRef<HTMLInputElement>;
  isSaving = false;
  @HostListener('click', ['$event']) onClick({ target }: { target: HTMLElement }) {
    this.closeToPhoto = !!target.closest(
      'div.' + this.photoContainer.nativeElement.className.split(' ').join('.')
    );
    this.closeToPunchline = !!target.closest(
      'input.' + this.punchline.nativeElement.className.split(' ').join('.')
    );
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
  closeToPhoto = false;
  isGettingStarted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<IWebsiteState>,
    private utilsHelper: UtilsHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location
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
  }

  ngOnInit(): void {
    this.initializeBusinessForm();
    this.subscriptions();
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
          console.log('saved successfully');
          this.clearImages();
          this.router.navigate(['../'], { relativeTo: this.route });
        } else {
          console.log(data?.error);
        }
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
      aboutme: [val?.store?.about_me ?? ''],
      photos: this.fb.array(
        val?.business_photos?.length
          ? val?.business_photos?.map(this.createPhotos.bind(this))
          : Array.from({ length: 3 }, _ => this.createPhotos())
      ),
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
    });
    if (val?.logo) {
      this.logoImageUrl = val.logo;
    }
  }

  createSocialItem(val?: BusinessLinks): FormGroup {
    return this.fb.group({
      // link_id: [val?.link_id ?? ''],
      url: [val?.url ?? ''],
    });
  }

  createLicences(val?: Recognitions): FormGroup {
    this.arrayLicenceImageUrl.push(val?.photo_url);
    return this.fb.group({
      // recognition_id: [val?.recognition_id ?? ''],
      recognition_type: [val?.recognition_type ?? ''],
      recognition_name: [val?.recognition_name ?? ''],
      expiry_date: [val?.expiry_date ?? ''],
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
    this.arrayPhotosImageUrl.push(val?.photo_url);
    return this.fb.group({
      // photo_id: [val?.photo_id ?? ''],
      photo_url: [val?.photo_url ?? ''],
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
  logoImageUrl = '';

  async handleFileInputLogo(event: Event) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(event, 'logo', 'image/');
      this.fileToUploadLogo = file;
      this.logoImageUrl = url;
    } catch (ex) {
      console.log(ex);
    }
  }

  deleteLogo() {
    this.logoImageUrl = '';
    this.fileToUploadLogo = null;
    this.businessInfoForm.get('logo')?.patchValue(null);
  }

  // photos

  fileToUploadPhoto: (File | null | undefined)[] = [];
  arrayPhotosImageUrl: (string | undefined)[] = [];

  async handleFileInput(event: Event, index: number) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'business_photos',
        'image/'
      );
      this.fileToUploadPhoto[index] = file;
      this.arrayPhotosImageUrl[index] = url;
    } catch (ex) {
      console.log(ex);
    }
  }
  deletePhoto(index: number) {
    this.arrayPhotosImageUrl[index] = '';
    this.fileToUploadPhoto[index] = null;
    this.photos.at(index)?.get('photo_url')?.patchValue(null);
  }

  // Licence or awarsds file
  fileToUploadLicence: (File | undefined | null)[] = [];
  arrayLicenceImageUrl: (string | undefined)[] = [];

  async handleFileInputLicence(event: Event, i: number) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'recognitions',
        'image/'
      );
      this.fileToUploadLicence[i] = file;
      this.arrayLicenceImageUrl[i] = url;
    } catch (ex) {
      console.log(ex);
    }
  }

  deleteLicense(index: number) {
    this.arrayLicenceImageUrl[index] = '';
    this.fileToUploadLicence[index] = null;
    this.recognitions.at(index)?.get('photo_url')?.patchValue(null);
  }

  fileToUploadTestimonial: (File | undefined | null)[] = [];
  arrayTestmonialImageUrl: (string | undefined)[] = [];
  async handleFileTestimonial(event: Event, i: number) {
    try {
      const [file, url, fileKey] = await this.utilsHelper.handleFileInput(
        event,
        'testimonial',
        'image/'
      );
      this.fileToUploadTestimonial[i] = file;
      this.arrayTestmonialImageUrl[i] = url;
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
      //me.modelvalue = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  onSubmitBusiness() {
    this.isSaving = true;
    this.fileNames = [];
    /*
      Extracting name of the images and prepending /businessname/type/,
      patching name into form and into an array to generate presigned URL
    */
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { customUsername: domain_name },
    } = userData;
    this.fileNames = [];
    if (this.fileToUploadLogo) {
      const logoKey = `${domain_name}/logo/${Date.now()}_${this.fileToUploadLogo?.name}`;
      this.fileNames.push({ type: 'logo', name: logoKey });
      this.businessInfoForm.get('logo')?.patchValue(logoKey);
    }
    this.fileToUploadPhoto.forEach((photo, index) => {
      if (photo?.name) {
        const photoKey = `${domain_name}/business-photos/${Date.now()}_${photo.name}`;
        this.fileNames.push({ type: 'photos', name: photoKey });
        this.photos.at(index)?.get('photo_url')?.patchValue(photoKey);
      }
    });
    this.fileToUploadLicence.forEach((photo, index) => {
      if (photo?.name) {
        const recognitionKey = `${domain_name}/recognitions/${Date.now()}_${photo.name}`;
        this.fileNames.push({ type: 'recognitions', name: recognitionKey });
        this.recognitions.at(index)?.get('photo_url')?.patchValue(recognitionKey);
      }
    });
    this.fileToUploadTestimonial.forEach((photo, index) => {
      if (photo?.name) {
        const testimonialKey = `${domain_name}/testimonials/${Date.now()}_${photo.name}`;
        this.fileNames.push({ type: 'testimonials', name: testimonialKey });
        this.testimonials.at(index)?.get('photo_url')?.patchValue(testimonialKey);
      }
    });
    const {
      companyname,
      punchline,
      aboutme,
      socialitems,
      photos,
      licenceitems,
      testimonialitems,
      logo,
    } = this.businessInfoForm.value;
    const businessPayload = {
      company_name: companyname,
      logo: logo,
      about_me: aboutme,
      punchline: punchline,
      social_links: socialitems,
      photos,
      recognitions: licenceitems,
      testimonials: testimonialitems,
    };
    console.log('businessPayload', businessPayload);

    // this.websiteService.addBusinessInfo(businessPayload).subscribe(data => {
    //   console.log(data);
    // });

    // this.store.dispatch(addBusiness({ businessData: businessPayload }));

    const filePayload = {
      key: this.fileNames.map(({ name }) => name),
    };
    console.log(filePayload);
    if (!this.fileNames.length) {
      this.store.dispatch(addBusiness({ businessData: businessPayload }));
      return;
    }

    this.utilsHelper.uploadImage(filePayload).subscribe((data: any) => {
      console.log(data);
      const { signedURL } = data;
      this.isUploadingImages = true;
      forkJoin(
        this.fileNames.map(({ type, name }) => {
          const url = signedURL[name];
          let file;
          if (type === 'logo') {
            file = this.fileToUploadLogo;
          } else if (type === 'photos') {
            file =
              this.fileToUploadPhoto[
                this.photos.controls.findIndex(photo => photo.get('photo_url')?.value === name)
              ];
          } else if (type === 'recognitions') {
            file =
              this.fileToUploadLicence[
                this.recognitions.controls.findIndex(
                  recognition => recognition.get('photo_url')?.value === name
                )
              ];
          } else {
            file =
              this.fileToUploadTestimonial[
                this.testimonials.controls.findIndex(
                  testimonial => testimonial.get('photo_url')?.value === name
                )
              ];
          }
          return this.utilsHelper.uploadImageToS3(url, file);
        })
      )
        .pipe(
          map(val => true),
          catchError(err => of(false))
        )
        .subscribe(status => {
          this.isUploadingImages = false;
          if (status) {
            this.store.dispatch(addBusiness({ businessData: businessPayload }));
          } else {
            this.businessInfoForm.setErrors({ photoUploadFailed: 'Failed to upload photos' });
          }
        });
    });
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
    return `${(this.photoContainer.nativeElement?.offsetParent as HTMLElement)?.offsetTop ?? 0}px`;
  }

  get punchlineContainerPos() {
    return `${(this.punchline.nativeElement?.offsetParent as HTMLElement)?.offsetTop ?? 0}px`;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.store.dispatch(initBusiness());
    this.ngUnsubscribe.next(true);
  }
}
