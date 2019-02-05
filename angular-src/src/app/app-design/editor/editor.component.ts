import {Component, OnInit, SecurityContext, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @Output() htmlString = new EventEmitter<string>();

  htmlContent = "<p>Enter text here...</p>";
  html: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  getDirtyHTML() {
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
  }

  passHtmlString() {
    this.htmlString.emit(this.htmlContent);
  }

}
