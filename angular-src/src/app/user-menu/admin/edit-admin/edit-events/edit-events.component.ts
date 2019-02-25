import { Component, OnInit } from '@angular/core';
import {EventsService} from "../../../../Services/event.service";

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit {

  eventList = [];
  eventFields = ['title', 'date', 'location', 'time_frame'];

  loadTable = false;
  errMsg = "";

  constructor(private eventService:EventsService) { }

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.eventService.getAllEvents()
      .subscribe(
        res => {
          this.setEvents(res);
          //console.log(res);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  setEvents(data) {
    for (let i = 0; i < data.length; ++i) {
      this.eventList.push({
        _id: data[i]._id,
        title: data[i].title,
        date: new Date(data[i].eventDate).toLocaleDateString(),
        location: data[i].location,
        time_frame: data[i].timeFrame});
    }
    this.loadTable = true;
  }

}
