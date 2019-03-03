import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EducationService} from "../../../../Services/education.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.css']
})
export class EditEducationComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  courseList = [];
  courseFields = ['course', 'name', 'term'];

  editCourse = false;
  errMsg = "";

  createCourse = this.fb.group({
    courseNumber: ['', Validators.required],
    courseName: ['', Validators.required],
    description: [''],
    category: [''],
    department: ['', Validators.required],
    termYear: ['', Validators.required],
    content: [''],
    syllabus: [''],
  });

  get courseNumber() {
    return this.createCourse.get('courseNumber');
  }
  get courseName() {
    return this.createCourse.get('courseName');
  }
  get termYear() {
    return this.createCourse.get('termYear');
  }
  get department() {
    return this.createCourse.get('department');
  }

  constructor(private eduService: EducationService,
              private resolver: ComponentFactoryResolver,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses(){
    this.eduService.getAllCourses()
      .subscribe(
        res => {
          this.setCourses(res);
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

  setCourses(data) {
    for(let i = 0; i < data.length; ++i) {
      this.courseList.push({
        _id: data[i]._id,
        course: data[i].courseNumber,
        name: data[i].courseName,
        term: data[i].termYear});
    }
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.courseList;
    this.componentRef.instance.listFields = this.courseFields;
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
    this.courseList = [];
    this.getAllCourses();
    this.createTable();
  }
}
