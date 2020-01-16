import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit, OnDestroy {
  qrdata: string = null;
  qrForm: FormGroup;
  message: string;
  showQR: boolean;

  constructor(private crypto: CryptoService, private fb: FormBuilder, private router: Router) { 
    this.message = '';
    this.qrdata = 'initial string';
    this.showQR = false;
    //console.log('show');
  }

  ngOnInit() {
    this.createQRForm();
  }

  createQRForm() {
    this.qrForm = this.fb.group(
      {
        tableid: [null, [Validators.required, Validators.minLength(1), Validators.pattern('^\\d*$')],],
      }
    );
  }

  generateQRcode(): void{
    if(this.qrForm.invalid){
      return;
    }
    let path = this.qrForm.get('tableid').value;
    this.qrdata = this.crypto.getUrl(path);
    this.message = 'Generated ' + path;
    this.showQR = true;
  }

  returnAdmin(){
    this.router.navigate(['admin']);
  }

  ngOnDestroy(): void {
    
    this.message = '';
    this.qrdata = 'initial string';
    this.showQR = false;
  }

}
