import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_ENDPOINT: string = environment.api_endpoint;

  constructor(private messenger: MessageService) {}

  test(){
    this.messenger.queue("test");
  }

}
