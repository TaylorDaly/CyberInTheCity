import {
  Component, ComponentFactoryResolver,
  OnInit,
  //ViewChild,
  //ViewContainerRef,
} from '@angular/core';
import {navItems} from "../../../../navmenu/navItems";
import {FormBuilder, Validators} from "@angular/forms";
import {PageService} from "../../../../Services/page.service";
//import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";

@Component({
  selector: 'app-edit-static',
  templateUrl: './edit-static.component.html',
  styleUrls: ['./edit-static.component.css']
})
export class EditStaticComponent implements OnInit {

  // @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  // componentRef: any;
  // factory: any;

  parents = new navItems().getParents();

  createPage = this.fb.group({
    _id: [''],
    content: [''],
    title: ['', Validators.required],
    parent: ['', Validators.required]
  });

  pageList = [];
  pageFields = ['title', 'parent'];

  loadTable = false;
  editPage = false;
  errMsg = "";

  get title() {
    return this.createPage.get('title');

  }
  get parent() {
    return this.createPage.get('parent');
  }

  constructor(private fb: FormBuilder,
              private pageService: PageService,
              private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.getAllPages();
  }

  getAllPages(){
    this.pageService.getAllStaticPages()
      .subscribe(
        res => {
          this.errMsg = "";
          this.setPageList(res);
          //console.log(res);
          //this.createTable();
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          console.log(err);
        }
      )
  }

  setPageList(data) {
    //console.log(data);
    for(let i = 0; i < data.length; ++i) {
      this.pageList.push({_id: data[i]._id, title: data[i].title, parent: data[i].parent});
    }
    this.loadTable = true;
    //console.log(this.pageList);
  }

  addStaticPage(html) {
    this.createPage.patchValue({
      content: html,
      // title: this.title.value.trim()
    });
    //console.log(this.createPage.value);
    this.pageService.addPage(this.createPage.value)
      .subscribe(
        res => {
          window.alert(res['message']);
          //this.setTable();
          //this.editPage = false;
          this.errMsg = "";
          location.reload();
          //this.resetTable();
        },
        err => {
          this.errMsg = err.message;
        }
      );
  }

  editTable(editObj) {
    this.createPage.patchValue({
      _id: editObj._id
    });

    //console.log(this.createPage.value);

    if(editObj.option == "update") {
      this.editPage = true;
      this.pageService.getStaticPageById(editObj._id)
        .subscribe(
          res => {
            this.errMsg = "";
          },
          err => {
            this.errMsg = err.message;
          }
        )
      // this.pageService.updatePage(this.createPage.value)
      //   .subscribe(
      //     res => {
      //       window.alert(res['message']);
      //     },
      //     err => {
      //       this.errMsg = err.message;
      //     }
      //   )
    } else  {  // Delete table item //
      //console.log(this.createPage.value);
      if(window.confirm('Are you sure you want to delete this page?')) {
        this.pageService.deletePage(this.createPage.value)
          .subscribe(
            res => {
              window.alert(res['message']);
              this.errMsg = "";
              location.reload();
              //this.resetTable();
              //location.reload();
            },
            err => {
              this.errMsg = err.message;
            }
          )
      }
    }
  }
}
