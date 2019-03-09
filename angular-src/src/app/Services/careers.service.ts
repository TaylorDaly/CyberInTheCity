import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {CareersItem} from "../careers/careers";

@Injectable({
  providedIn: 'root'
})
export class CareersService {

  constructor(private httpClient: HttpClient) {
  }

  getAllCareers(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/careers');
  }

  getOurCareers(): Observable<CareersItem[]> {
    return this.httpClient.get<CareersItem[]>(environment.apiUrl + '/careers?ourCareers=true');
  }

  addCareer(career): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/careers', career);
  }

  updateCareer(career): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/careers', career);
  }

  deleteCareer(_id): Observable<any> {
    return this.httpClient.delete<any>(environment.apiUrl + `/careers/${_id}`);
  }
}
