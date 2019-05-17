import {Component, OnInit} from '@angular/core';
import {PersonService} from "../../Services/person.service";
import {Image, Person} from "../../person/person";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CropperSettings} from "ngx-img-cropper";
import {regex} from "../../shared/regex";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  constructor(
    private personService: PersonService,
    private fb: FormBuilder,
  ) {
  }

  //editProfileForm: FormGroup;
  // List of SM Link options: //
  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];

  roles = ['Graduate Student', 'Undergraduate Student', 'Assistant Professor', 'Teacher\'s Assistant', 'Professor'];
  linkLength = "col-md-8";  // SM Link URL input box length //

  imgSrc = {image: ""};  // Cropped image source //
  cropSettings = new CropperSettings();

  editUser: Person;  // Object to post to DB //
  errMsg = "";
  phoneFormat = "10-digit phone number must be entered with dashes (e.g. 123-456-7890)";

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

  get phoneNumber() {
    return this.editProfileForm.get('phoneNumber');
  }

  get biography() {
    return this.editProfileForm.get('biography');
  }

  get office() {
    return this.editProfileForm.get('office');
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
      this.linkLength = 'col-md-8';
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
    if (this.editUser.photo) this.imgSrc.image = "data:" + this.editUser.photo.content_type + ';base64,' + this.editUser.photo.buffer;

    this.editProfileForm = this.fb.group({
      email: [this.editUser.email],
      firstName: [this.editUser.name.split(' ')[0], [Validators.required]],
      lastName: [this.editUser.name.split(' ')[1], [Validators.required]],
      role: [this.editUser.role, [Validators.required]],
      myWebsite: [this.editUser.my_website_link],
      smLinks: this.fb.array([this.smLink()]),
      image: [this.imgSrc.image],
      phoneNumber: [this.editUser.phone_number, [Validators.pattern(regex.phone)]],
      biography: [this.editUser.biography],
      office: [this.editUser.office_location]
    });

    // Add user links if they already exist
    if (this.editUser.links) {
      this.deleteSMLinks(0);
      for (let i = 0; i < this.editUser.links.length; i++) {
        this.smLinks.push(this.fb.group({
          URL: [`${this.editUser.links[i].URL}`],
          description: [`${this.editUser.links[i].description}`]
        }))
      }
    }
  }

  submitUserEdits(html) {
    this.editUser.name = this.firstName.value + " " + this.lastName.value;
    this.editUser.my_website_link = this.editProfileForm.get('myWebsite').value;
    this.editUser.links = this.smLinks.value;
    this.editUser.role = this.role.value;
    this.editUser.phone_number = this.phoneNumber.value;
    this.editUser.biography = html;
    this.editUser.office_location = this.office.value;

    // Prepare photo data: //
    //------------------------//
    // Separate image buffer from content type in image string //
    if (this.imgSrc.image != "") {
      this.editUser.photo = new Image();

      let img = this.imgSrc.image.split(',');

      if (img[1].length > 0) {
        this.editUser.photo.buffer = img[1];
      } else {
        this.editUser.photo = null;
      }

      // Set image file type //
      if (img[0].search('jpeg' || 'jpg') != -1) {
        this.editUser.photo.content_type = 'image/jpeg';
      } else if (img[0].search('png') != -1) {
        this.editUser.photo.content_type = 'image/png';
      } else {
        this.editUser.photo = null;
      }
    }

    // do not send email in the request, it can't be edited anyway.
    delete this.editUser.email;

    this.personService.updatePerson(this.editUser)
      .subscribe(
        res => {
          window.alert(res['message']);
          window.scroll(0,0);
          //location.reload();
        }, err => {
          this.errMsg = err.message;
        }
      )
  }
}
