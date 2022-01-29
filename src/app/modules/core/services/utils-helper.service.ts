import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import Bowser from 'bowser';

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

  constructor(private http: HttpClient) {}

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

  uploadImage(images: any) {
    return this.http.post(`${this.api}/utils/signedurl/put`, images);
  }

  uploadImageToS3(url: any, file: any) {
    console.log('url', url);

    // const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(url, file);
  }

  handleFileInput(event: Event, type?: string) {
    const { files } = event.target as HTMLInputElement;
    const file = files?.item(0);
    return new Promise<[File, string]>((resolve, reject) => {
      try {
        if (!type || file?.type?.includes(type)) {
          let reader = new FileReader();
          reader.onload = (event: any) => {
            return resolve([file as File, event.target.result]);
          };
          reader.readAsDataURL(file as File);
        } else {
          reject();
        }
      } catch (ex) {
        return reject();
      }
    });
  }
}
