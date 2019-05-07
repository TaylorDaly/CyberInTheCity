import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {navItems} from "../../navmenu/navItems";
import {EditStaticComponent} from "./edit-admin/edit-static/edit-static.component";
import {EditAboutComponent} from "./edit-admin/edit-about/edit-about.component";
import {EditPeopleComponent} from "./edit-admin/edit-people/edit-people.component";
import {EditResearchComponent} from "./edit-admin/edit-research/edit-research.component";
import {EditEducationComponent} from "./edit-admin/edit-education/edit-education.component";
import {EditCareersComponent} from "./edit-admin/edit-careers/edit-careers.component";
import {EditEventsComponent} from "./edit-admin/edit-events/edit-events.component";
import {EditContactComponent} from "./edit-admin/edit-contact/edit-contact.component";
import {EditNewsComponent} from "./edit-admin/edit-news/edit-news.component";
import {EditHomeComponent} from "./edit-admin/edit-home/edit-home.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('editComponent', {read: ViewContainerRef}) loadComp: ViewContainerRef;

  componentRef: any;
  factory: any;

  parents: any[];
  errMsg = "";

  constructor(private resolver: ComponentFactoryResolver) {
    switch(sessionStorage.getItem('sys_role')) {
      case 'Sys_Admin':
        this.parents =  new navItems().getParents();
        this.parents[this.parents.length] = {name: 'Static Page'};
        this.parents[this.parents.length] = {name: 'Home'};
        // this.parents.splice(this.parents.map((parent) => {
        //   return parent.name;
        // }).indexOf("News"), 1);
        break;
      case 'Admin':
        this.parents = [
          {name: 'Education'},
          {name: 'Research'},
          {name: 'Careers'}
          ];
        break;
      default:
        this.parents = [];
    }
  }

  ngOnInit() {
    //console.log(this.parents);
    this.editComp(this.parents[0].name);
  }

  // Loading editing components for each Nav parent and static pages //
  editComp(edit: string) {
    this.destroyComponent();
    switch (edit) {
      case "Home":
        this.createComponent(EditHomeComponent);
        break;
      case "Static Page":
        this.createComponent(EditStaticComponent);
        break;
      case "About Us":
        this.createComponent(EditAboutComponent);
        break;
      case "People":
        this.createComponent(EditPeopleComponent);
        break;
      case "Research":
        this.createComponent(EditResearchComponent);
        break;
      case "Education":
        this.createComponent(EditEducationComponent);
        break;
      case "Careers":
        this.createComponent(EditCareersComponent);
        break;
      case "Events":
        this.createComponent(EditEventsComponent);
        break;
      case "News":
        this.createComponent(EditNewsComponent);
        break;
      case "Contact Us":
        this.createComponent(EditContactComponent);
        break;
    }
  }

  createComponent(editComponent) {
    this.loadComp.clear();
    this.factory = this.resolver.resolveComponentFactory(editComponent);
    this.componentRef = this.loadComp.createComponent(this.factory);
  }

  destroyComponent() {
    if (this.componentRef != null) {
      this.componentRef.destroy();
    }
  }
}
