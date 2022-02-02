import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UtilsHelperService } from './modules/core/services/utils-helper.service';

declare const Modernizr: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isOnline: boolean;
  isMobile: boolean;

  constructor(@Inject(DOCUMENT) doc: Document, @Inject(LOCALE_ID) locale: string) {
    this.isOnline = navigator.onLine;
    this.isMobile = this.checkIfMobile();
  }

  ngOnInit() {
    this.checkBrowser();
  }

  setLogin() {
    // this.storageService.setToken();
  }

  checkBrowser() {
    if (UtilsHelperService.isBrowserValid()) {
      this.checkBrowserFeatures();
    } else {
      // this.snackBar.open(
      //   'Change your browser',
      //   'OK'
      // );
    }
  }

  checkIfMobile() {
    return UtilsHelperService.isMobile();
  }

  checkBrowserFeatures() {
    let supported = true;
    for (const feature in Modernizr) {
      if (
        Modernizr.hasOwnProperty(feature) &&
        typeof Modernizr[feature] === 'boolean' &&
        Modernizr[feature] === false
      ) {
        supported = false;
        break;
      }
    }

    if (!supported) {
      // this.snackBar.open('Update your browser', 'OK');
    }

    return supported;
  }
}
