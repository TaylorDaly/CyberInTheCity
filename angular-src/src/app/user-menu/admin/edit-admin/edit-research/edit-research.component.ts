import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ResearchService} from "../../../../Services/research.service";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {PersonService} from "../../../../Services/person.service";
import {Person} from "../../../../person/person";

@Component({
  selector: 'app-edit-research',
  templateUrl: './edit-research.component.html',
  styleUrls: ['./edit-research.component.css']
})
export class EditResearchComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  researchList = [];
  researchFields = ['title', 'type', 'start_date', 'end_date'];
  personList: Person[];

  errMsg = "";

  editResearch = false;
  researchTypeList = ['Faculty Project', 'Faculty Funding', 'Student Project'];

  createResearch = this.fb.group({
    title: ['', Validators.required],
    ownerID: this.fb.array([this.fb.control('', Validators.required)]),
    type: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    description: [''],
  });

  get title() {
    return this.createResearch.get('title');
  }
  get type() {
    return this.createResearch.get('type');
  }
  get startDate() {
    return this.createResearch.get('startDate');
  }
  get endDate() {
    return this.createResearch.get('endDate');
  }
  get ownerID() {
    return this.createResearch.get('ownerID') as FormArray;
  }

  constructor(private researchService: ResearchService,
              private personService: PersonService,
              private fb: FormBuilder,
              private resolver: ComponentFactoryResolver,) { }

  ngOnInit() {
    this.getAllResearch();
    this.getAllPeople();
  }

  getAllResearch(){
    this.researchService.getAllResearch()
      .subscribe(
        res => {
          this.setResearch(res);
          this.createTable();
          //console.log(res);
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          //console.log(err);
        }
      )
  }

  setResearch(data) {
    for(let i = 0; i < data.length; ++i) {
      this.researchList.push({
        _id: data[i]._id,
        title: data[i].title,
        type: data[i].type,
        start_date: new Date(data[i].startDate).toLocaleDateString(),
        end_date: new Date(data[i].endDate).toLocaleDateString()});
    }
  }

  getAllPeople() {
    this.personService.getAllPeople()
      .subscribe(
        res => {
          this.personList = res;
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          //console.log(err);
        }
      )
  }

  addResearcher() {
    this.ownerID.push(this.fb.control(''));
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.researchList;
    this.componentRef.instance.listFields = this.researchFields;
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
    this.researchList = [];
    this.getAllResearch();
    this.createTable();
  }
}
