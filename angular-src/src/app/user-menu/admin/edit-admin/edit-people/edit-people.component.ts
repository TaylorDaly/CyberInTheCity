import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {PersonService} from "../../../../Services/person.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";

@Component({
  selector: 'app-edit-people',
  templateUrl: './edit-people.component.html',
  styleUrls: ['./edit-people.component.css']
})
export class EditPeopleComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  personList = [];
  personFields = ['name', 'email', 'role', 'verified'];

  editPerson = false;
  errMsg = "";

  constructor(private personService: PersonService,
              private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.getAllPeople();
  }

  getAllPeople() {
    this.personService.getAllPeople()
      .subscribe(
        res => {
          this.setPersonList(res);
          this.createTable();
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          console.log(err);
        }
      )
  }

  setPersonList(data) {
    //console.log(data);
    for(let i = 0; i < data.length; ++i) {
      this.personList.push({_id: data[i]._id, name: data[i].name, email: data[i].email,
        role: data[i].sys_role, verified: data[i].verified.toString().charAt(0).toUpperCase()});
    }
    //console.log(this.pageList);
    //this.loadTable = true;
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.personList;
    this.componentRef.instance.listFields = this.personFields;
    this.componentRef.instance.edit.subscribe(
      edit => {
        //this.editTable(edit);
      }
    )
  }

  destroyTable() {
    if(this.componentRef != null) {
      //console.log("Destroy");
      this.componentRef.destroy();
    }
  }

  resetTable() {
    this.destroyTable();
    this.personList = [];
    this.getAllPeople();
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
