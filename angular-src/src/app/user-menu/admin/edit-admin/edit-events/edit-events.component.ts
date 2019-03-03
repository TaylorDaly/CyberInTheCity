import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EventsService} from "../../../../Services/event.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  eventList = [];
  eventFields = ['title', 'date', 'location', 'time_frame'];

  editEvent = false;
  errMsg = "";

  createEvent = this.fb.group({
    title: ['', Validators.required],
    timeTo: ['', Validators.required],
    timeFrom: ['', Validators.required],
    timeFrame: [''],
    url: [''],
    location: ['', Validators.required],
    eventDate: ['', Validators.required],
    description: [''],
  });

  get title() {
    return this.createEvent.get('title');
  }
  get timeTo() {
    return this.createEvent.get('timeTo');
  }
  get timeFrom() {
    return this.createEvent.get('timeFrom');
  }
  get location() {
    return this.createEvent.get('location');
  }
  get eventDate() {
    return this.createEvent.get('eventDate');
  }

  constructor(private eventService:EventsService,
              private resolver: ComponentFactoryResolver,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllEvents();
    //console.log(location.origin);
  }

  getAllEvents() {
    this.eventService.getAllEvents()
      .subscribe(
        res => {
          this.setEvents(res);
          this.createTable();
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
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.eventList;
    this.componentRef.instance.listFields = this.eventFields;
    this.componentRef.instance.edit.subscribe(
      edit => {
        //this.editTable(edit);
      }
    )
  }

  destroyTable() {
    if (this.componentRef != null) {
      //console.log("Destroy");
      this.componentRef.destroy();
    }
  }

  resetTable() {
    this.destroyTable();
    this.eventList = [];
    this.getAllEvents();
    this.createTable();
  }
}
