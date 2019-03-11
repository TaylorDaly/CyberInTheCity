import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ResearchService} from "../../../../Services/research.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {PersonService} from "../../../../Services/person.service";
import {Person} from "../../../../person/person";
import {ResearchItem} from "../../../../research/research";

@Component({
  selector: 'app-edit-research',
  templateUrl: './edit-research.component.html',
  styleUrls: ['./edit-research.component.css']
})
export class EditResearchComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  researchFull: ResearchItem[];
  researchList = [];
  researchFields = ['title', 'type', 'start_date', 'end_date'];

  personList: Person[];
  researchTypeList = ['Faculty Project', 'Faculty Funding', 'Student Project'];

  // Settings to reset //
  errMsg = "";
  editResearch = false;
  edit = {
    _id: "",
    option: "add"
  };

  selectLength = 'col-md-12';
  createResearch: FormGroup;

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
    this.resetForm();
    this.getAllResearch();
    this.getAllPeople();
  }

  resetForm() {
    this.createResearch = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      ownerID: this.fb.array([this.fb.control('', Validators.required)]),
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
    });
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editResearch = false;
    this.resetForm();
  }

  getAllResearch(){
    this.researchService.getAllResearch()
      .subscribe(
        res => {
          this.researchFull = res;
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
        start_date: new Date(data[i].startDate).toISOString().substring(0, 10),
        end_date: new Date(data[i].endDate).toISOString().substring(0, 10)});
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

  addNewResearch() {
    this.resetForm();
    this.editResearch = true;
  }

  addResearcher(value) {
    if(this.ownerID.length < 5) {
      this.ownerID.push(this.fb.control(value, Validators.required));
      if(this.ownerID.length > 1) {
        this.selectLength = 'col-md-11';
      }
    }
  }

  deleteResearcher(index: number) {
    this.ownerID.removeAt(index);
    if(this.ownerID.length <= 1)
      this.selectLength = 'col-md-12';
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.researchList;
    this.componentRef.instance.listFields = this.researchFields;
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
    this.researchList = [];
    this.getAllResearch();
    this.createTable();
  }

  editTable(editObj) {  // Returns id and option in object //
    this.edit = editObj;

    if (editObj.option == "update") {
      let research = this.researchFull.find(x => x._id === editObj._id);
      this.createResearch.patchValue({
        _id: editObj._id,
        title: research.title,
        ownerID: research.ownerID,  // Only adds the first one from research.ownerID array //
        type: research.type,
        startDate: new Date(research.startDate).toISOString().substring(0, 10),
        endDate: new Date(research.endDate).toISOString().substring(0, 10),
        description: research.description,
      });

      // Push rest of research.ownerID array //
      for (let i = 1; i < research.ownerID.length; ++i) {
        this.addResearcher(research.ownerID[i]);
      }
      this.editResearch = true;
    } else  {  // Delete loadComp item //
      if (window.confirm('Are you sure you want to delete this research?')) {
        this.researchService.deleteResearch(editObj._id)
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

  saveResearch() {
    //console.log(this.createResearch.value);
    if (this.edit.option === "add") {
      this.researchService.addResearch(this.createResearch.value)
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

    } else { // Update research //
      this.researchService.updateResearch(this.createResearch.value)
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
