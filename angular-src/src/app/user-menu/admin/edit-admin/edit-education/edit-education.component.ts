import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EducationService} from "../../../../Services/education.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Course} from "../../../../education/education";

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.css']
})
export class EditEducationComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  courseFull: Course[];
  courseList = [];
  courseFields = ['course', 'name', 'term'];
  terms = ['Fall', 'Spring', 'Summer'];

  errMsg = "";
  editCourse = false;
  edit = {
    _id: "",
    option: "add"
  };

  createCourse: FormGroup;
  currentYear = new Date().getFullYear();

  get courseNumber() {
    return this.createCourse.get('courseNumber');
  }
  get courseName() {
    return this.createCourse.get('courseName');
  }
  get termSemester() {
    return this.createCourse.get('termSemester');
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
    this.resetForm();
    this.getAllCourses();
    //console.log(this.currentYear);
  }

  resetForm() {
    this.createCourse = this.fb.group({
      _id: [''],
      courseNumber: ['', Validators.required],
      courseName: ['', Validators.required],
      description: [''],
      category: [''],
      department: ['', Validators.required],
      termSemester: ['', Validators.required],
      termYear: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]+$')]],
      content: [''],
      syllabus: [''],
    });
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editCourse = false;
    this.resetForm();
  }

  getAllCourses(){
    this.eduService.getAllCourses()
      .subscribe(
        res => {
          this.courseFull = res;
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

  addNewCourse() {
    this.resetForm();
    this.editCourse = true;
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.courseList;
    this.componentRef.instance.listFields = this.courseFields;
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
    this.courseList = [];
    this.getAllCourses();
    this.createTable();
  }

  editTable(editObj) {  // Returns id and option in object //
    this.edit = editObj;

    if (editObj.option == "update") {
      let course = this.courseFull.find(x => x._id === editObj._id);
      this.createCourse.patchValue({
        _id: editObj._id,
        courseNumber: course.courseNumber,
        courseName: course.courseName,
        description: course.description,
        category: course.category,
        department: course.department,
        termSemester: course.termSemester,
        termYear: course.termYear,
        content: course.content,
        syllabus: course.syllabus,
      });

      this.editCourse = true;
    } else  {  // Delete table item //
      if (window.confirm('Are you sure you want to delete this course?')) {
        this.eduService.deleteCourse(editObj._id)
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

  saveCourse() {
    //console.log(this.createResearch.value);
    if (this.edit.option === "add") {
      this.eduService.addCourse(this.createCourse.value)
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
      this.eduService.updateCourse(this.createCourse.value)
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
