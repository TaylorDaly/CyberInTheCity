import {
  Component, ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {navItems, StaticPage} from "../../../../navmenu/navItems";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageService} from "../../../../Services/page.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";

@Component({
  selector: 'app-edit-static',
  templateUrl: './edit-static.component.html',
  styleUrls: ['./edit-static.component.css']
})
export class EditStaticComponent implements OnInit {

  @ViewChild('dataTable', {read: ViewContainerRef}) table: ViewContainerRef;
  componentRef: any;
  factory: any;

  parents = new navItems().getParents();

  pageFull: StaticPage[];
  pageList = [];
  pageFields = ['title', 'parent'];

  //loadTable = false;
  editPage = false;
  errMsg = "";
  edit = {
    _id: "",
    option: "add"
  };

  createPage: FormGroup;

  get title() {
    return this.createPage.get('title');

  }
  get parent() {
    return this.createPage.get('parent');
  }
  get content() {
    return this.createPage.get('content');
  }

  constructor(private fb: FormBuilder,
              private pageService: PageService,
              private resolver: ComponentFactoryResolver)
  {}

  ngOnInit() {
    this.resetForm();
    this.getAllPages();
  }

  resetForm() {
    this.createPage = this.fb.group({
      _id: [''],
      content: ['<p>Enter text here...</p>'],
      title: ['', Validators.required],
      parent: ['', Validators.required]
    });
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editPage = false;
    this.resetForm();
  }

  // removePages() {
  //   let index1 = this.pageList.map(function(page) {return page.title; }).indexOf("About Us");
  //   let index2 = this.pageList.map(function(page) {return page.title; }).indexOf("Contact Us");
  //
  //   if(index1 != -1 && index2 != -1) {
  //     this.pageList.splice(index1, 1);  // Remove About Us from static pages //
  //     this.pageList.splice(index2, 1);  // Remove Contact Us from static pages //
  //   }
  // }

  getAllPages(){
    this.pageService.getAllStaticPages()
      .subscribe(
        res => {
          //console.log(res);
          this.pageFull = res;
          this.setPageList(res);
          this.createTable();
          //console.log(res);
          //this.createTable();
        },
        err => {
          //window.alert(`Error ${err.code}: ${err.message}`);
          this.errMsg = err.message;
          //console.log(err);
        }
      )
  }

  setPageList(data) {
    //console.log(data);
    for(let i = 0; i < data.length; ++i) {
      this.pageList.push({
        _id: data[i]._id,
        title: data[i].title,
        parent: data[i].parent});
    }
    //this.loadTable = true;
    //console.log(this.pageList);
  }

  addNewPage() {
    this.resetForm();
    this.editPage = true;
  }

  createTable() {
    this.table.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.table.createComponent(this.factory);
    this.componentRef.instance.listItems = this.pageList;
    this.componentRef.instance.listFields = this.pageFields;
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
    this.pageList = [];
    this.getAllPages();
    this.createTable();
  }

  editTable(editObj) {  // Returns id and option in object //
    this.edit = editObj;

    if (editObj.option == "update") {
      let page = this.pageFull.find(x => x._id === editObj._id);
      //console.log(this.pageFull);
      //console.log(page);
      this.pageService.getStaticPageById(editObj._id)
        .subscribe(
          res => {
            this.createPage.patchValue({
              _id: editObj._id,
              content: res['content'],
              title: page.title,
              parent: page.parent
            });
            this.editPage = true;
          },
          err => {
            this.errMsg = err.message;
          }
        );
    } else  {  // Delete table item //
      if (window.confirm('Are you sure you want to delete this page?')) {
        this.pageService.deletePage(editObj._id)
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

  savePage(html) {
    //console.log(this.createResearch.value);
    this.createPage.patchValue({
      content: html
    });

    if (this.edit.option === "add") {
      this.pageService.addPage(this.createPage.value)
        .subscribe(
          res => {
            window.alert(res['message']);
            //this.resetSettings();
            //this.resetTable();
            location.reload();
          },
          err => {
            this.errMsg = err.message;
          }
        )

    } else { // Update research //
      this.pageService.updatePage(this.createPage.value)
        .subscribe(
          res => {
            window.alert(res['message']);
            //this.resetSettings();
            //this.resetTable();
            location.reload();
          },
          err => {
            this.errMsg = err.message;
          }
        )
    }
  }
}
