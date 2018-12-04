import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subtitle-editor',
  templateUrl: './subtitle-editor.component.html',
  styleUrls: ['./subtitle-editor.component.styl']
})
export class SubtitleEditorComponent implements OnInit {

  @Input() subtitleJson = [];

  constructor() { }

  ngOnInit() {
    this.processJson();
  }

  processJson() {
    let a = this.subtitleJson;
    debugger;
  }

}
