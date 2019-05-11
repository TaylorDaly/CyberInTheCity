import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @Input() disabled: boolean;
  @Input() htmlContent: string;
  @Output() htmlString = new EventEmitter<string>();

  //htmlContent = "<p>Enter text here...</p>";
  html: SafeHtml;

  removeButtons ='Source,Form,Checkbox,Radio,TextField,Textarea,Select,' +
    'Button,ImageButton,HiddenField,Flash,Iframe,ShowBlocks,Anchor,Cut,Copy,Paste,' +
    'PasteText,PasteFromWord,Templates,CopyFormatting,RemoveFormat,CreateDiv';

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  // Remove security so can preview HTML page with inline styles //
  getDirtyHTML() {
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
  }

  passHtmlString() {
    this.htmlString.emit(this.htmlContent);
  }

}
