import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CareersService} from "../../../../Services/careers.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-careers',
  templateUrl: './edit-careers.component.html',
  styleUrls: ['./edit-careers.component.css']
})
export class EditCareersComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  careerList = [];
  careerFields = ['job_title', 'type', 'company', 'post_date'];

  editCareers = false;
  errMsg = "";

  createCareer = this.fb.group({
    jobtitle: ['', Validators.required],
    company: ['', Validators.required],
    jobType: ['', Validators.required],
    url: [''],
    location: ['', Validators.required],
    postedDate: [''],
    description: [''],
  });

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
    this.getAllCareers();
  }

  getAllCareers() {
    this.careerService.getAllCareers()
      .subscribe(
        res => {
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
      post_date: new Date(data[i].postedDate).toLocaleDateString()});
    }
    //this.loadTable = true;
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.careerList;
    this.componentRef.instance.listFields = this.careerFields;
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
    this.careerList = [];
    this.getAllCareers();
    this.createTable();
  }

    // editTable(editObj) {
    //   this.createPage.patchValue({
    //     _id: editObj._id
    //   });
    //
    //   //console.log(this.createPage.value);
    //
    //   if(editObj.option == "update") {
    //     this.editPage = true;
    //     this.pageService.getStaticPageById(editObj._id)
    //       .subscribe(
    //         res => {},
    //         err => {}
    //       )
    //     // this.pageService.updatePage(this.createPage.value)
    //     //   .subscribe(
    //     //     res => {
    //     //       window.alert(res['message']);
    //     //     },
    //     //     err => {
    //     //       this.errMsg = err.message;
    //     //     }
    //     //   )
    //   } else  {  // Delete table item //
    //     //console.log(this.createPage.value);
    //     if(window.confirm('Are you sure you want to delete this page?')) {
    //       this.pageService.deletePage(this.createPage.value)
    //         .subscribe(
    //           res => {
    //             window.alert(res['message']);
    //             location.reload();
    //             //this.resetTable();
    //             //location.reload();
    //           },
    //           err => {
    //             this.errMsg = err.message;
    //           }
    //         )
    //     }
    //   }
    // }
}

