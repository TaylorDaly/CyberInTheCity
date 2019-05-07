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

  constructor(private eventsService: EventsService) { }

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.eventsService.getAllEvents()
      .subscribe(
        res => {
          this.eventItem = res;
        },
        err => {
          this.error = err.message;
        }
      )
  }
}
