import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {navItems, StaticPage} from "../../../../navmenu/navItems";
import {FormBuilder, Validators} from "@angular/forms";
import {PageService} from "../../../../Services/page.service";

@Component({
  selector: 'app-edit-static',
  templateUrl: './edit-static.component.html',
  styleUrls: ['./edit-static.component.css']
})
export class EditStaticComponent implements OnInit {

  parents = new navItems().getParents();

  createPage = this.fb.group({
    content: [''],
    title: ['', Validators.required],
    parent: ['', Validators.required]
  });

  pageList = [];
  pageFields = ['title', 'parent'];

  loadTable = false;
  errMsg = "";

  get title() {
    return this.createPage.get('title');

  }
  get parent() {
    return this.createPage.get('parent');
  }

  constructor(private fb: FormBuilder,
              private pageService: PageService,) { }

  ngOnInit() {
    this.getAllPages();
  }

  getAllPages(){
    this.pageService.getAllStaticPages()
      .subscribe(
        res => {this.setPageList(res)},
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
    //console.log(this.pageList);
    this.loadTable = true;
  }

  addStaticPage(html) {
    this.createPage.patchValue({
      content: html,
      // title: this.title.value.trim()
    });
    console.log(this.createPage.value);
    this.pageService.addPage(this.createPage.value)
      .subscribe(
        res => {
          window.alert(res['message']);
          location.reload();
        },
        err => {
          this.errMsg = err.message;
        }
      );
  }

}