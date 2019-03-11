import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Person} from "../person/person";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) {
  }

  getVerifiedPeople(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(environment.apiUrl + '/person');
  }

  getAllPeople(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(environment.apiUrl + '/person/admin');
  }

  loginPerson(loginUser): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/user/login', loginUser);
  }

  getPerson(_id): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + `/person/${_id}`);
  }

  addPerson(person): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/person', person);
  }

  updatePerson(person): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/person', person);
  }

  deletePerson(_id): Observable<any> {
    return this.httpClient.delete<any>(environment.apiUrl + `/person/${_id}`);
  }
}
