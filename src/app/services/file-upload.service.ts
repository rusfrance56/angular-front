import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StringResponse} from "./string-response";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseURL = "http://localhost:8080/files/";

  constructor(private httpClient: HttpClient) {
  }

  saveFile(file: File): Observable<StringResponse>  {
    let formData:FormData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<StringResponse>(this.baseURL, formData);
  }

  getFileByName(fileName: string): Observable<Blob>  {
    return this.httpClient.get(this.baseURL + fileName, { responseType: 'blob' });
  }
}
