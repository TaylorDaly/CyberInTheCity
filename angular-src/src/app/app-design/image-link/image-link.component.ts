import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-link',
  templateUrl: './image-link.component.html',
  styleUrls: ['./image-link.component.css']
})
export class ImageLinkComponent implements OnInit {

  share_link = "";
  image_url = "";
  google_img_url = "https://drive.google.com/uc?export=view&id=";
  errMsg = "";

  constructor() { }

  ngOnInit() {
  }

  generateURL() {
    let id = "";
    this.errMsg = "";
    this.image_url = "";
    let split_link = this.share_link.split('https://drive.google.com/')[1];

    if(split_link == undefined ) {
      this.errMsg = "Error: Invalid shareable link entered.";
      return;
    }

    if (split_link.indexOf("open?id=") != -1) {
      id = split_link.split("open?id=")[1];
    } else {
      id = split_link.split('/')[2];
    }
    this.image_url = `${this.google_img_url}${id}`;
  }

  copyURL(imgURL) {
    imgURL.select();
    document.execCommand('copy');
    imgURL.setSelectionRange(0, 0);
    alert('Copied to clipboard!');
  }
}
