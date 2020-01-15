import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {
  FRONTEND_API_URL = 'https://eitcny2020.azureedge.net';

  constructor() { }


  encrypt(msg: string): string {
    let encryptedObj = CryptoJS.AES.encrypt(msg, "1234");
    //console.log(encryptedObj);
    return this.convertToHex(encryptedObj.toString());
  }

  convertToHex(str: string): string{
    let hex = '';
    for (var i = 0; i < str.length; i++) {
      hex += "" + str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  toUrl(path: string): string {
    return this.FRONTEND_API_URL + '/tableId/' + path;
  }

  getUrl(tableid: string){
    return this.toUrl(this.encrypt(tableid));
  }
}
