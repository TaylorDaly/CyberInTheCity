import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  personList = [
    {
      email: 'haadi.jafarian@ucdenver.edu',
      name: 'Haadi Jafarian',
      role: 'Professor',
      image: 'https://storage.googleapis.com/kaggle-avatars/images/290447-fb.jpg'
    },
    {
      email: 'thomas.augustine@ucdenver.edu',
      name: 'Thomas Augustine',
      role: 'Professor',
      image: 'http://www.ucdenver.edu/academics/colleges/Engineering/Programs/Computer-Science-and-Engineering/faculty/PublishingImages/augustine_web.jpg'
    },
  ];

  constructor() { }

  ngOnInit() {

  }

}
