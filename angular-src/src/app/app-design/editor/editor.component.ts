import {Component, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  htmlContent = "<p style='color: blue'>Enter text here...</p>";
  html: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  getDirtyHTML() {
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
  }

}
