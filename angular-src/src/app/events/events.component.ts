import { Component, OnInit } from '@angular/core';
import {EventsService} from "../Services/event.service";
import {EventItem} from "./events";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  eventItem: EventItem[];
  error = "";
  loaded = false;

  constructor(private eventsService: EventsService) {
    this.eventItem = [];
  }

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.eventsService.getAllEvents()
      .subscribe(
        res => {
          this.eventItem = res;
          this.loaded = true;
        },
        err => {
          this.error = err.message;
        }
      )
  }
}
