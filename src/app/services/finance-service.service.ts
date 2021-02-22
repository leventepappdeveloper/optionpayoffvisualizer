import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class FinanceServiceService {

  private url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=';
  private endUrl = '&apikey=V03EGS54OMURLU8W';
  private dataUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=';


  constructor(private httpClient: HttpClient) {

  }

  search(keyword: string) {
    return this.httpClient.get<any[]>(`${this.url}${keyword}${this.endUrl}`);
  }

  getData(term: string) {
    return this.httpClient.get<any[]>(`${this.dataUrl}${term}${this.endUrl}`);
  }

  getExpirations() {
    const httpheaders = new HttpHeaders({
      'Authorization' : '57VYOz2SIltLtjXNFbEvu4eNDi1b',
      'Accept' : 'application/json'
    });

    return this.httpClient.get('https://sandbox.tradier.com/v1/markets/options/expirations?symbol=VXX&includeAllRoots=true&strikes=true', {headers: httpheaders});
  }
}
