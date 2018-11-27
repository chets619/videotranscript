import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as Vtt from 'vtt-creator';
import * as vttToJson from "vtt-json";
import 'rxjs/Rx';

// const URL = '/api/';
const URL = 'http://localhost:4200/upload';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.styl']
})
export class VideoComponentComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  constructor() { }

  ngOnInit() {
    var v = new Vtt();
    v.add(1.05, 4, 'Never drink liquid nitrogen.', 'align:middle line:84%');
    v.add(5, 9, ['It will perforate your stomach.', 'You could die.']);

    // this.saveFile(v.toString());

    vttToJson(v.toString()).then((result) => {
      console.log(result)
    });
  }

  saveFile(data) {
    let name = 'sample.vtt';
    let type = 'data:attachment/text';
    if (data != null && navigator.msSaveBlob)
      return navigator.msSaveBlob(new Blob([data], { type: type }), name);

    let a = document.createElement("a");
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

}
