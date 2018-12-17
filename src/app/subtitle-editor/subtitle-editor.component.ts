import { Component, OnInit, Input } from '@angular/core';
import { SubtitleObject } from '../video-component/video-component.component';

@Component({
  selector: 'app-subtitle-editor',
  templateUrl: './subtitle-editor.component.html',
  styleUrls: ['./subtitle-editor.component.styl']
})
export class SubtitleEditorComponent implements OnInit {

  @Input() subtitle: SubtitleObject;

  constructor() { }

  ngOnInit() {
  }

  convertToISO(seconds: string) {
    var date = new Date(null);
    date.setSeconds(Number(seconds));
    return date.toISOString().substr(11, 8);
  }

}
