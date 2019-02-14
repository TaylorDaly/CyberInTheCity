import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SignupService} from "./signup.service";
import {FormBuilder, FormArray, Validators, FormGroup} from "@angular/forms";
import {PasswordValidator} from "../shared/password.validator";
import {CropperSettings} from "ngx-img-cropper";
import {Person} from "../person/person";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, AfterViewInit {

  signupForm: FormGroup;
  // List of SM Link options: //
  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];
  passwordLength = 8;
  linkLength = "col-md-9";  // SM Link URL input box length //
  linksLimit = false;  // Limit of SM Link inputs //
  smLinksLimit = 5;

  imgSrc = {image: ""};  // Cropped image source //
  cropSettings = new CropperSettings();

  newUser: Person;  // Object to post to DB //
  errMsg = "Blah";

  get firstName() {
    return this.signupForm.get('firstName');
  }
  get lastName() {
    return this.signupForm.get('lastName');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get smLinks(){
    return this.signupForm.get('smLinks') as FormArray;
  }

  constructor(private signupService: SignupService,
              private fb: FormBuilder,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.setCropSettings();

    this.signupForm = this.fb.group({
      email: [localStorage.getItem('signupEmail')],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(this.passwordLength)]],
      confirmPassword: ['',[Validators.required]],
      myWebsite: [''],

      smLinks: this.fb.array([this.smLink()])
    }, {validators: PasswordValidator});
  }

  ngAfterViewInit() {
    this.ref.detectChanges();
  }

  descRequired(i){
    const desc = this.smLinks.at(i).get('description');

    this.smLinks.at(i).get('URL').valueChanges
      .subscribe(changed => {
        if(changed && desc.value === "") {
          desc.setValidators(Validators.required);
        }else {
          desc.clearValidators();
        }
        desc.updateValueAndValidity();
      });
  }

  smLink():FormGroup {
    return this.fb.group({
      URL:[''],
      description:['']
    });
  }

  addSMLinks() {
    this.linkLength = 'col-md-8';
    if(this.smLinks.length < this.smLinksLimit) {
      this.smLinks.push(this.smLink());
    } else {
      this.linksLimit = true;
    }
  }

  deleteSMLinks(index: number) {
    this.linksLimit = false;
    this.smLinks.removeAt(index);
    if(this.smLinks.length <= 1)
      this.linkLength = 'col-md-9';
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

  addUser() {
    this.newUser.name = this.firstName.value + " " + this.lastName.value;
    this.newUser.email = this.signupForm.get('email').value;
    this.newUser.my_website_link = this.signupForm.get('myWebsite').value;
    this.newUser.links = this.smLinks.value;
    this.newUser.password = this.password.value;

    // Prepare photo data: //
    //------------------------//
    // Separate image buffer from content type in image string //
    let img = this.imgSrc.image.split(',');

    // Set image file type //
    if(img[0].search('jpeg' || 'jpg') != -1) {
      this.newUser.photo.content_type = 'image/jpeg';
    } else if (img[0].search('png') != -1) {
      this.newUser.photo.content_type = 'image/png';
    } else {
      this.newUser.photo = null;
    }

    if(img[1].length > 0) {
      this.newUser.photo.buffer = img[1];
    } else {
      this.newUser.photo = null;
    }

    console.log(this.newUser);
    //------------------------//
    //this.signupService.postNewUser(localStorage.getItem('token'), newUser);
  }
}
