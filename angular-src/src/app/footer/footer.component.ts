import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentYear = new Date().getUTCFullYear();
  constructor() { }

  ngOnInit() {
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
