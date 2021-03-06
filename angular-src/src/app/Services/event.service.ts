import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {EventItem} from "../events/events";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private httpClient: HttpClient) { }

  getAllEvents(): Observable<EventItem[]> {
    return this.httpClient.get<EventItem[]>(environment.apiUrl + '/events');
  }

  addEvent(event): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/events', event);
  }

  updateEvent(event): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/events', event);
  }

  deleteEvent(_id): Observable<any> {
    return this.httpClient.delete<any>(environment.apiUrl + `/events/${_id}`);
  }
}
