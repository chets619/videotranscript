import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubtitleObject } from '../video-component/video-component.component';

@Component({
  selector: 'app-subtitle-editor',
  templateUrl: './subtitle-editor.component.html',
  styleUrls: ['./subtitle-editor.component.styl']
})
export class SubtitleEditorComponent implements OnInit {

  @Input() subtitle: SubtitleObject;
  @Output() goToTime = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  convertToISO(seconds: string) {
    if (!seconds)
      return;
    var date = new Date(null);
    date.setSeconds(Number(seconds));
    return date.toISOString().substr(11, 8);
  }

  setTime() {
    this.goToTime.emit(this.subtitle.startTime);
  }

}
