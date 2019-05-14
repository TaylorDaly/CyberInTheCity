import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {EducationService} from "../../../../Services/education.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Course} from "../../../../education/education";
import {PersonService} from "../../../../Services/person.service";

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.css']
})
export class EditEducationComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  professors= [];
  courseFull: Course[];
  courseList = [];
  courseFields = ['course', 'section', 'name', 'term'];
  terms = ['Fall', 'Spring', 'Summer', 'TBD'];

  errMsg = "";
  editCourse = false;
  edit = {
    _id: "",
    option: "add"
  };

  createCourse: FormGroup;
  yearList = [];

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
  get teacher() {
    return this.createCourse.get('teacherName');
  }
  get description() {
    return this.createCourse.get('description');
  }

  constructor(private eduService: EducationService,
              private personService: PersonService,
              private resolver: ComponentFactoryResolver,
              private fb: FormBuilder)
  {
    this.yearList[0] = new Date().getFullYear();
    for(let i = 1; i < 4; ++i) {
      this.yearList[i] = this.yearList[i-1] + 1;
    }
    this.yearList[4] = 'TBD';
  }

  ngOnInit() {
    this.resetForm();
    this.getAllCourses();
    this.getPeople();
    //console.log(this.currentYear);
  }

  resetForm() {
    this.createCourse = this.fb.group({
      _id: [''],
      courseNumber: ['', Validators.required],
      courseSection: [''],
      courseName: ['', Validators.required],
      teacherName: ['', Validators.required],
      teacherEmail: [''],
      description: [''],
      department: ['', Validators.required],
      termSemester: ['', Validators.required],
      termYear: ['', [Validators.required]],
      googleDriveLink: [''],
      syllabus: [''],
    });
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editCourse = false;
    this.resetForm();
    window.scroll(0,0);
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
        section: data[i].courseSection,
        name: data[i].courseName,
        term: `${data[i].termSemester} ${data[i].termYear}`});
    }
  }

  getPeople() {
    this.personService.getVerifiedPeople()
      .subscribe(
        res => {
          //console.log(res);
          this.getProfessors(res);
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  getProfessors(res) {
    for (let i = 0; i < res.length; ++i) {
      if (res[i].role === "Professor" ||
        res[i].role === "Assistant Professor" ||
        res[i].role === "Teacher's Assistant") {
        this.professors.push({
          name: res[i].name,
          email: res[i].email,
          _id: res[i]._id
        })
      }
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
        courseSection: course.courseSection,
        courseName: course.courseName,
        description: course.description,
        department: course.department,
        termSemester: course.termSemester,
        termYear: course.termYear,
        googleDriveLink: course.googleDriveLink,
        syllabus: course.syllabus,
        teacherName: course.teacherName,
        teacherEmail: course.teacherEmail
      });

      this.editCourse = true;
    } else  {  // Delete loadComp item //
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

  saveCourse(html) {
    this.createCourse.patchValue({
      description: html
    });

    if(this.createCourse.get('courseSection').value === "") {
      this.createCourse.patchValue({
        courseSection: '000'
      })
    }

    // Get teacher email from selected teacher name //
    let professor = this.professors.find(x => x.name === this.teacher.value);
    //console.log(professor);
    this.createCourse.patchValue({
      teacherEmail: professor.email
    });

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
