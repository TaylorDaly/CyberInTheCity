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

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('editComponent', {read: ViewContainerRef}) loadComp: ViewContainerRef;

  componentRef: any;
  factory: any;

  parents = new navItems().getParents();
  errMsg = "";

  constructor(private resolver: ComponentFactoryResolver) {
    this.parents.splice(this.parents.map((parent) => {
      return parent.name;
    }).indexOf("News"), 1);

    if (localStorage.getItem('sys_role') == "Admin") {
      this.parents.splice(this.parents.map((parent) => {
        return parent.name;
      }).indexOf("People"), 1);
    }
  }

  ngOnInit() {
    this.editComp('Static');
  }

  // Loading editing components for each Nav parent and static pages //
  editComp(edit: string) {
    this.destroyComponent();
    switch (edit) {
      case "Static":
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
      case "Contact Us":
        this.createComponent(EditContactComponent);
        break;
      default:
        this.createComponent(EditStaticComponent);
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
