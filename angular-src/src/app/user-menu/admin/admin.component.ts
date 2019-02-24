import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {navItems} from "../../navmenu/navItems";
import {EditStaticComponent} from "../edit-admin/edit-static/edit-static.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('editComponent', {read: ViewContainerRef}) entry: ViewContainerRef;

  componentRef: any;
  factory: any;

  parents = new navItems().getParents();

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.editStaticPage();
  }

  editStaticPage() {
    this.destroyComponent();
    this.createComponent(EditStaticComponent);
  }

  createComponent(editComponent) {
    this.entry.clear();
    this.factory = this.resolver.resolveComponentFactory(editComponent);
    this.componentRef = this.entry.createComponent(this.factory);
  }

  destroyComponent() {
    if(this.componentRef != null) {
      this.componentRef.destroy();
    }
  }

}
