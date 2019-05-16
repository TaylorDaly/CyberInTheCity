import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {PersonService} from "../../../../Services/person.service";
import {ListDataComponent} from "../../../../app-design/list-data/list-data.component";
import {Person} from "../../../../person/person";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CropperSettings, ImageCropperComponent} from "ngx-img-cropper";
import {regex} from "../../../../shared/regex";

@Component({
  selector: 'app-edit-people',
  templateUrl: './edit-people.component.html',
  styleUrls: ['./edit-people.component.css']
})
export class EditPeopleComponent implements OnInit {

  @ViewChild('loadComp', {read: ViewContainerRef}) loadComp: ViewContainerRef;
  //@ViewChild('peopleComp', {read: ViewContainerRef}) peopleComp: ViewContainerRef;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  componentRef: any;
  factory: any;

  personFull: Person[];
  personList = [];
  personFields = ['name', 'email', 'role', 'verified'];

  editPerson = false;
  errMsg = "";
  edit = {
    _id: "",
    option: "add"
  };

  createPerson: FormGroup;
  cropSettings = new CropperSettings();
  linkLength = "col-md-9";  // SM Link URL input box length //
  roles = ['Graduate Student', 'Undergraduate Student', 'Assistant Professor', 'Teacher\'s Assistant', 'Professor'];
  smList = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];
  sysRoles = ['User', 'Admin', 'Sys_Admin'];

  imgSrc = {image: ''};  // Cropped image source //
  emptyLink = {URL: '', description: ''};
  phoneFormat = "10-digit phone number must be entered with dashes (e.g. 123-456-7890)";

  get name() {
    return this.createPerson.get('name');
  }

  get role() {
    return this.createPerson.get('role');
  }

  get email() {
    return this.createPerson.get('email');
  }

  get password() {
    return this.createPerson.get('password');
  }

  get sys_role() {
    return this.createPerson.get('sys_role');
  }

  get links() {
    return this.createPerson.get('links') as FormArray;
  }

  get photo() {
    return this.createPerson.get('photo');
  }

  get biography() {
    return this.createPerson.get('biography');
  }

  get myWebsite() {
    return this.createPerson.get('my_website_link');
  }

  constructor(private personService: PersonService,
              private fb: FormBuilder,
              private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.resetForm();
    this.getAllPeople();
    this.setCropSettings();
  }

  resetForm() {
    this.createPerson = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      photo: this.fb.group({
        content_type: [''],
        buffer: ['']
      }),
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(regex.email)]],
      my_website_link: [''],
      links: this.fb.array([this.smLink(this.emptyLink)]),
      sys_role: ['User', Validators.required],
      verified: ['true'],
      phone_number: ['', [Validators.pattern(regex.phone)]],
      office_location: [''],
      biography: ['']
    });
  }

  smLink(value): FormGroup {
    return this.fb.group({
      URL: [value.URL],
      description: [value.description]
    });
  }

  descRequired(i) {
    const desc = this.links.at(i).get('description');

    this.links.at(i).get('URL').valueChanges
      .subscribe(changed => {
        if (changed && desc.value === "") {
          desc.setValidators(Validators.required);
        } else {
          desc.clearValidators();
        }
        desc.updateValueAndValidity();
      });
  }

  addSMLinks(value) {
    this.linkLength = 'col-md-8';
    if (this.links.length < 5) {
      this.links.push(this.smLink(value));
    }
  }

  deleteSMLinks(index: number) {
    this.links.removeAt(index);
    if (this.links.length <= 1)
      this.linkLength = 'col-md-9';
  }

  resetSettings() {
    this.errMsg = "";
    this.edit.option = "add";
    this.editPerson = false;
    this.resetForm();
    this.imgSrc = {image: ""};
    window.scroll(0,0);
  }

  getAllPeople() {
    this.personService.getAllPeople()
      .subscribe(
        res => {
          this.personFull = res;
          this.setPersonList(res);
          this.createTable();
        },
        err => {
          this.errMsg = err.message;
        }
      )
  }

  setPersonList(data) {
    for (let i = 0; i < data.length; ++i) {
      this.personList.push({
        _id: data[i]._id, name: data[i].name, email: data[i].email,
        role: data[i].sys_role, verified: data[i].verified.toString().charAt(0).toUpperCase()
      });
    }
  }

  addNewPerson() {
    this.resetForm();
    this.editPerson = true;
  }

  setCropSettings() {
    this.cropSettings.width = 200;
    this.cropSettings.height = 200;
    this.cropSettings.croppedWidth = 200;
    this.cropSettings.croppedHeight = 200;
    this.cropSettings.canvasWidth = 300;
    this.cropSettings.canvasHeight = 300;

    // Allow only jpg/jpeg and png files //
    this.cropSettings.allowedFilesRegex = /.(jpe?g|png)$/i;
  }

  createTable() {
    this.loadComp.clear();
    this.factory = this.resolver.resolveComponentFactory(ListDataComponent);
    this.componentRef = this.loadComp.createComponent(this.factory);
    this.componentRef.instance.listItems = this.personList;
    this.componentRef.instance.listFields = this.personFields;
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
    this.personList = [];
    this.getAllPeople();
    this.createTable();
  }

  cleanObject() {
    for (let i = 0; i < this.links.value.length; ++i) {
      if (this.links.value[i].description == '' || this.links.value[i].URL == '') {
        //console.log(this.links.value[i]);
        this.links.value.splice(i, 1);
        i -= 1;
      }
    }
  }

  setPhotoData() {
    if (this.imgSrc.image != "") {
      let img = this.imgSrc.image.split(',');

      // Set image file type //
      if (img[0].search('jpeg' || 'jpg') != -1) {
        this.photo.patchValue({
          content_type: 'image/jpeg'
        })
      } else if (img[0].search('png') != -1) {
        this.photo.patchValue({
          content_type: 'image/jpeg'
        })
      } else {
        this.createPerson.patchValue({
          photo: null
        })
      }

      if (img[1].length > 0) {
        this.photo.patchValue({
          buffer: img[1]
        })
      } else {
        this.createPerson.patchValue({
          photo: null
        })
      }
    } else this.photo.disable();
  }

  getPersonImage(_id) {
    this.personService.getPersonById(_id)
      .subscribe(
        res => {
          if (res.hasOwnProperty('photo') && res.photo != null) {
            if (res.photo.content_type != null && res.photo.buffer != null) {
              this.imgSrc.image = "data:" + res.photo.content_type +
                ';base64,' + res.photo.buffer;
            }
          }
        },
        err => {
          this.errMsg = err.message;
        }
      );
  }

  // fileChangeListener($event) {
  //   let image:any = new Image();
  //   let file:File = $event.target.files[0];
  //   let myReader:FileReader = new FileReader();
  //   let that = this;
  //   myReader.onloadend = function (loadEvent:any) {
  //     image.src = loadEvent.target.result;
  //     that.cropper.setImage(image);
  //
  //   };
  //
  //   myReader.readAsDataURL(file);
  // }

  editTable(editObj) {  // Returns id and option in object //
    this.edit = editObj;
    this.imgSrc = {image: ''};
    if (editObj.option == "update") {
      this.getPersonImage(editObj._id);
      let person = this.personFull.find(x => x._id === editObj._id);
      //console.log(person);
      if (person != null) {
        this.createPerson.patchValue({
          _id: editObj._id,
          name: person.name,
          role: person.role,
          email: person.email,
          my_website_link: person.my_website_link,
          links: person.links,
          sys_role: person.sys_role,
          verified: person.verified,
          phone_number: person.phone_number,
          office_location: person.office_location,
          biography: person.biography
        });
        for (let i = 1; i < person.links.length; ++i) {
          this.addSMLinks(person.links[i]);
        }
        this.editPerson = true;
      }
    } else {  // Delete loadComp item //
      if (window.confirm('Are you sure you want to delete this person?')) {
        this.personService.deletePerson(editObj._id)
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

  savePerson(html) {
    this.createPerson.patchValue({
      biography: html
    });

    this.cleanObject();
    this.setPhotoData();
    if (this.edit.option === "add") {
      this.personService.addPerson(this.createPerson.value)
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
    } else { // Update person //
      //console.log(this.createPerson.value);
      this.personService.updatePerson(this.createPerson.value)
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

  // createComponent(editComponent) {
  //   this.loadComp.clear();
  //   this.factory = this.resolver.resolveComponentFactory(editComponent);
  //   this.componentRef = this.loadComp.createComponent(this.factory);
  // }
  //
  // destroyComponent() {
  //   if (this.componentRef != null) {
  //     this.componentRef.destroy();
  //   }
  // }
}
