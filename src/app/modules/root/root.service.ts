import { Injectable } from '@angular/core';

import { StorageService } from '../../shared/services/storage.service';
import { HttpClient } from '@angular/common/http';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  constructor() {}

  decodeUserToken() {
    const userToken = JSON.stringify(localStorage.getItem('accessToken')?.replace('Bearer ', ''));
    const data: any = jwt_decode(userToken);
    return data;
  }
}
