import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.css']
})
export class ListDataComponent implements OnInit {

  @Input() listItems: object[];
  @Input() listFields: string[];
  @Output() edit = new EventEmitter<object>();

  editObject = {
    _id: "",
    option: ""
  };

  constructor() { }

  ngOnInit() {
    //console.log(this.listItems);
    if(this.listFields.indexOf(' ') == -1){
      this.listFields.push(' ');
    }
  }

  updateItem(id: string) {
    this.editObject._id = id;
    this.editObject.option = "update";
    this.edit.emit(this.editObject);
  }

  deleteItem(id: string) {
    this.editObject._id = id;
    this.editObject.option = "delete";
    this.edit.emit(this.editObject);
  }
}
