import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import Bowser from 'bowser';
import { AuthService } from '../../auth/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { SignedUrlResponse } from 'src/app/shared/interfaces/response-type.interface';

@Injectable({
  providedIn: 'root',
})
export class UtilsHelperService {
  private api = environment.api_end_point;
  static isPalindrome(str: string) {
    const len = Math.floor(str.length / 2);
    for (let i = 0; i < len; i++) {
      if (str[i] !== str[str.length - i - 1]) {
        return false;
      }
    }
    return true;
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  static isBrowserValid() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.satisfies({
      windows: {
        'internet explorer': '>10',
      },
      macos: {
        safari: '>10.1',
      },
      chrome: '>20.1.1432',
      firefox: '>31',
      opera: '>22',
    });
  }

  uploadImage(images: any): Observable<SignedUrlResponse> {
    return this.http.post<SignedUrlResponse>(`${this.api}/utils/signedurl/put`, images);
  }

  uploadImageToS3(url: any, file: any) {
    console.log('url', url);

    // const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(url, file);
  }

  async getSignedUrlAndUploadToS3(...args: { fileKey: string; file: File }[]) {
    const { signedURL } = await firstValueFrom(
      this.uploadImage({ key: args.map(({ fileKey }) => fileKey) })
    );
    args.forEach(async ({ fileKey, file }) => {
      firstValueFrom(this.uploadImageToS3(signedURL[fileKey], file));
    });
  }

  readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      let reader = new FileReader();
      try {
        reader.onload = (event: any) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  // async handleFileInput(event: Event, category: string, type?: string): Promise<[File, string]> {
  //   const { files } = event.target as HTMLInputElement;
  //   const file = files?.item(0);
  //   try {
  //     if (file && (!type || file?.type?.includes(type))) {
  //       const url = await this.readFileAsDataUrl(file);
  //       return [file, url];
  //     } else {
  //       throw new Error('Invalid File Input');
  //     }
  //   } catch (ex) {
  //     throw ex;
  //   }
  // }

  async handleFileInput(
    event: Event,
    category: string,
    imageType?: string,
    upload?: boolean
  ): Promise<[File, string, string]> {
    const { files } = event.target as HTMLInputElement;
    const file = files?.item(0);
    try {
      if (file && (!imageType || file.type?.includes(imageType))) {
        const {
          dashboardInfos: { customUsername },
        } = this.authService?.decodeUserToken();
        const fileKey = `${customUsername}/${category}/${Date.now()}_${file.name}`;
        if (upload) {
          this.getSignedUrlAndUploadToS3({ fileKey, file });
        }
        const url = await this.readFileAsDataUrl(file);
        return [file, url, fileKey];
      } else {
        throw new Error('Invalid File Input');
      }
    } catch (ex) {
      console.log(ex);
      throw new Error('Image Upload failed');
    }
  }
}
