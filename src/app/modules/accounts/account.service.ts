import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  onlogout(){
    return localStorage.clear();
  }
}