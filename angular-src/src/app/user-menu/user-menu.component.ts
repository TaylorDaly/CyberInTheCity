import {Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  OnInit} from '@angular/core';
import {navItems} from "../navmenu/navItems";
import {EditStaticComponent} from "./edit-admin/edit-static/edit-static.component";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {

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
