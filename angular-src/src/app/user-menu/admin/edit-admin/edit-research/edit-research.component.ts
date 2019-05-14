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
  researchFields = ['title', 'type'];

  personList: Person[];
  //researchTypeList = ['Faculty Project', 'Faculty Funding', 'Student Project'];

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
  get ongoing() {
    return this.createResearch.get('ongoing');
  }
  get description() {
    return this.createResearch.get('description');
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
      type: [''],
      startDate: [{value: '', disabled: false}],
      endDate: [{value: '', disabled: true}],
      ongoing: [true],
      description: [''],
    });
  }

  ongoingDate() {
    if(this.ongoing.value == false) {  // When previously set to false //
      //this.endDate.clearValidators();
      this.endDate.disable();
    } else {
      //this.endDate.setValidators(Validators.required);
      this.endDate.enable();
    }
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editResearch = false;
    this.resetForm();
    window.scroll(0,0);
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
      });
      if(this.researchList[i].type == '') this.researchList[i].type = "Not declared";
    }
  }

  getAllPeople() {
    this.personService.getVerifiedPeople()
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
    this.startDate.enable();
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
      //console.log(research);
      this.createResearch.patchValue({
        _id: editObj._id,
        title: research.title,
        ownerID: research.ownerID,  // Only adds the first one from research.ownerID array //
        type: research.type,
        description: research.description,
        startDate: [{value: '', disabled: false}]
      });

      if(research['startDate'])
        this.createResearch.patchValue({
          startDate: new Date(research.startDate).toISOString().substring(0, 10),
        });

      if (research['endDate']) {
        this.createResearch.patchValue({
          endDate: new Date(research.endDate).toISOString().substring(0, 10),
        });
      } else {
        this.endDate.disable();
        this.createResearch.patchValue({
          ongoing: true
        });
      }

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

  saveResearch(html) {
    this.createResearch.patchValue({
      description: html
    });

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
