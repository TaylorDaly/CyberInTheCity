import {Input, Component, OnInit} from '@angular/core';
import {SignupService} from "../Services/signup.service";
import {FormBuilder, FormArray, Validators, FormGroup} from "@angular/forms";
import {PasswordValidator} from "../shared/password.validator";
import {CropperSettings} from "ngx-img-cropper";
import {Person} from "../person/person";
import {Router} from "@angular/router";
import {regex} from "../shared/regex";
import {PersonService} from "../Services/person.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  // List of SM Link options: //
  links = ['Facebook', 'Twitter', 'LinkedIn', 'Google', 'RSS'];

  roles = ['Graduate Student', 'Undergraduate Student', 'Assistant Professor', 'Teacher\'s Assistant', 'Professor'];
  passwordLength = 8;
  linkLength = "col-md-9";  // SM Link URL input box length //

  imgSrc = {image: ""};  // Cropped image source //
  cropSettings = new CropperSettings();

  newUser = new Person();  // Object to post to DB //
  errMsg = "";
  pwdRequirements = 'Password must contain at least one upper case letter, ' +
    'one lower case letter, ' +
    'one number, ' +
    'one special character (#?!@$%^&*-), ' +
    'and be eight characters in length. ' +
    'Other characters are not allowed.';

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get role() {
    return this.signupForm.get('role');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  get smLinks() {
    return this.signupForm.get('smLinks') as FormArray;
  }

  constructor(private signupService: SignupService,
              private personService: PersonService,
              private fb: FormBuilder,
              private router: Router,) {
  }

  ngOnInit() {
    this.setCropSettings();
    this.checkPersonExist();
  }

  checkPersonExist() {
    this.populateForm();
    this.personService.getPersonByEmail(sessionStorage.getItem('signupEmail'))
      .subscribe(
        res => {
          this.signupForm.patchValue({
            email: res['email'],
            firstName: res['name'].split(' ')[0],
            lastName: res['name'].split(' ')[1],
            role: res['role'],
            myWebsite: res['my_website_link'],
            smLinks: res['links']
          });
          this.getPersonImage(res['_id']);
        },
        err => {
          // Do nothing //
        }
      )
  }

  populateForm() {
    this.signupForm = this.fb.group({
      email: [sessionStorage.getItem('signupEmail')],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(this.passwordLength), Validators.pattern(regex.password)]],
      confirmPassword: ['', [Validators.required]],
      myWebsite: [''],

      smLinks: this.fb.array([this.smLink()])
    }, {validators: PasswordValidator});
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

  cleanObject() {
    for (let i = 0; i < this.smLinks.value.length; ++i) {
      if (this.smLinks.value[i].description == '' || this.smLinks.value[i].URL == '') {
        console.log(this.smLinks.value[i]);
        this.smLinks.value.splice(i, 1);
        i -= 1;
      }
    }
  }

  addUser() {
    this.cleanObject();

    this.newUser.name = this.firstName.value + " " + this.lastName.value;
    this.newUser.email = this.signupForm.get('email').value;
    this.newUser.my_website_link = this.signupForm.get('myWebsite').value;
    this.newUser.links = this.smLinks.value;
    this.newUser.password = this.password.value;
    this.newUser.role = this.role.value;
    //console.log(this.newUser);

    // Prepare photo data: //
    //------------------------//
    // Separate image buffer from content type in image string //
    if (this.imgSrc.image != "") {
      let img = this.imgSrc.image.split(',');

      // Set image file type //
      if (img[0].search('jpeg' || 'jpg') != -1) {
        this.newUser.photo.content_type = 'image/jpeg';
      } else if (img[0].search('png') != -1) {
        this.newUser.photo.content_type = 'image/png';
      } else {
        this.newUser.photo = null;
      }

      if (img[1].length > 0) {
        this.newUser.photo.buffer = img[1];
      } else {
        this.newUser.photo = null;
      }
    }

    //console.log(this.newUser);
    //console.log(localStorage.getItem('token'));
    //------------------------//
    //this.signupService.postNewUser(localStorage.getItem('token'), this.newUser)
    this.signupService.postNewUser(sessionStorage.getItem('token'), this.newUser)
      .subscribe(
        res => {
          //console.log(res);
          window.alert(res['message']);
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }, err => {
          this.errMsg = err.message;
        });
  }
}
