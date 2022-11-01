import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUploadImage } from '../interfaces/iuploadimage';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadimageService {

  constructor(private http: HttpClient) { }

  public uploadImage(file: File, fileName: string, imageType: string, description: string, imageDpi: string,
    uploadImage: IUploadImage): Observable<IUploadImage> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'type': 'formData'
      })
    };
    // let data = 'fileName=' + fileName + '&imageType=' + imageType +
    //   '&description=' + description + '&imageDpi=' + imageDpi + uploadImage;

    let url = environment.apiGatewayUrl + '/image/upload?fileName=' + fileName + '&imageType=' + imageType +
      '&description=' + description + '&imageDpi=' + imageDpi;

    return this.http.post<IUploadImage>(url, file, httpOptions);
  }
}
