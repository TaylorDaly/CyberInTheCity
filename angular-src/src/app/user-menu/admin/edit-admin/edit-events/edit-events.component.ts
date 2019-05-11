import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EventsService} from "../../../../Services/event.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {EventItem} from "../../../../events/events";

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.css']
})
export class EditEventsComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  eventFull: EventItem[];
  eventList = [];
  eventFields = ['title', 'date', 'location', 'time_frame'];

  editEvent = false;
  errMsg = "";
  edit = {
    _id: "",
    option: "add"
  };

  createEvent: FormGroup;

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
    this.resetForm();
    this.getAllEvents();
    //console.log(location.origin);
  }

  resetForm(){
    this.createEvent = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      timeTo: ['', Validators.required],
      timeFrom: ['', Validators.required],
      url: [''],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      description: [''],
    });
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editEvent = false;
    this.resetForm();
  }

  getAllEvents() {
    this.eventService.getAllEvents()
      .subscribe(
        res => {
          this.eventFull = res;
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
        date: new Date(data[i].eventDate).toISOString().substr(0, 10),
        location: data[i].location,
        time_frame: `${data[i].timeFrom} - ${data[i].timeTo}`
      });
    }
  }

  addNewEvent() {
    this.resetForm();
    this.editEvent = true;
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.eventList;
    this.componentRef.instance.listFields = this.eventFields;
    this.componentRef.instance.edit.subscribe(
      edit => {
        this.editTable(edit);
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

  editTable(editObj) {  // Returns id and option in object //
    this.edit = editObj;

    if (editObj.option == "update") {
      let event = this.eventFull.find(x => x._id === editObj._id);
      this.createEvent.patchValue({
        _id: editObj._id,
        title: event.title,
        timeTo: event.timeTo,
        timeFrom: event.timeFrom,
        url: event.url,
        location: event.location,
        eventDate: new Date(event.eventDate).toISOString().substr(0, 10),
        description: event.description,
      });
      this.editEvent = true;
    } else  {  // Delete loadComp item //
      if (window.confirm('Are you sure you want to delete this event?')) {
        this.eventService.deleteEvent(editObj._id)
          .subscribe(
            res => {
              window.alert(res['message']);
              this.resetSettings();
              this.resetTable();
            },
            err => {
              this.errMsg = err.message;
            }
          )
      }
    }
  }

  saveEvent() {
    //console.log(this.createEvent.value);
    if (this.edit.option === "add") {
      this.eventService.addEvent(this.createEvent.value)
        .subscribe(
          res => {
            window.alert(res['message']);
            this.resetSettings();
            this.resetTable();
          },
          err => {
            this.errMsg = err.message;
          }
        )

    } else { // Update Events //
      this.eventService.updateEvent(this.createEvent.value)
        .subscribe(
          res => {
            window.alert(res['message']);
            this.resetSettings();
            this.resetTable();
          },
          err => {
            this.errMsg = err.message;
          }
        )
    }
  }
}
