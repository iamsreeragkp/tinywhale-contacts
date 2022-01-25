import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { catchError, forkJoin, map, Observable, of, skipWhile, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { addBusiness, getBusiness } from '../../store/website.actions';
import {
  BusinessInfo,
  BusinessLinks,
  BusinessPhotos,
  Recognitions,
  Testimonials,
} from '../../store/website.interface';
import { IWebsiteState } from '../../store/website.reducers';
import { getBusinessData } from '../../store/website.selectors';
import { WebsiteService } from '../../website.service';

@Component({
  selector: 'app-add-business-info',
  templateUrl: './add-business-info.component.html',
  styleUrls: ['./add-business-info.component.scss'],
})
export class AddBusinessInfoComponent implements OnInit, OnDestroy {
  businessInfoForm!: FormGroup;
  isVisible = false;
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
  businessData$: Observable<BusinessInfo>;
  isUploadingImages = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<IWebsiteState>,
    private websiteService: WebsiteService,
    private router: ActivatedRoute,
    private zone: NgZone
  ) {
    this.businessData$ = this.store.pipe(select(getBusinessData));
    router.url
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(urlSegments => urlSegments.some(url => url?.path.includes('edit-business-info')))
      )
      .subscribe(editMode => {
        if (editMode) {
          this.zone.run(() => {
            setTimeout(() => {
              this.store.dispatch(getBusiness());
            }, 1000);
          });
        }
      });
  }

  ngOnInit(): void {
    this.initializeBusinessForm();
    this.subscriptions();
  }

  subscriptions() {
    this.businessData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skipWhile(val => !val)
      )
      .subscribe(data => {
        if (data) {
          console.log(data);
        }
      });
  }

  initializeBusinessForm(val?: BusinessInfo) {
    this.businessInfoForm = this.fb.group({
      companyname: [val?.store?.company_name ?? ''],
      punchline: [val?.store?.punchline ?? ''],
      logo: [val?.logo ?? ''],
      aboutme: [val?.store?.about_me ?? ''],
      photos: this.fb.array(
        val?.business_photos?.length
          ? val?.business_photos?.map(this.createPhotos.bind(this))
          : Array(3).fill(this.createPhotos())
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
  }

  changeData(event: any) {
    console.log(event);
    if (event) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  createSocialItem(val?: BusinessLinks): FormGroup {
    return this.fb.group({
      link_id: [val?.link_id ?? ''],
      social: [val?.url ?? ''],
    });
  }

  createLicences(val?: Recognitions): FormGroup {
    return this.fb.group({
      recognition_id: [val?.recognition_id ?? ''],
      recognition_type: [val?.recognition_type ?? ''],
      recognition_name: [val?.recognition_name ?? ''],
      expiry_date: [val?.expiry_date ?? ''],
      photo_url: [val?.photo_url ?? ''],
    });
  }

  createTestimonial(val?: Testimonials): FormGroup {
    return this.fb.group({
      testimonial_id: [val?.testimonial_id ?? ''],
      name: [val?.name ?? ''],
      title: [val?.title ?? ''],
      testimonial: [val?.testimonial ?? ''],
      photo_url: [val?.photo_url ?? ''],
    });
  }

  createPhotos(val?: BusinessPhotos): FormGroup {
    return this.fb.group({
      photo_id: [val?.photo_id ?? ''],
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

  handleFileInputLogo(event: Event) {
    const { files } = event.target as HTMLInputElement;
    const file = files?.item(0);
    if (file?.type?.includes('image/')) {
      this.logoImageUrl = '';
      this.fileToUploadLogo = file;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.logoImageUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUploadLogo);
    }
  }

  // photos

  fileToUploadPhoto: (File | null | undefined)[] = [];
  arrayPhotosImageUrl: string[] = [];

  handleFileInput(event: Event, index: number) {
    const { files } = event.target as HTMLInputElement;
    this.arrayPhotosImageUrl[index] = '';
    const file = files?.item(0);
    if (file?.type?.includes('image/')) {
      this.fileToUploadPhoto[index] = file;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.arrayPhotosImageUrl[index] = event.target.result;
      };
      reader.readAsDataURL(this.fileToUploadPhoto[index] as File);
    }
  }

  // Licence or awarsds file
  fileToUploadLicence: (File | undefined | null)[] = [];
  arrayLicenceImageUrl: string[] = [];

  handleFileInputLicence(event: Event, i: number) {
    const { files } = event.target as HTMLInputElement;
    const file = files?.item(0);
    if (file?.type?.includes('image/')) {
      this.fileToUploadLicence[i] = file;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.arrayLicenceImageUrl[i] = event.target.result;
      };
      reader.readAsDataURL(this.fileToUploadLicence[i] as File);
    }
  }

  fileToUploadTestimonial: (File | undefined | null)[] = [];
  arrayTestmonialImageUrl: string[] = [];
  handleFileTestimonial(event: Event, i: number) {
    const { files } = event.target as HTMLInputElement;
    const file = files?.item(0);
    if (file?.type?.includes('image/')) {
      this.fileToUploadTestimonial[i] = file;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.arrayTestmonialImageUrl[i] = event.target.result;
      };
      reader.readAsDataURL(this.fileToUploadTestimonial[i] as File);
    }
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
    this.fileNames = [];
    const { companyname, punchline, aboutme, socialitems, licenceitems, testimonialitems, logo } =
      this.businessInfoForm.value;
    const businessPayload = {
      company_name: companyname,
      logo: logo,
      about_me: aboutme,
      punchline: punchline,
      social_links: socialitems,
      recognition: licenceitems,
      testimonials: testimonialitems,
    };
    console.log('businessPayload', businessPayload);

    // this.websiteService.addBusinessInfo(businessPayload).subscribe(data => {
    //   console.log(data);
    // });

    // this.store.dispatch(addBusiness({ businessData: businessPayload }));

    /*
      Extracting name of the images and prepending /businessname/type/,
      patching name into form and into an array to generate presigned URL
    */
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { customUsername: domain_name },
    } = userData;
    this.fileNames = [];
    if (this.logoImageUrl) {
      const logoKey = `${domain_name}/logo/${Date.now()}_${this.fileToUploadLogo?.name}`;
      this.fileNames.push({ type: 'logo', name: logoKey });
      this.businessInfoForm.get('logo')?.patchValue(logoKey);
    }
    this.fileToUploadPhoto.forEach((photo, index) => {
      if (photo?.name) {
        const photoKey = `${domain_name}/photos/${Date.now()}_${photo.name}`;
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
        this.photos.at(index)?.get('photo_url')?.patchValue(testimonialKey);
      }
    });

    const filePayload = {
      key: this.fileNames.map(({ name }) => name),
    };
    console.log(filePayload);
    if (!this.fileNames.length) {
      this.store.dispatch(addBusiness({ businessData: businessPayload }));
      return;
    }

    this.websiteService.uploadImage(filePayload).subscribe((data: any) => {
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
          return this.websiteService.uploadImageToS3(url, file);
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

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
