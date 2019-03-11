import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CareersService} from "../../../../Services/careers.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CareersItem} from "../../../../careers/careers";

@Component({
  selector: 'app-edit-careers',
  templateUrl: './edit-careers.component.html',
  styleUrls: ['./edit-careers.component.css']
})
export class EditCareersComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  careersFull: CareersItem[];
  careerList = [];
  careerFields = ['job_title', 'type', 'company', 'post_date'];

  editCareers = false;
  errMsg = "";
  edit = {
    _id: "",
    option: "add"
  };

  createCareer: FormGroup;

  jobTypeList = ['Full Time', 'Part Time', 'Internship'];

  get jobtitle() {
    return this.createCareer.get('jobtitle');
  }
  get company() {
    return this.createCareer.get('company');
  }
  get jobType() {
    return this.createCareer.get('jobType');
  }
  // get url() {
  //   return this.createCareer.get('url');
  // }
  get location() {
    return this.createCareer.get('location');
  }

  constructor(private careerService: CareersService,
              private resolver: ComponentFactoryResolver,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.resetForm();
    this.getAllCareers();
  }

  resetForm() {
    this.createCareer = this.fb.group({
      _id: [''],
      jobtitle: ['', Validators.required],
      company: ['', Validators.required],
      jobType: ['', Validators.required],
      url: [''],
      location: ['', Validators.required],
      postedDate: [''],
      description: [''],
    });
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editCareers = false;
    this.resetForm();
  }

  getAllCareers() {
    this.careerService.getOurCareers()
      .subscribe(
        res => {
          this.careersFull = res['ourCareers'];
          this.setCareers(res['ourCareers']);
          this.createTable();
          //console.log(res);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  setCareers(data) {
    for (let i = 0; i < data.length; ++i) {
      this.careerList.push({
        _id: data[i]._id,
        job_title: data[i].jobtitle,
      type: data[i].jobType,
      company: data[i].company,
      post_date: new Date(data[i].postedDate).toISOString().substr(0,10)});
    }
    //this.loadTable = true;
  }

  addNewCareer() {
    this.resetForm();
    this.editCareers = true;
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.careerList;
    this.componentRef.instance.listFields = this.careerFields;
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
    this.careerList = [];
    this.getAllCareers();
    this.createTable();
  }

  editTable(editObj) {  // Returns id and option in object //
    this.edit = editObj;

    if (editObj.option == "update") {
      let career = this.careersFull.find(x => x._id === editObj._id);
      this.createCareer.patchValue({
        _id: editObj._id,
        jobtitle: career.jobtitle,
        company: career.company,
        jobType: career.jobType,
        url: career.url,
        location: career.location,
        postedDate: career.postedDate,
        description: career.description,
      });
      this.editCareers = true;
    } else  {  // Delete loadComp item //
      if (window.confirm('Are you sure you want to delete this job?')) {
        this.careerService.deleteCareer(editObj._id)
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

  saveCareer() {
    //console.log(this.createResearch.value);
    if (this.edit.option === "add") {
      this.careerService.addCareer(this.createCareer.value)
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
      console.log(this.createCareer.get('_id').value);
      this.careerService.updateCareer(this.createCareer.value)
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

