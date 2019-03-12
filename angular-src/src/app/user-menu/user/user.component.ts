import {Component, OnInit} from '@angular/core';
import {PageService} from "../../Services/page.service";
import {PersonService} from "../../Services/person.service";
import {Person} from "../../person/person";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CropperSettings} from "ngx-img-cropper";
import {regex} from "../../../environments/environment";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  constructor(
    private personService: PersonService,
    private fb: FormBuilder
  ) {
  }

  //editProfileForm: FormGroup;
  // List of SM Link options: //
  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];

  roles = ['Graduate Student', 'Undergraduate Student', 'Assistant Professor', 'Teacher\'s Assistant', 'Professor'];
  linkLength = "col-md-9";  // SM Link URL input box length //

  imgSrc = {image: ""};  // Cropped image source //
  cropSettings = new CropperSettings();

  editUser = new Person();  // Object to post to DB //
  errMsg = "";

  editProfileForm: FormGroup;

  async ngOnInit() {
    this.getUser();
    this.setCropSettings();
  }

  getUser() {
    this.personService.getCurrentUser()
      .subscribe(
        res => {
          this.editUser = res;
          this.initForm();
        },
        err => this.errMsg = err.message
      );
  }

  get firstName() {
    return this.editProfileForm.get('firstName');
  }

  get lastName() {
    return this.editProfileForm.get('lastName');
  }

  get role() {
    return this.editProfileForm.get('role');
  }

  get smLinks() {
    return this.editProfileForm.get('smLinks') as FormArray;
  }

  setCropSettings() {
    this.cropSettings = new CropperSettings();
    this.cropSettings.width = 200;
    this.cropSettings.height = 200;
    this.cropSettings.croppedWidth = 200;
    this.cropSettings.croppedHeight = 200;
    this.cropSettings.canvasWidth = 300;
    this.cropSettings.canvasHeight = 300;

    // Allow only jpg/jpeg and png files //
    this.cropSettings.allowedFilesRegex = /.(jpe?g|png)$/i;
  }

  smLink(): FormGroup {
    return this.fb.group({
      URL: [''],
      description: ['']
    });
  }

  addSMLinks() {
    this.linkLength = 'col-md-8';
    if (this.smLinks.length < 5) {
      this.smLinks.push(this.smLink());
    }
  }

  deleteSMLinks(index: number) {
    this.smLinks.removeAt(index);
    if (this.smLinks.length <= 1)
      this.linkLength = 'col-md-9';
  }

  descRequired(i) {
    const desc = this.smLinks.at(i).get('description');

    this.smLinks.at(i).get('URL').valueChanges
      .subscribe(changed => {
        if (changed && desc.value === "") {
          desc.setValidators(Validators.required);
        } else {
          desc.clearValidators();
        }
        desc.updateValueAndValidity();
      });
  }

  initForm() {
    if (this.editUser.photo) this.imgSrc.image = this.editUser.photo.content_type.split('/')[1] + ',' + this.editUser.photo.buffer;
    this.editProfileForm = new FormGroup({
      email: new FormControl(this.editUser.email),
      firstName: new FormControl(this.editUser.name.split(' ')[0], [Validators.required]),
      lastName: new FormControl(this.editUser.name.split(' ')[1], [Validators.required]),
      role: new FormControl(this.editUser.role, [Validators.required]),
      myWebsite: new FormControl(this.editUser.my_website_link),
      // add links
      smLinks: new FormControl(this.fb.array([this.editUser.links])),
      image: new FormControl(this.imgSrc.image)
    })
  }

  submitUserEdits() {
    this.editUser.name = this.firstName.value + " " + this.lastName.value;
    this.editUser.email = this.editProfileForm.get('email').value;
    this.editUser.my_website_link = this.editProfileForm.get('myWebsite').value;
    this.editUser.links = this.smLinks.value['value'];
    this.editUser.role = this.role.value;

    // Prepare photo data: //
    //------------------------//
    // Separate image buffer from content type in image string //
    if(this.imgSrc.image != "") {
      let img = this.imgSrc.image.split(',');

      // Set image file type //
      if(img[0].search('jpeg' || 'jpg') != -1) {
        this.editUser.photo.content_type = 'image/jpeg';
      } else if (img[0].search('png') != -1) {
        this.editUser.photo.content_type = 'image/png';
      } else {
        this.editUser.photo = null;
      }

      if(img[1].length > 0) {
        this.editUser.photo.buffer = img[1];
      } else {
        this.editUser.photo = null;
      }
    }
    console.log(this.editUser);
    this.personService.updatePerson(this.editUser)
      .subscribe(
        res => {
          window.alert(res['message']);
        }, err => {
          this.errMsg = err.message;
        }
      )
  }
}
