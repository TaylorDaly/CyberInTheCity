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

  getCourse(course): Observable<Course> {
    return this.httpClient.get<Course>(environment.apiUrl + `/education/${course}`);
  }

  addCourse(course): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/education', course);
  }

  updateCourse(course): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/education', course);
  }

  deleteCourse(_id): Observable<any> {
    return this.httpClient.delete<any>(environment.apiUrl + `/education/${_id}`);
  }
}
