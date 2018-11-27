import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from "rxjs";

export interface Cat {
  name: string;
}

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  // file from event.target.files[0]
  uploadFile(url: string, file: File): Observable<HttpEvent<any>> {

    let formData = new FormData();
    formData.append('upload', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }

  getCat(name: string): Observable<Cat> {
    return this.http.get<Cat>(`http://localhost:8000/api/cats`);
  }
}