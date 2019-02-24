import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Course} from "../education/education";

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  constructor(private httpClient: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(environment.apiUrl + '/education');
  }
}
